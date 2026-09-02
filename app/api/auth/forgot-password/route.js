import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // For security reasons, don't leak user existence directly
    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({
        success: true,
        message: 'If an active account exists with that email, a password reset link has been dispatched.',
      });
    }

    // Delete previous reset tokens for this user
    await PasswordResetToken.deleteMany({ user: user._id });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      user: user._id,
      token,
      expiresAt,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spandantrust-two.vercel.app/';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail({
      toEmail: user.email,
      name: user.name,
      resetUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'If an active account exists with that email, a password reset link has been dispatched.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process forgot password request' },
      { status: 500 }
    );
  }
}
