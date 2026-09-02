import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthUser, validateCreationPermission, hashPassword } from '@/lib/auth';
import { generateUserId, formatInitialPasswordFromDOB } from '@/lib/idGenerator';
import { uploadDocumentToCloudinary } from '@/lib/cloudinary';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, name, dob, gender, email, mobile, address, documentBase64 } = body;

    if (!role || !name || !dob || !gender || !email || !mobile || !address) {
      return NextResponse.json(
        { success: false, error: 'All common user fields (role, name, dob, gender, email, mobile, address) are required.' },
        { status: 400 }
      );
    }

    // Strict role validation
    const canCreate = validateCreationPermission(authUser.role, role);
    if (!canCreate) {
      return NextResponse.json(
        { success: false, error: `User with role ${authUser.role} is not permitted to create role ${role}.` },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user with this email address already exists.' },
        { status: 400 }
      );
    }

    // Parent is derived strictly from server-side authenticated session
    const parentId = authUser._id;

    // Initial password format: DOB in DD-MM-YYYY
    const initialPassword = formatInitialPasswordFromDOB(dob);
    const passwordHash = await hashPassword(initialPassword);

    // Collision-free unique user ID
    const userId = generateUserId(role);

    // Document upload to Cloudinary
    let documentUrl = '';
    let documentPublicId = '';
    if (documentBase64) {
      try {
        const uploadResult = await uploadDocumentToCloudinary(documentBase64, 'user_documents');
        documentUrl = uploadResult.url;
        documentPublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Document upload error:', uploadError);
      }
    }

    const newUser = await User.create({
      userId,
      role,
      name: name.trim(),
      dob: new Date(dob),
      gender,
      email: normalizedEmail,
      mobile: mobile.trim(),
      address: address.trim(),
      passwordHash,
      parent: parentId,
      documentUrl,
      documentPublicId,
      status: 'ACTIVE',
    });

    // Dispatch welcome email with User ID & Initial DOB password
    sendWelcomeEmail({
      toEmail: newUser.email,
      name: newUser.name,
      userId: newUser.userId,
      initialPassword,
      role: newUser.role,
    }).catch((err) => console.error('Failed sending welcome email asynchronously:', err));

    return NextResponse.json({
      success: true,
      message: `${role} account created successfully.`,
      user: {
        id: newUser._id,
        userId: newUser.userId,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        dob: newUser.dob,
        parent: newUser.parent,
        documentUrl: newUser.documentUrl,
      },
      initialPassword, // returned for display in admin toast/modal during creation
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
