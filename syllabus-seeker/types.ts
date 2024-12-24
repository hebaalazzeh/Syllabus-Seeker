// src/types.ts
export interface Rating {
  id: string;
  courseRating?: number | null;
  professorRating?: number | null;
  comment?: string | null;
  createdAt: string;
}

export interface Syllabus {
  id: string;
  year: number;
  term: string;
  fileUrl?: string | null;
  textContent?: string | null;
  course: {
    name: string;
    courseCode: string;
    school: {
      name: string;
    };
  };
  professor: {
    name: string;
  };
  ratings: Rating[];
}
