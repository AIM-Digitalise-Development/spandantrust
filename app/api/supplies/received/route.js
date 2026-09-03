import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Supply from '@/models/Supply';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    await connectToDatabase();

    let query = { receiver: authUser._id };

    if (search) {
      query.medicineName = { $regex: search, $options: 'i' };
    }

    const supplies = await Supply.find(query)
      .populate('sender', 'name userId role')
      .sort({ supplyDate: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      supplies,
    });
  } catch (error) {
    console.error('Fetch received supplies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch received supplies' },
      { status: 500 }
    );
  }
}
