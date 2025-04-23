export interface Submission {
  id: string;
  content: string;
  grade?: number | null;    // ✅ болды optional
  comment?: string | null;  // ✅ болды optional
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
