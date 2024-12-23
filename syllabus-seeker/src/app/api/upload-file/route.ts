import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Upload to Cloudinary using their upload API directly
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: `data:${file.type};base64,${base64}`,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      }),
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload to Cloudinary failed');
    }

    const result = await uploadResponse.json();
    return NextResponse.json({
      success: true,
      url: result.secure_url
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

// These configurations are compatible with Edge runtime
export const runtime = 'edge';