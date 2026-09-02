import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const resetDoc = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired password reset link.' },
        { status: 400 }
      );
    }

    const user = await User.findById(resetDoc.user);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    // Remove used reset token
    await PasswordResetToken.deleteOne({ _id: resetDoc._id });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You may now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
