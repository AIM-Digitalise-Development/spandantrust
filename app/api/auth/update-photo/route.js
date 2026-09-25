import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { uploadDocumentToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { photoBase64 } = await request.json();
    if (!photoBase64) {
      return NextResponse.json({ success: false, error: 'Photo data is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Upload new profile photo to Cloudinary
    const uploadResult = await uploadDocumentToCloudinary(photoBase64, 'profile_photos');

    // Update user document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      authUser._id,
      {
        photoUrl: uploadResult.url,
        photoPublicId: uploadResult.publicId,
      },
      { new: true }
    ).select('-passwordHash');

    return NextResponse.json({
      success: true,
      message: 'Profile photo updated successfully!',
      photoUrl: updatedUser.photoUrl,
    });
  } catch (error) {
    console.error('Update profile photo error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile photo' },
      { status: 500 }
    );
  }
}
