"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Assignment } from "@/types/assignment";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentPage() {
  const { token, role, loaded } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "SUBMITTED" | "PENDING">("ALL");

  useEffect(() => {
    if (!token || role !== "STUDENT") return;

    axios
      .get("http://localhost:3000/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data))
      .catch(() => toast.error("Тапсырмаларды жүктеу кезінде қате"));

    axios
      .get("http://localhost:3000/submissions/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = res.data.map((s: { assignmentId: string }) => s.assignmentId);
        setSubmittedIds(ids);
      });
  }, [token, role]);

  const handleSubmit = async (assignmentId: string) => {
    const content = answers[assignmentId];
    if (!content) return toast.error("Жауап енгізіңіз");

    try {
      await axios.post(
        "http://localhost:3000/submissions",
        { assignmentId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Жауап жіберілді!");
      setSubmittedIds((prev) => [...prev, assignmentId]);
      setEditing(null);
    } catch {
      toast.error("Жіберу қатесі");
    }
  };

  const renderContentInput = (assignment: Assignment) => {
    const isAudio = ["AUDIO_DICTATION", "AUDIO_SUMMARY"].includes(
      assignment.type
    );
    return (
      <div className="space-y-4">
        {isAudio && (
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-500 mb-2">Аудионы тыңдаңыз:</p>

            {/* 👇 Тексеру үшін лог */}
            {console.log("Аудио сілтемесі:", assignment.content)}

            <audio
              controls
              src={assignment.content}
              className="w-full rounded shadow-sm"
            />
          </div>
        )}

        {!isAudio && assignment.content && (
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <Label className="text-sm text-slate-600 mb-1 block">
              Тапсырма мазмұны:
            </Label>
            <p className="text-base text-slate-800">{assignment.content}</p>
          </div>
        )}

        <Label className="text-slate-700">
          {assignment.type === "AUDIO_SUMMARY" ? "Жауабы" : "Жауап жазыңыз"}
        </Label>
        <Textarea
          placeholder="Жауап жазыңыз"
          value={answers[assignment.id] || ""}
          onChange={(e) =>
            setAnswers((prev) => ({ ...prev, [assignment.id]: e.target.value }))
          }
          disabled={
            submittedIds.includes(assignment.id) && editing !== assignment.id
          }
          className="min-h-[150px] resize-none border-slate-200 focus:border-blue-400"
        />
      </div>
    );
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case "AUDIO_DICTATION":
        return "Аудио диктант";
      case "AUDIO_SUMMARY":
        return "Аудио мазмұндама";
      case "SYNONYM_REPLACE":
        return "Синонимді алмастыр";
      case "OPEN_SPACE":
        return "Ашық алаң";
      case "WORD_GAME":
        return "Сөз ойын";
      default:
        return type;
    }
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case "AUDIO_DICTATION":
      case "AUDIO_SUMMARY":
        return "🎧";
      case "SYNONYM_REPLACE":
        return "📝";
      case "OPEN_SPACE":
        return "💬";
      case "WORD_GAME":
        return "🧩";
      default:
        return "📚";
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "ALL") return true;
    if (filter === "SUBMITTED") return submittedIds.includes(a.id);
    if (filter === "PENDING") return !submittedIds.includes(a.id);
    return true;
  });

  if (!loaded) return <div className="p-6">Жүктелуде...</div>;
  if (role !== "STUDENT") return <div className="p-6">Қолжетімділік жоқ</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            📚 Менің тапсырмаларым
          </h1>
          <p className="text-slate-500">
            Тапсырманы орындап, «Жіберу» батырмасын басыңыз
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-sm">
          Барлығы: {assignments.length} тапсырма
        </Badge>
      </div>

      <Tabs
        defaultValue="ALL"
        className="w-full"
        onValueChange={(v) => setFilter(v as any)}
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="ALL">Барлығы</TabsTrigger>
          <TabsTrigger value="PENDING">Орындалмаған</TabsTrigger>
          <TabsTrigger value="SUBMITTED">Орындалған</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredAssignments.map((a) => {
            const isSubmitted = submittedIds.includes(a.id);
            const isEditing = editing === a.id;
            const isViewing = viewing === a.id;

            return (
              <motion.div
                key={a.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`shadow-sm border overflow-hidden ${
                    isSubmitted
                      ? "border-green-200 bg-green-50"
                      : "hover:border-blue-200 transition-colors"
                  }`}
                >
                  <CardContent className="p-0">
                    {!isViewing ? (
                      <div className="p-6">
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{getAssignmentTypeIcon(a.type)}</span>
                              <h2 className="text-lg font-semibold">
                                {a.title}
                              </h2>
                              {isSubmitted && (
                                <Badge className="ml-2 bg-green-500">
                                  Жіберілді
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {getAssignmentTypeLabel(a.type)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setViewing(a.id)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Қарау
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{getAssignmentTypeIcon(a.type)}</span>
                              <h2 className="text-xl font-semibold">
                                {a.title}
                              </h2>
                              {isSubmitted && (
                                <Badge className="ml-2 bg-green-500">
                                  Жіберілді
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {getAssignmentTypeLabel(a.type)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewing(null)}
                          >
                            Жабу
                          </Button>
                        </div>

                        {a.example && (
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm">
                            <strong className="text-amber-700">
                              Түсініктеме:
                            </strong>
                            <p className="mt-1 text-slate-700">{a.example}</p>
                          </div>
                        )}

                        {renderContentInput(a)}

                        <div className="flex gap-3">
                          {isSubmitted && !isEditing ? (
                            <Button
                              variant="outline"
                              onClick={() => setEditing(a.id)}
                              className="flex-1"
                            >
                              Жауапты өзгерту
                            </Button>
                          ) : (
                            <Button
                              className="flex-1 bg-blue-500 hover:bg-blue-600"
                              onClick={() => handleSubmit(a.id)}
                              disabled={
                                !answers[a.id] || (isSubmitted && !isEditing)
                              }
                            >
                              {isSubmitted ? "Қайта жіберу" : "Жіберу"}
                            </Button>
                          )}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              onClick={() => setEditing(null)}
                            >
                              Болдырмау
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
