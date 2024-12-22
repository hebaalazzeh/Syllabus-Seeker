import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const school = searchParams.get('school') || '';
    const department = searchParams.get('department') || '';
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    const syllabi = await prisma.syllabus.findMany({
      where: {
        OR: [
          { course: { courseCode: { contains: query, mode: 'insensitive' } } },
          { course: { name: { contains: query, mode: 'insensitive' } } },
          { professor: { name: { contains: query, mode: 'insensitive' } } },
        ],
        AND: [
          school ? { course: { school: { name: { equals: school } } } } : {},
          department ? { course: { department: { name: { equals: department } } } } : {},
          year ? { year: { equals: year } } : {},
        ],
      },
      include: {
        course: {
          include: {
            school: true,
            department: true,
          },
        },
        professor: true,
        comments: true,
      },
    });

    return NextResponse.json(syllabi);
  } catch (error) {
    console.error('Error fetching syllabi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch syllabi' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const syllabus = await prisma.syllabus.create({
      data: {
        course: {
          connect: { id: data.courseId }
        },
        professor: {
          connect: { id: data.professorId }
        },
        term: data.term,
        year: data.year,
        fileUrl: data.fileUrl,
        fileData: data.fileData,
        professorRating: data.professorRating,
        courseRating: data.courseRating,
        comments: {
          create: data.comments ? {
            content: data.comments
          } : undefined
        }
      },
      include: {
        course: {
          include: {
            school: true,
            department: true,
          },
        },
        professor: true,
        comments: true,
      },
    });

    return NextResponse.json(syllabus);
  } catch (error) {
    console.error('Error creating syllabus:', error);
    return NextResponse.json(
      { error: 'Failed to create syllabus' },
      { status: 500 }
    );
  }
}