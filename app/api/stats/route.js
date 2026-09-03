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
        supplies,
        totalPatients,
      ] = await Promise.all([
        User.countDocuments({ role: 'COORDINATOR' }),
        User.countDocuments({ role: 'SUPERVISOR' }),
        User.countDocuments({ role: 'DIGITAL_OPD_AGENT' }),
        Supply.find({}),
        Patient.countDocuments({}),
      ]);

      const totalSuppliesCount = supplies.length;
      const totalQuantitySupplied = supplies.reduce((acc, s) => acc + (s.totalQuantity || 0), 0);
      const totalSupplyAmount = supplies.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

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
      const supervisors = await User.find({ parent: authUser._id, role: 'SUPERVISOR' }).select('_id');
      const supIds = supervisors.map((s) => s._id);
      const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).select('_id');
      const agentIds = agents.map((a) => a._id);

      const downlineUserIds = [authUser._id, ...supIds, ...agentIds];

      const [receivedSupplies, sentSupplies, totalPatients] = await Promise.all([
        Supply.find({ receiver: authUser._id }),
        Supply.find({ sender: authUser._id }),
        Patient.countDocuments({ agent: { $in: downlineUserIds } }),
      ]);

      const medicineReceivedCount = receivedSupplies.length;
      const medicineSuppliedCount = sentSupplies.length;
      const totalSentQuantity = sentSupplies.reduce((acc, s) => acc + (s.totalQuantity || 0), 0);
      const totalSentAmount = sentSupplies.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

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
      const agents = await User.find({ parent: authUser._id, role: 'DIGITAL_OPD_AGENT' }).select('_id');
      const agentIds = agents.map((a) => a._id);

      const downlineUserIds = [authUser._id, ...agentIds];

      const [receivedSupplies, sentSupplies, totalPatients] = await Promise.all([
        Supply.find({ receiver: authUser._id }),
        Supply.find({ sender: authUser._id }),
        Patient.countDocuments({ agent: { $in: downlineUserIds } }),
      ]);

      const medicineReceivedCount = receivedSupplies.length;
      const medicineSuppliedCount = sentSupplies.length;
      const totalSentQuantity = sentSupplies.reduce((acc, s) => acc + (s.totalQuantity || 0), 0);
      const totalSentAmount = sentSupplies.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

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
      Patient.find({ agent: authUser._id }).sort({ visitDate: -1 }).limit(5),
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
