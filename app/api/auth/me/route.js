import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
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
    },
  });
}
