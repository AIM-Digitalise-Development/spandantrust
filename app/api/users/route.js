import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status');

    await connectToDatabase();

    let query = {};

    if (authUser.role === 'ADMIN') {
      if (roleFilter) {
        query.role = roleFilter;
      }
    } else if (authUser.role === 'COORDINATOR') {
      if (roleFilter === 'DIGITAL_OPD_AGENT') {
        // Coordinator viewing downline Agents: find all Supervisors of this Coordinator first
        const supervisors = await User.find({ parent: authUser._id, role: 'SUPERVISOR' }).select('_id');
        const supervisorIds = supervisors.map((s) => s._id);
        query = { parent: { $in: supervisorIds }, role: 'DIGITAL_OPD_AGENT' };
      } else {
        // Default Coordinator view: Own Supervisors
        query = { parent: authUser._id, role: 'SUPERVISOR' };
      }
    } else if (authUser.role === 'SUPERVISOR') {
      query = { parent: authUser._id, role: 'DIGITAL_OPD_AGENT' };
    } else {
      // Digital OPD Agent has no downline
      return NextResponse.json({ success: true, users: [] });
    }

    if (statusFilter) {
      query.status = statusFilter;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .populate('parent', 'name userId role')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
