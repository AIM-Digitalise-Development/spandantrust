import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Supply from '@/models/Supply';
import Patient from '@/models/Patient';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get('role');
    const userIdParam = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    await connectToDatabase();

    // Determine target users whose downline work report should be displayed
    let allowedUserIds = [];

    if (authUser.role === 'ADMIN') {
      let query = {};
      if (roleParam) query.role = roleParam;
      if (userIdParam) query._id = userIdParam;
      const users = await User.find(query).select('_id name userId role email mobile');
      allowedUserIds = users.map((u) => u._id);
    } else if (authUser.role === 'COORDINATOR') {
      const supervisors = await User.find({ parent: authUser._id, role: 'SUPERVISOR' }).select('_id');
      const supIds = supervisors.map((s) => s._id);
      const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).select('_id');
      const agentIds = agents.map((a) => a._id);
      
      let allAllowed = [authUser._id, ...supIds, ...agentIds];
      if (userIdParam) {
        allAllowed = allAllowed.filter((id) => id.toString() === userIdParam);
      }
      allowedUserIds = allAllowed;
    } else if (authUser.role === 'SUPERVISOR') {
      const agents = await User.find({ parent: authUser._id, role: 'DIGITAL_OPD_AGENT' }).select('_id');
      let agentIds = agents.map((a) => a._id);
      let allAllowed = [authUser._id, ...agentIds];
      if (userIdParam) {
        allAllowed = allAllowed.filter((id) => id.toString() === userIdParam);
      }
      allowedUserIds = allAllowed;
    } else {
      // Agent sees own report
      allowedUserIds = [authUser._id];
    }

    // Build Date Filter query
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    }

    // Fetch user details for allowed User IDs
    const targetUsers = await User.find({ _id: { $in: allowedUserIds } })
      .select('name userId role email mobile status parent')
      .populate('parent', 'name userId role');

    // Aggregate metrics per user
    const reportData = await Promise.all(
      targetUsers.map(async (user) => {
        // Collect all downline user IDs (including the target user themselves)
        let downlineUserIds = [user._id];

        if (user.role === 'ADMIN') {
          const allUsers = await User.find({}).select('_id');
          downlineUserIds = allUsers.map((u) => u._id);
        } else if (user.role === 'COORDINATOR') {
          const supervisors = await User.find({ parent: user._id, role: 'SUPERVISOR' }).select('_id');
          const supIds = supervisors.map((s) => s._id);
          const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).select('_id');
          const agentIds = agents.map((a) => a._id);
          downlineUserIds = [user._id, ...supIds, ...agentIds];
        } else if (user.role === 'SUPERVISOR') {
          const agents = await User.find({ parent: user._id, role: 'DIGITAL_OPD_AGENT' }).select('_id');
          const agentIds = agents.map((a) => a._id);
          downlineUserIds = [user._id, ...agentIds];
        }

        const supplyQuery = { sender: user._id };
        if (Object.keys(dateFilter).length > 0) supplyQuery.supplyDate = dateFilter;

        const receivedQuery = { receiver: user._id };
        if (Object.keys(dateFilter).length > 0) receivedQuery.supplyDate = dateFilter;

        // Cumulative patient query across target user's downline tree
        const patientQuery = { agent: { $in: downlineUserIds } };
        if (Object.keys(dateFilter).length > 0) patientQuery.visitDate = dateFilter;

        const [suppliesSent, suppliesReceived, patientsEntered] = await Promise.all([
          Supply.find(supplyQuery)
            .populate('receiver', 'name userId role email mobile')
            .sort({ supplyDate: -1 }),
          Supply.find(receivedQuery)
            .populate('sender', 'name userId role email mobile')
            .sort({ supplyDate: -1 }),
          Patient.find(patientQuery)
            .populate({
              path: 'agent',
              select: 'name userId role email mobile parent',
              populate: {
                path: 'parent',
                select: 'name userId role email mobile',
              },
            })
            .sort({ visitDate: -1 }),
        ]);

        const totalSentAmount = suppliesSent.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        const totalSentQuantity = suppliesSent.reduce((sum, s) => sum + (s.totalQuantity || 0), 0);
        const totalReceivedAmount = suppliesReceived.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        const totalReceivedQuantity = suppliesReceived.reduce((sum, s) => sum + (s.totalQuantity || 0), 0);

        return {
          user: {
            id: user._id,
            userId: user.userId,
            name: user.name,
            role: user.role,
            email: user.email,
            mobile: user.mobile,
            parent: user.parent,
          },
          suppliesSentCount: suppliesSent.length,
          totalSentAmount,
          totalSentQuantity,
          suppliesSentList: suppliesSent, // Full list for popup modal
          suppliesReceivedCount: suppliesReceived.length,
          totalReceivedAmount,
          totalReceivedQuantity,
          suppliesReceivedList: suppliesReceived, // Full list for popup modal
          patientCount: patientsEntered.length,
          patients: patientsEntered, // Full patient records for popup modal
        };
      })
    );

    return NextResponse.json({
      success: true,
      reports: reportData,
    });
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate work reports' },
      { status: 500 }
    );
  }
}
