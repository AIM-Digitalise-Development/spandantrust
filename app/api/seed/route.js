import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { generateUserId, formatInitialPasswordFromDOB } from '@/lib/idGenerator';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { setupSecret, name, dob, gender, email, mobile, address, password } = body;

    const expectedSecret = process.env.SETUP_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'SETUP_SECRET environment variable is missing on server.' },
        { status: 500 }
      );
    }

    if (setupSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid setup secret.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check if an Admin already exists
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Admin account setup is already completed and permanently locked.' },
        { status: 403 }
      );
    }

    const adminEmail = (email || 'admin@medsystem.com').toLowerCase().trim();
    const adminDob = dob || '1990-01-01';
    const initialPassword = password || formatInitialPasswordFromDOB(adminDob);

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(initialPassword);
    const userId = generateUserId('ADMIN');

    const adminUser = await User.create({
      userId,
      role: 'ADMIN',
      name: name || 'System Administrator',
      dob: new Date(adminDob),
      gender: gender || 'Male',
      email: adminEmail,
      mobile: mobile || '9999999999',
      address: address || 'Head Office',
      passwordHash,
      parent: null,
      status: 'ACTIVE',
    });

    console.log(`\n[SEED SUCCESS] Admin Account Created: ${adminUser.email} (User ID: ${userId})`);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully.',
      user: {
        id: adminUser._id,
        userId: adminUser.userId,
        name: adminUser.name,
        role: adminUser.role,
        email: adminUser.email,
      },
    });
  } catch (error) {
    console.error('Error seeding admin user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
