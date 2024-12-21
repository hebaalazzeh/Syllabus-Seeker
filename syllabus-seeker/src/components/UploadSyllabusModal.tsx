// First, create an API route in src/app/api/syllabus/route.ts
import { NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const syllabusId = uuidv4();
    
    // Store the metadata in PostgreSQL
    await sql`
      INSERT INTO syllabi (
        id,
        school,
        class_name,
        professor,
        semester,
        year,
        content_type,
        s3_key
      ) VALUES (
        ${syllabusId},
        ${data.school},
        ${data.class},
        ${data.professor},
        ${data.semester},
        ${data.year},
        ${data.uploadType},
        ${`${syllabusId}${data.uploadType === 'file' ? data.fileExtension : '.txt'}`}
      )
    `;

    // Store content in S3
    const s3Key = `${syllabusId}${data.uploadType === 'file' ? data.fileExtension : '.txt'}`;
    const content = data.uploadType === 'text' ? data.syllabusText : data.syllabusFile;
    
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key,
      Body: content,
      ContentType: data.uploadType === 'file' ? data.fileType : 'text/plain',
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'Syllabus uploaded successfully',
      id: syllabusId 
    });
  } catch (error) {
    console.error('Error uploading syllabus:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload syllabus' },
      { status: 500 }
    );
  }
}