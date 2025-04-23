export type Assignment = {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  example?: string; // ✅ Қосылды — optional (міндетті емес)
};
