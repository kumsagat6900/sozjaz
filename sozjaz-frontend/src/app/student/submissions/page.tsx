
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

type Submission = {
  id: string
  content: string
  grade: number | null
  comment: string | null
  assignment: {
    title: string
  }
  createdAt: string
}

export default function MySubmissions() {
  const { token, loaded, role } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])

  useEffect(() => {
    if (!token || role !== 'STUDENT') return

    axios
      .get('http://localhost:3000/submissions/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err))
  }, [token, role])

  if (!loaded) return <div className="p-6 text-center">Жүктелуде...</div>
  if (role !== 'STUDENT') return <div className="p-6 text-center text-red-500">Қолжетімділік жоқ</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📥 Менің жауаптарым</h1>

      {submissions.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 border border-dashed rounded-lg text-slate-500">
          Әлі жауап жіберілмеген
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-blue-600">{s.assignment.title}</div>
                  <span className="text-xs text-slate-500">
                    {format(new Date(s.createdAt), 'dd.MM.yyyy HH:mm')}
                  </span>
                </div>
                <p className="border p-2 rounded bg-gray-50 whitespace-pre-wrap">{s.content}</p>
                {s.grade !== null && (
                  <Badge className="bg-green-500">Оценка: {s.grade}</Badge>
                )}
                {s.comment && (
                  <p className="italic text-sm text-slate-600">Комментарий: {s.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
