import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Patient from '@/models/Patient';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      patientName,
      dobOrAge,
      gender,
      mobile,
      address,
      patientDetails,
      visitDate,
      opdDetails,
      extraData,
    } = await request.json();

    if (!patientName || !dobOrAge || !gender || !mobile || !address) {
      return NextResponse.json(
        { success: false, error: 'Patient Name, DOB/Age, Gender, Mobile Number, and Address are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const patient = await Patient.create({
      agent: authUser._id,
      patientName: patientName.trim(),
      dobOrAge: dobOrAge.trim(),
      gender,
      mobile: mobile.trim(),
      address: address.trim(),
      patientDetails: patientDetails ? patientDetails.trim() : '',
      visitDate: visitDate ? new Date(visitDate) : new Date(),
      opdDetails: opdDetails ? opdDetails.trim() : '',
      extraData: extraData || {},
    });

    const populatedPatient = await Patient.findById(patient._id).populate(
      'agent',
      'name userId role email mobile'
    );

    return NextResponse.json({
      success: true,
      message: 'Patient record created successfully.',
      patient: populatedPatient,
    });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add patient entry' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    await connectToDatabase();

    let agentFilter = {};

    if (authUser.role === 'DIGITAL_OPD_AGENT') {
      agentFilter = { agent: authUser._id };
    } else if (authUser.role === 'SUPERVISOR') {
      const agents = await User.find({ parent: authUser._id, role: 'DIGITAL_OPD_AGENT' }).select('_id');
      const agentIds = agents.map((a) => a._id);
      agentFilter = { agent: { $in: agentIds } };
    } else if (authUser.role === 'COORDINATOR') {
      const supervisors = await User.find({ parent: authUser._id, role: 'SUPERVISOR' }).select('_id');
      const supIds = supervisors.map((s) => s._id);
      const agents = await User.find({ parent: { $in: supIds }, role: 'DIGITAL_OPD_AGENT' }).select('_id');
      const agentIds = agents.map((a) => a._id);
      agentFilter = { agent: { $in: agentIds } };
    } else if (authUser.role === 'ADMIN') {
      agentFilter = {}; // All patients
    }

    let query = { ...agentFilter };

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { opdDetails: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.visitDate.$lte = end;
      }
    }

    const patients = await Patient.find(query)
      .populate('agent', 'name userId role email mobile')
      .sort({ visitDate: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error('Fetch patients error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patient records' },
      { status: 500 }
    );
  }
}
