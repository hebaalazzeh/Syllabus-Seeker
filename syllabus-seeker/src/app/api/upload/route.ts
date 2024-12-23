import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const POST = async (req: Request) =>{
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.schoolName || !data.courseCode || !data.courseName || !data.professorName || !data.year || !data.term) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Create the syllabus and its relationships
    const result = await prisma.$transaction(async (tx) => {
      // Create or find school
      const school = await tx.school.upsert({
        where: { name: data.schoolName },
        update: {},
        create: { name: data.schoolName }
      });

      // Create or find professor
      const professor = await tx.professor.upsert({
        where: { name: data.professorName },
        update: {},
        create: { name: data.professorName }
      });

      // Create or find course
      const course = await tx.course.upsert({
        where: {
          schoolId_courseCode: {
            schoolId: school.id,
            courseCode: data.courseCode
          }
        },
        update: { name: data.courseName },
        create: {
          courseCode: data.courseCode,
          name: data.courseName,
          schoolId: school.id
        }
      });

      // Create syllabus
      const syllabus = await tx.syllabus.create({
        data: {
          year: parseInt(data.year.toString()),
          term: data.term,
          fileUrl: data.fileUrl || null,
          textContent: data.textContent || null,
          courseId: course.id,
          professorId: professor.id
        }
      });

      // Create rating if provided
      if (data.rating || data.notes) {
  await tx.rating.create({
    data: {
      rating: data.rating || null, // Use the single rating field
      comment: data.notes || null,
      syllabusId: syllabus.id,
      professorId: professor.id,
    },
  });
}


      // Return complete syllabus with all relationships
      return await tx.syllabus.findUnique({
        where: { id: syllabus.id },
        include: {
          course: {
            include: {
              school: true
            }
          },
          professor: true,
          ratings: true
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload syllabus'
    }, { status: 500 });
  }
}