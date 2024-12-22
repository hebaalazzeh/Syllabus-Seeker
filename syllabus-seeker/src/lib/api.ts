import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSchools() {
  return prisma.school.findMany();
}

export async function getDepartments() {
  return prisma.department.findMany();
}

export async function getProfessors() {
  return prisma.professor.findMany();
}

export async function getCourses() {
  return prisma.course.findMany({
    include: {
      school: true,
      department: true,
    },
  });
}