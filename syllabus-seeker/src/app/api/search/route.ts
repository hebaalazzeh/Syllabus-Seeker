import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const school = searchParams.get('school')
  const course = searchParams.get('course')
  const professor = searchParams.get('professor')
  const year = searchParams.get('year')

  try {
    const syllabi = await prisma.syllabus.findMany({
      where: {
        course: {
          AND: [
            school ? { school: { name: { contains: school, mode: 'insensitive' } } } : {},
            course ? { 
              OR: [
                { name: { contains: course, mode: 'insensitive' } },
                { courseCode: { contains: course, mode: 'insensitive' } }
              ]
            } : {},
          ]
        },
        professor: professor ? { 
          name: { contains: professor, mode: 'insensitive' }
        } : {},
        year: year ? parseInt(year) : undefined,
      },
      include: {
        course: {
          include: {
            school: true
          }
        },
        professor: true,
        ratings: true
      }
    })

    return NextResponse.json(syllabi)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search syllabi' }, { status: 500 })
  }
}