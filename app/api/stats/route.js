import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Supply from '@/models/Supply';
import Patient from '@/models/Patient';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    if (authUser.role === 'ADMIN') {
      const [
        totalCoordinators,
        totalSupervisors,
        totalAgents,
        supplyAgg,
        totalPatients,
      ] = await Promise.all([
        User.countDocuments({ role: 'COORDINATOR' }),
        User.countDocuments({ role: 'SUPERVISOR' }),
        User.countDocuments({ role: 'DIGITAL_OPD_AGENT' }),
        Supply.aggregate([
          {
            $group: {
              _id: null,
              totalSuppliesCount: { $sum: 1 },
              totalQuantitySupplied: { $sum: '$totalQuantity' },
              totalSupplyAmount: { $sum: '$totalAmount' },
            },
          },
        ]),
        Patient.countDocuments({}),
      ]);

      const aggStats = supplyAgg[0] || {};
      const totalSuppliesCount = aggStats.totalSuppliesCount || 0;
      const totalQuantitySupplied = aggStats.totalQuantitySupplied || 0;
      const totalSupplyAmount = aggStats.totalSupplyAmount || 0;

      return NextResponse.json({
        success: true,
        stats: {
          totalCoordinators,
          totalSupervisors,
          totalAgents,
          totalSuppliesCount,
          totalQuantitySupplied,
          totalSupplyAmount,
          totalPatients,
        },
      });
    }

    if (authUser.role === 'COORDINATOR') {
      const supervisors = await User.find({ parent: authUser._id, role: 'SUPERVISOR' }).select('_id').lean();
      const supIds = supervisors.map((s) => s._id);
      const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).select('_id').lean();
      const agentIds = agents.map((a) => a._id);

      const downlineUserIds = [authUser._id, ...supIds, ...agentIds];

      const [receivedCount, sentAgg, totalPatients] = await Promise.all([
        Supply.countDocuments({ receiver: authUser._id }),
        Supply.aggregate([
          { $match: { sender: authUser._id } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalQuantity: { $sum: '$totalQuantity' },
              totalAmount: { $sum: '$totalAmount' },
            },
          },
        ]),
        Patient.countDocuments({ agent: { $in: downlineUserIds } }),
      ]);

      const sentStats = sentAgg[0] || {};
      const medicineReceivedCount = receivedCount;
      const medicineSuppliedCount = sentStats.count || 0;
      const totalSentQuantity = sentStats.totalQuantity || 0;
      const totalSentAmount = sentStats.totalAmount || 0;

      return NextResponse.json({
        success: true,
        stats: {
          totalSupervisors: supervisors.length,
          totalAgents: agents.length,
          medicineReceivedCount,
          medicineSuppliedCount,
          totalSentQuantity,
          totalSentAmount,
          totalPatients,
        },
      });
    }

    if (authUser.role === 'SUPERVISOR') {
      const agents = await User.find({ parent: authUser._id, role: 'DIGITAL_OPD_AGENT' }).select('_id').lean();
      const agentIds = agents.map((a) => a._id);

      const downlineUserIds = [authUser._id, ...agentIds];

      const [receivedCount, sentAgg, totalPatients] = await Promise.all([
        Supply.countDocuments({ receiver: authUser._id }),
        Supply.aggregate([
          { $match: { sender: authUser._id } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalQuantity: { $sum: '$totalQuantity' },
              totalAmount: { $sum: '$totalAmount' },
            },
          },
        ]),
        Patient.countDocuments({ agent: { $in: downlineUserIds } }),
      ]);

      const sentStats = sentAgg[0] || {};
      const medicineReceivedCount = receivedCount;
      const medicineSuppliedCount = sentStats.count || 0;
      const totalSentQuantity = sentStats.totalQuantity || 0;
      const totalSentAmount = sentStats.totalAmount || 0;

      return NextResponse.json({
        success: true,
        stats: {
          totalAgents: agents.length,
          medicineReceivedCount,
          medicineSuppliedCount,
          totalSentQuantity,
          totalSentAmount,
          totalPatients,
        },
      });
    }

    // Agent stats
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalPatients, todayPatients, recentPatients] = await Promise.all([
      Patient.countDocuments({ agent: authUser._id }),
      Patient.countDocuments({ agent: authUser._id, visitDate: { $gte: startOfDay } }),
      Patient.find({ agent: authUser._id }).sort({ visitDate: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalPatients,
        todayPatients,
        recentPatients,
      },
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
