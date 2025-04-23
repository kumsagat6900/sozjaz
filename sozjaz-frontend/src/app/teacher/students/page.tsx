// src/app/teacher/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  name: string;
  login: string;
  createdAt: string;
}

export default function StudentsPage() {
  const { token, role, loaded } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!token || role !== "TEACHER") return;

    axios
      .get("http://localhost:3000/users/students", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, [token, role]);

  if (!loaded) return <div className="p-6">Жүктелуде...</div>;
  if (role !== "TEACHER") return <div className="p-6">Қолжетімділік жоқ</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">📋 Барлық студенттер</h1>

      <Card className="overflow-x-auto border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted border-b">
            <tr>
              <th className="px-4 py-2">👤 Аты-жөні</th>
              <th className="px-4 py-2">🔑 Логин</th>
              <th className="px-4 py-2">📅 Тіркелген күні</th>
              <th className="px-4 py-2 text-right">🔍</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-accent">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2">{s.login}</td>
                <td className="px-4 py-2">
                  {format(new Date(s.createdAt), "dd.MM.yyyy HH:mm")}
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/teacher/students/${s.id}`)}
                  >
                    Жауаптар
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
