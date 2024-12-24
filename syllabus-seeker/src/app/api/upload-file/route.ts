import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlob3psbt',
  api_key: process.env.CLOUDINARY_API_KEY || '657833836918719',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'aJ6LX6aIXaUg8ORkVVkijSOsbAc',
  secure: true
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    console.log('File Details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert File to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    console.log('Starting Cloudinary upload...');
    const result = await cloudinary.uploader.upload(base64File, {
      resource_type: 'auto',
      folder: 'syllabi',
    });

    if (!result.secure_url) {
      throw new Error('Upload failed: secure_url not returned');
    }

    console.log('Upload Response:', result);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
