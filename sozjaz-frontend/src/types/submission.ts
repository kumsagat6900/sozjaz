// src/types/submission.ts

export interface Submission {
    id: string;
    content: string;
    grade: number | null;
    comment: string | null;
    createdAt: string;
    student: {
      id: string;
      name: string;
      login: string;
    };
    assignment: {
      id: string;
      title: string;
      type: string;
    };
  }
  