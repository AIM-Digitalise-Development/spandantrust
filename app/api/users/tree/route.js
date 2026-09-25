import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const formatNode = (user, children = []) => ({
      id: user._id ? user._id.toString() : user.id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      photoUrl: user.photoUrl || '',
      documentUrl: user.documentUrl || '',
      status: user.status,
      createdAt: user.createdAt,
      children,
    });

    if (authUser.role === 'ADMIN') {
      const coordinators = await User.find({ role: 'COORDINATOR' }).sort({ name: 1 }).lean();
      const coordIds = coordinators.map((c) => c._id);
      
      const supervisors = await User.find({ parent: { $in: coordIds }, role: 'SUPERVISOR' }).sort({ name: 1 }).lean();
      const supIds = supervisors.map((s) => s._id);

      const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).sort({ name: 1 }).lean();

      const coordMap = new Map();
      coordinators.forEach((c) => coordMap.set(c._id.toString(), formatNode(c, [])));

      const supMap = new Map();
      supervisors.forEach((s) => {
        const supNode = formatNode(s, []);
        supMap.set(s._id.toString(), supNode);
        const parentCoord = coordMap.get(s.parent ? s.parent.toString() : '');
        if (parentCoord) {
          parentCoord.children.push(supNode);
        }
      });

      agents.forEach((a) => {
        const agentNode = formatNode(a, []);
        const parentSup = supMap.get(a.parent ? a.parent.toString() : '');
        if (parentSup) {
          parentSup.children.push(agentNode);
        }
      });

      const rootNode = formatNode(authUser, Array.from(coordMap.values()));
      return NextResponse.json({ success: true, tree: rootNode });
    }

    if (authUser.role === 'COORDINATOR') {
      const supervisors = await User.find({ parent: authUser._id, role: 'SUPERVISOR' }).sort({ name: 1 }).lean();
      const supIds = supervisors.map((s) => s._id);

      const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).sort({ name: 1 }).lean();

      const supMap = new Map();
      supervisors.forEach((s) => {
        const supNode = formatNode(s, []);
        supMap.set(s._id.toString(), supNode);
      });

      agents.forEach((a) => {
        const agentNode = formatNode(a, []);
        const parentSup = supMap.get(a.parent ? a.parent.toString() : '');
        if (parentSup) {
          parentSup.children.push(agentNode);
        }
      });

      const rootNode = formatNode(authUser, Array.from(supMap.values()));
      return NextResponse.json({ success: true, tree: rootNode });
    }

    if (authUser.role === 'SUPERVISOR') {
      const agents = await User.find({ parent: authUser._id, role: 'DIGITAL_OPD_AGENT' }).sort({ name: 1 }).lean();
      const agentNodes = agents.map((a) => formatNode(a, []));
      const rootNode = formatNode(authUser, agentNodes);
      return NextResponse.json({ success: true, tree: rootNode });
    }

    // Agent
    return NextResponse.json({ success: true, tree: formatNode(authUser, []) });
  } catch (error) {
    console.error('Fetch tree error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to build hierarchy tree' },
      { status: 500 }
    );
  }
}
