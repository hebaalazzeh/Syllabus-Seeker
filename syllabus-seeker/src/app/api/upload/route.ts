import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names
import fs from 'fs';
import path from 'path';



export async function POST(request: Request) {
  try {
    // Parse the FormData from the request
    const formData = await request.formData();
    const schoolName = formData.get('schoolName') as string;
    const courseCode = formData.get('courseCode') as string;
    const courseName = formData.get('courseName') as string;
    const professorName = formData.get('professorName') as string;
    const year = formData.get('year') as string;
    const term = formData.get('term') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!schoolName || !courseCode || !courseName || !professorName || !year || !term || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a unique file name and file URL
    const fileName = `${uuidv4()}-${file.name}`;
    const fileUrl = `/uploads/${fileName}`; // URL path for serving the file

    // Convert the file into a buffer
    const fileBuffer = await file.arrayBuffer();

    // Save the file locally (optional for development)
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    // Database operations using Prisma
    const school = await prisma.school.upsert({
      where: { name: schoolName },
      update: {},
      create: { name: schoolName },
    });

    const course = await prisma.course.upsert({
      where: {
        schoolId_courseCode: {
          schoolId: school.id,
          courseCode: courseCode,
        },
      },
      update: { name: courseName },
      create: {
        courseCode,
        name: courseName,
        schoolId: school.id,
      },
    });

    const professor = await prisma.professor.upsert({
      where: { name: professorName },
      update: {},
      create: { name: professorName },
    });

    const syllabus = await prisma.syllabus.create({
      data: {
        year: parseInt(year),
        term,
        fileUrl,
        textContent: '', // Optional: Process file content here if needed
        courseId: course.id,
        professorId: professor.id,
      },
      include: {
        course: {
          include: {
            school: true,
          },
        },
        professor: true,
        ratings: true,
      },
    });

    // Return the created syllabus data
    return NextResponse.json(syllabus);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload syllabus' }, { status: 500 });
  }
}
