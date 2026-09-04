import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only Admin is permitted to activate or deactivate users.' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const { id: targetUserId } = resolvedParams;

    const { status } = await request.json();

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value. Allowed values: ACTIVE, INACTIVE.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { status },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User status updated to ${status} successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user status' },
      { status: 500 }
    );
  }
}
