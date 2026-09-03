import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

    const receiverId = typeof authUser._id === 'string'
      ? new mongoose.Types.ObjectId(authUser._id)
      : authUser._id;

    let matchStage = { receiver: receiverId };

    if (search) {
      matchStage.medicineName = { $regex: search, $options: 'i' };
    }

    const supplies = await Supply.aggregate([
      { $match: matchStage },
      { $sort: { supplyDate: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          medicineName: 1,
          description: 1,
          totalAmount: 1,
          totalQuantity: 1,
          supplyDate: 1,
          senderRole: 1,
          receiverRole: 1,
          receiver: 1,
          createdAt: 1,
          updatedAt: 1,
          sender: {
            $cond: {
              if: { $ifNull: ['$sender._id', false] },
              then: {
                _id: '$sender._id',
                name: '$sender.name',
                userId: '$sender.userId',
                role: '$sender.role',
              },
              else: null,
            },
          },
        },
      },
    ]);

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
