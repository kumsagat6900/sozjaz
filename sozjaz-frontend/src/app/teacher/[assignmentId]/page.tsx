// src/app/teacher/[assignmentId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";

interface Submission {
  id: string;
  content: string;
  grade: number | null;
  comment: string | null;
  createdAt: string;
  student: {
    name: string;
    login: string;
  };
}

export default function CheckSubmissionsPage() {
  const { token, role, loaded } = useAuth();
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<{ [id: string]: string | number }>({});
  const [comments, setComments] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/submissions/${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmissions(res.data);

      const initialGrades = Object.fromEntries(
        res.data.map((s: Submission) => [s.id, s.grade ?? ""])
      );
      const initialComments = Object.fromEntries(
        res.data.map((s: Submission) => [s.id, s.comment ?? ""])
      );
      setGrades(initialGrades);
      setComments(initialComments);
    } catch (err) {
      toast.error("Жауаптарды алу кезінде қате");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token || role !== "TEACHER") return;
    fetchSubmissions();
  }, [token, role, assignmentId]);

  const handleSave = async (id: string) => {
    const grade = parseInt(grades[id] as string);
    const comment = comments[id];

    if (isNaN(grade) || grade < 0 || grade > 10) {
      toast.error("Баға 0 мен 10 аралығында болуы керек");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/submissions/${id}`,
        { grade, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Сақталды ✅");

      // Перезапросим свежие данные после сохранения
      await fetchSubmissions();
    } catch (err) {
      toast.error("Сақтау кезінде қате 😢");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) return <div className="p-6">Жүктелуде...</div>;
  if (role !== "TEACHER")
    return <div className="p-6 text-red-500">Рұқсат жоқ</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">📋 Оқушылардың жауаптары</h1>

      {submissions.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Бұл тапсырмаға әлі ешкім жауап берген жоқ
        </p>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.id} className="border">
            <CardContent className="p-4 space-y-4">
              <div className="text-sm text-muted-foreground flex justify-between items-center">
                <div>
                  Ученик: <strong>{submission.student.name}</strong> (
                  {submission.student.login})
                </div>
                <div className="text-xs text-gray-400">
                  {format(new Date(submission.createdAt), "dd.MM.yyyy HH:mm")}
                </div>
              </div>

              <div>
                <Label className="text-sm">Жауап:</Label>
                {submission.content.endsWith(".mp3") ||
                submission.content.includes("audio") ? (
                  <audio
                    controls
                    src={submission.content}
                    className="w-full rounded"
                  />
                ) : (
                  <p className="text-base mt-1 border rounded p-2 bg-gray-50">
                    {submission.content}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Баға (0-10)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={grades[submission.id] ?? ""}
                    onChange={(e) =>
                      setGrades({ ...grades, [submission.id]: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Пікір</Label>
                  <Input
                    type="text"
                    value={comments[submission.id] ?? ""}
                    onChange={(e) =>
                      setComments({
                        ...comments,
                        [submission.id]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleSave(submission.id)}
                  disabled={loading}
                >
                  {loading ? "Сақталуда..." : "Сақтау"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
