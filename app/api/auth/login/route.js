import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { userIdOrEmail, password } = await request.json();

    if (!userIdOrEmail || !password) {
      return NextResponse.json(
        { success: false, error: 'User ID or Email and Password are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const query = userIdOrEmail.includes('@')
      ? { email: userIdOrEmail.toLowerCase().trim() }
      : { userId: userIdOrEmail.toUpperCase().trim() };

    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Account is inactive. Please contact your upline administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      userId: user.userId,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
      },
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
