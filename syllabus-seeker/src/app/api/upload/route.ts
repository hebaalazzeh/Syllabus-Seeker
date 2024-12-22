import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  try {
    const file = await request.blob();
    const uploadResult = await put(filename || `${nanoid()}.pdf`, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: uploadResult.url,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}