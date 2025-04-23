"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { Submission } from "@/types/submission";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Constants
const ERROR_MESSAGES = {
  UNAUTHORIZED:
    "Рұқсат жоқ. Бұл бетке тек мұғалімдердің қол жеткізу рұқсаты бар",
  NO_SUBMISSIONS: "Студент әлі жауап берген жоқ",
  FETCH_ERROR: "Жауаптарды жүктеу кезінде қате орын алды",
  GRADE_ERROR: "Бағаны сақтау кезінде қате орын алды",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface SubmissionWithGrade extends Submission {
  grade?: number | null;
  comment?: string | null;
}

// Helper functions
const getApiUrl = (path: string) => `${API_URL}${path}`;
const formatDate = (date: Date) => format(date, "dd.MM.yyyy HH:mm");

export default function StudentSubmissionsPage() {
  const { id } = useParams<{ id: string }>();
  const { token, role, loaded } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithGrade[]>([]);
  const [sortOption, setSortOption] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(
    null
  );

  const sortSubmissions = useCallback(
    (data: SubmissionWithGrade[], option: string) => {
      let filteredData = [...data];

      if (option === "graded") {
        filteredData = data.filter((submission) => submission.grade != null);
      } else if (option === "ungraded") {
        filteredData = data.filter((submission) => submission.grade == null);
      }

      return filteredData.sort((a, b) => {
        if (a.grade != null && b.grade == null) return -1;
        if (a.grade == null && b.grade != null) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    },
    []
  );

  const fetchSubmissions = useCallback(async () => {
    if (!token || role !== "TEACHER" || !id) {
      return setIsLoading(false); //  Fix: вернуть setIsLoading(false)
    }

    try {
      setIsLoading(true);
      const response = await axios.get<SubmissionWithGrade[]>(
        getApiUrl(`/submissions/student/${id}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions(sortSubmissions(response.data, sortOption));
      setError(null);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error fetching submissions:", error);
      setError(ERROR_MESSAGES.FETCH_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [token, role, id, sortOption, sortSubmissions]);

  useEffect(() => {
    if (loaded) {
      fetchSubmissions();
    }
  }, [loaded, fetchSubmissions, sortOption]); //  Fix: добавлен sortOption

  const handleGrade = async (
    submissionId: string,
    grade: number | null,
    comment: string | null
  ) => {
    if (!token) return;

    try {
      await axios.patch(
        getApiUrl(`/submissions/${submissionId}`),
        { grade, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = submissions.map((s) =>
        s.id === submissionId ? { ...s, grade, comment } : s
      );

      setSubmissions(sortSubmissions(updated, sortOption));
      setEditingSubmissionId(null);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Grade submission error", error);
      setError(ERROR_MESSAGES.GRADE_ERROR);
    }
  };

  const getAverageGrade = useCallback(() => {
    const gradedSubmissions = submissions.filter((s) => s.grade != null);
    if (gradedSubmissions.length === 0) return 0;
    const sum = gradedSubmissions.reduce((acc, s) => acc + (s.grade ?? 0), 0);
    return sum / gradedSubmissions.length;
  }, [submissions]);

  if (!loaded) {
    return <LoadingSpinner />;
  }

  if (loaded && role !== "TEACHER") {
    return <UnauthorizedMessage />; // ✅ Fix: безопасная проверка
  }

  const average = getAverageGrade();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <PageHeader sortOption={sortOption} setSortOption={setSortOption} />

      {isLoading ? (
        <LoadingSpinner text="Жауаптар жүктелуде..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {submissions.length > 0 && (
            <AverageGradeDisplay
              average={average}
              gradedCount={submissions.filter((s) => s.grade != null).length}
            />
          )}

          {submissions.length === 0 ? (
            <NoSubmissionsMessage />
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  isEditing={editingSubmissionId === submission.id}
                  onEditToggle={() =>
                    setEditingSubmissionId(
                      editingSubmissionId === submission.id
                        ? null
                        : submission.id
                    )
                  }
                  onGradeChange={(grade, comment) =>
                    setSubmissions((prev) =>
                      prev.map((s) =>
                        s.id === submission.id ? { ...s, grade, comment } : s
                      )
                    )
                  }
                  onSubmitGrade={() =>
                    handleGrade(
                      submission.id,
                      submission.grade ?? null,
                      submission.comment ?? null
                    )
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Extracted Components
function LoadingSpinner({ text = "Жүктелуде..." }: { text?: string }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}

function UnauthorizedMessage() {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
      <div className="text-red-600 font-medium">
        {ERROR_MESSAGES.UNAUTHORIZED}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600">{message}</p>
    </div>
  );
}

function PageHeader({
  sortOption,
  setSortOption,
}: {
  sortOption: string;
  setSortOption: (value: string) => void;
}) {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h1 className="text-2xl font-bold">Оқушы жауаптары</h1>
      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Барлық жауаптар" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Барлық жауаптар</SelectItem>
          <SelectItem value="graded">Тексерілген</SelectItem>
          <SelectItem value="ungraded">Тексерілмеген</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function AverageGradeDisplay({
  average,
  gradedCount,
}: {
  average: number;
  gradedCount: number;
}) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center">
        <div className="text-blue-800 font-medium mr-1">Орташа баға:</div>
        <div className="bg-white px-3 py-1 rounded-full text-blue-700 font-bold">
          {average.toFixed(1)} / 10
        </div>
        <div className="text-sm text-blue-600 ml-2">
          (Тексерілген: {gradedCount})
        </div>
      </div>
    </div>
  );
}

function NoSubmissionsMessage() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border">
      <div className="text-gray-500">{ERROR_MESSAGES.NO_SUBMISSIONS}</div>
    </div>
  );
}

function SubmissionCard({
  submission,
  isEditing,
  onEditToggle,
  onGradeChange,
  onSubmitGrade,
}: {
  submission: SubmissionWithGrade;
  isEditing: boolean;
  onEditToggle: () => void;
  onGradeChange: (grade: number | null, comment: string | null) => void;
  onSubmitGrade: () => void;
}) {
  return (
    <Card
      className={`border shadow-sm transition-all hover:shadow ${
        submission.grade != null
          ? "border-green-200 bg-green-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <CardContent className="p-6 space-y-4">
        <SubmissionHeader submission={submission} />

        <SubmissionContent content={submission.content} />

        {!isEditing && submission.grade != null && (
          <GradeDisplay submission={submission} onEditToggle={onEditToggle} />
        )}

        {(isEditing || submission.grade == null) && (
          <GradeForm
            submission={submission}
            isEditing={isEditing}
            onGradeChange={onGradeChange}
            onSubmitGrade={onSubmitGrade}
            onCancel={onEditToggle}
          />
        )}
      </CardContent>
    </Card>
  );
}

function SubmissionHeader({ submission }: { submission: SubmissionWithGrade }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-600">
        Жіберілді: {formatDate(new Date(submission.createdAt))}
      </div>
      {submission.grade != null ? (
        <span className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded-full font-medium">
          Тексерілген
        </span>
      ) : (
        <span className="px-3 py-1 text-sm bg-amber-200 text-amber-800 rounded-full font-medium">
          Тексерілмеген
        </span>
      )}
    </div>
  );
}

function SubmissionContent({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <Label className="text-sm font-medium mb-2 block">Оқушы жауабы:</Label>
      {content.endsWith(".mp3") ? (
        <audio
          controls
          src={content}
          className="w-full rounded mt-2"
          aria-label="Audio submission"
        />
      ) : (
        <p className="text-base mt-1 rounded p-3 bg-gray-50 border">
          {content}
        </p>
      )}
    </div>
  );
}

function GradeDisplay({
  submission,
  onEditToggle,
}: {
  submission: SubmissionWithGrade;
  onEditToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-medium">Бағалау нәтижесі</h3>
        <button
          onClick={onEditToggle}
          className="text-sm text-blue-600 hover:text-blue-800"
          aria-label="Edit grade"
        >
          Өзгерту
        </button>
      </div>

      <div className="flex items-center mb-3">
        <span className="text-sm font-medium mr-2">Баға:</span>
        <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full">
          {submission.grade} / 10
        </span>
      </div>

      {submission.comment && (
        <div>
          <span className="text-sm font-medium block mb-1">Пікір:</span>
          <p className="text-sm bg-gray-50 p-3 rounded border">
            {submission.comment}
          </p>
        </div>
      )}
    </div>
  );
}

function GradeForm({
  submission,
  isEditing,
  onGradeChange,
  onSubmitGrade,
  onCancel,
}: {
  submission: SubmissionWithGrade;
  isEditing: boolean;
  onGradeChange: (grade: number | null, comment: string | null) => void;
  onSubmitGrade: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border p-4 mt-4 space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium">
          {submission.grade != null ? "Бағаны өзгерту" : "Бағалау"}
        </h3>
        {isEditing && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
            aria-label="Cancel editing"
          >
            Жабу
          </button>
        )}
      </div>

      <div>
        <Label
          htmlFor={`grade-${submission.id}`}
          className="text-sm mb-1 block"
        >
          Баға (0-10):
        </Label>
        <input
          id={`grade-${submission.id}`}
          type="number"
          min="0"
          max="10"
          step="1" // ✅ Fix: ограничение step
          value={submission.grade ?? ""}
          onChange={(e) => {
            const value =
              e.target.value === ""
                ? null
                : Math.min(10, Math.max(0, Number(e.target.value)));
            onGradeChange(value, submission.comment ?? null);
          }}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-required="true"
        />
      </div>

      <div>
        <Label
          htmlFor={`comment-${submission.id}`}
          className="text-sm mb-1 block"
        >
          Пікір:
        </Label>
        <textarea
          id={`comment-${submission.id}`}
          value={submission.comment ?? ""}
          rows={3}
          onChange={(e) =>
            onGradeChange(submission.grade ?? null, e.target.value)
          }
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Пікір жазыңыз..."
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onSubmitGrade}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex-1"
          disabled={submission.grade === null}
        >
          Сақтау
        </button>

        {isEditing && (
          <button
            onClick={onCancel}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Болдырмау
          </button>
        )}
      </div>
    </div>
  );
}
