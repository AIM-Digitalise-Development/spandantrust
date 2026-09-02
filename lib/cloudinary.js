import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads document (base64 string or file buffer) to Cloudinary.
 * Falls back safely to simulated URL during local development if Cloudinary env is not yet set up.
 */
export async function uploadDocumentToCloudinary(fileBase64OrDataUri, folder = 'user_documents') {
  if (!fileBase64OrDataUri) {
    return { url: '', publicId: '' };
  }

  if (!isCloudinaryConfigured()) {
    console.warn('[Cloudinary Warning] Cloudinary credentials missing. Returning local fallback reference.');
    // Simulated upload result for local dev testing
    const fallbackId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      url: fileBase64OrDataUri.startsWith('data:') ? fileBase64OrDataUri : `https://res.cloudinary.com/demo/image/upload/${fallbackId}.jpg`,
      publicId: fallbackId,
    };
  }

  try {
    const result = await cloudinary.uploader.upload(fileBase64OrDataUri, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload document to Cloudinary: ${error.message}`);
  }
}
