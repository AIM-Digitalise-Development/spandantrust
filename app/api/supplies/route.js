import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Supply from '@/models/Supply';
import { getAuthUser, validateSupplyPermission } from '@/lib/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, medicineName, description, totalAmount, totalQuantity } = await request.json();

    if (!receiverId || !medicineName || totalAmount === undefined || !totalQuantity) {
      return NextResponse.json(
        { success: false, error: 'Receiver, Medicine Name, Total Amount, and Total Quantity are required.' },
        { status: 400 }
      );
    }

    const amountNum = Number(totalAmount);
    const qtyNum = Number(totalQuantity);

    if (isNaN(amountNum) || amountNum < 0 || isNaN(qtyNum) || qtyNum < 1) {
      return NextResponse.json(
        { success: false, error: 'Total Amount must be >= 0 and Quantity must be >= 1.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { success: false, error: 'Receiver user not found.' },
        { status: 404 }
      );
    }

    // Enforce allowed role pairing
    const isAllowedRolePair = validateSupplyPermission(authUser.role, receiver.role);
    if (!isAllowedRolePair) {
      return NextResponse.json(
        { success: false, error: `Supplying medicine from ${authUser.role} to ${receiver.role} is not permitted.` },
        { status: 403 }
      );
    }

    // Enforce direct downline ownership
    if (receiver.parent.toString() !== authUser._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'You can only supply medicine to users directly created in your downline.' },
        { status: 403 }
      );
    }

    const supply = await Supply.create({
      sender: authUser._id,
      receiver: receiver._id,
      senderRole: authUser.role,
      receiverRole: receiver.role,
      medicineName: medicineName.trim(),
      description: description ? description.trim() : '',
      totalAmount: amountNum,
      totalQuantity: qtyNum,
      supplyDate: new Date(),
    });

    const populatedSupply = await Supply.findById(supply._id)
      .populate('sender', 'name userId role email')
      .populate('receiver', 'name userId role email');

    return NextResponse.json({
      success: true,
      message: 'Medicine supply recorded successfully.',
      supply: populatedSupply,
    });
  } catch (error) {
    console.error('Create supply error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record medicine supply' },
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

    await connectToDatabase();

    let query = { sender: authUser._id };

    if (search) {
      query.medicineName = { $regex: search, $options: 'i' };
    }

    const supplies = await Supply.find(query)
      .populate('receiver', 'name userId role email mobile')
      .sort({ supplyDate: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      supplies,
    });
  } catch (error) {
    console.error('Fetch supplies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch supplies' },
      { status: 500 }
    );
  }
}
