export interface SyllabusInput {
  year: number;
  term: string;
  fileUrl: string;
  courseId: string;
  professorId: string;
}

export interface Syllabus extends SyllabusInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  course: Course;
  professor: Professor;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}