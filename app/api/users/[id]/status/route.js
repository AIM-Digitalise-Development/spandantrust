import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';
import { formatInitialPasswordFromDOB } from '@/lib/idGenerator';
import { sendAccountApprovedEmail } from '@/lib/email';

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

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 404 }
      );
    }

    const isFirstActivation = status === 'ACTIVE' && (!targetUser.activationEmailSent || targetUser.status === 'INACTIVE');
    const updateData = { status };

    if (isFirstActivation) {
      updateData.activationEmailSent = true;

      const initialPassword = formatInitialPasswordFromDOB(targetUser.dob);
      sendAccountApprovedEmail({
        toEmail: targetUser.email,
        name: targetUser.name,
        userId: targetUser.userId,
        initialPassword,
        role: targetUser.role,
      }).catch((err) => console.error('Failed sending account approved email asynchronously:', err));
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true }
    ).select('-passwordHash');

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
