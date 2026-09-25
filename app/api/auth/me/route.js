import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  const authUser = await getAuthUser();

  if (!authUser) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }

  await connectToDatabase();
  const user = await User.findById(authUser._id)
    .populate('parent', 'name userId role mobile email')
    .select('-passwordHash')
    .lean();

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      userId: user.userId,
      role: user.role,
      name: user.name,
      dob: user.dob,
      gender: user.gender,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      status: user.status,
      documentUrl: user.documentUrl,
      createdAt: user.createdAt,
      parent: user.parent
        ? {
            id: user.parent._id,
            name: user.parent.name,
            userId: user.parent.userId,
            role: user.parent.role,
            mobile: user.parent.mobile,
            email: user.parent.email,
          }
        : null,
    },
  });
}
