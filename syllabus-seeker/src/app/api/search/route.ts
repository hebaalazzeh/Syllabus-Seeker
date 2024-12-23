import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const school = searchParams.get('school');
    const course = searchParams.get('course');
    const professor = searchParams.get('professor');
    const year = searchParams.get('year');

    console.log('Searching with params:', { school, course, professor, year });

    const syllabi = await prisma.syllabus.findMany({
  where: {
    course: {
      AND: [
        school ? { school: { name: school } } : {},
        course ? { courseCode: course } : {},
      ],
    },
    professor: professor ? { name: professor } : {},
    year: year ? parseInt(year, 10) : undefined,
  },
  include: {
    course: {
      include: {
        school: true,
      },
    },
    professor: true,
    ratings: {
      select: {
        id: true,
        courseRating: true,
        professorRating: true,
        comment: true,
        createdAt: true,
        syllabusId: true,
        professorId: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});


    return NextResponse.json(syllabi);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Search error:', error.message);
    }
    return NextResponse.json([]);
  }
}