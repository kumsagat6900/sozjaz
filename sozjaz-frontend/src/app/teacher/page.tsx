"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Assignment } from "@/types/assignment";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Headphones,
  PlusCircle,
  Edit,
  FileText,
  Layers,
  CheckCircle,
  Upload,
  FileAudio,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherPage() {
  const { loaded, token, role } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Assignment["type"]>("AUDIO_DICTATION");
  const [example, setExample] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("assignments");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token || role !== "TEACHER") return;

    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Тапсырмалар жүктелмеді", {
          description: "Серверге қосылу мүмкін болмады",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [token, role]);

  const handleCreateAssignment = async () => {
    if (!title) {
      toast.error("Тапсырма атын енгізіңіз");
      return;
    }

    if (["AUDIO_DICTATION", "AUDIO_SUMMARY"].includes(type) && !file) {
      toast.error("Аудио файлды жүктеп салыңыз");
      return;
    }

    if (!["AUDIO_DICTATION", "AUDIO_SUMMARY"].includes(type) && !textContent) {
      toast.error("Тапсырма мәтінін енгізіңіз");
      return;
    }

    setUploading(true);
    try {
      let content = textContent;

      if (["AUDIO_DICTATION", "AUDIO_SUMMARY"].includes(type) && file) {
        const formData = new FormData();
        formData.append("file", file);

        toast.info("Аудио файл жүктелуде...", {
          description: "Бұл бірнеше секунд алуы мүмкін",
        });

        const uploadRes = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        content = uploadRes.data.url;
      }

      toast.info("Тапсырма жасалуда...");
      const res = await axios.post(
        "http://localhost:3000/assignments",
        { title, type, content, example },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Жұмыс сәтті жасалды!", {
        description: "Тапсырма тізіміне қосылды",
      });

      setTitle("");
      setExample("");
      setTextContent("");
      setFile(null);
      setType("AUDIO_DICTATION");
      setAssignments((prev) => [...prev, res.data]);
      setActiveTab("assignments");
    } catch (err) {
      toast.error("Тапсырманы жасау қатесі", {
        description: "Қайталап көріңіз немесе әкімшіге хабарласыңыз",
      });
    } finally {
      setUploading(false);
    }
  };

  const getAssignmentIcon = (type: Assignment["type"]) => {
    switch (type) {
      case "AUDIO_DICTATION":
      case "AUDIO_SUMMARY":
        return <Headphones className="h-5 w-5 text-blue-500" />;
      case "SYNONYM_REPLACE":
        return <Edit className="h-5 w-5 text-purple-500" />;
      case "OPEN_SPACE":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "WORD_GAME":
        return <Layers className="h-5 w-5 text-orange-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAssignmentTypeName = (type: Assignment["type"]) => {
    switch (type) {
      case "AUDIO_DICTATION":
        return "Аудио-диктант";
      case "AUDIO_SUMMARY":
        return "Аудио-мазмұндама";
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

  const getTypeColor = (type: Assignment["type"]) => {
    switch (type) {
      case "AUDIO_DICTATION":
      case "AUDIO_SUMMARY":
        return "bg-blue-100 text-blue-800";
      case "SYNONYM_REPLACE":
        return "bg-purple-100 text-purple-800";
      case "OPEN_SPACE":
        return "bg-green-100 text-green-800";
      case "WORD_GAME":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!loaded) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (role !== "TEACHER") {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Рұқсат жоқ</h1>
        <p className="text-gray-600 mb-6">
          Бұл беттің мазмұнын көру үшін мұғалім құқығы қажет
        </p>
        <Button onClick={() => router.push("/")}>Басты бетке оралу</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Мұғалім панелі</h1>
          <p className="text-gray-500">Тапсырмаларды құру және басқару</p>
        </div>
        {activeTab === "assignments" && (
          <Button
            onClick={() => setActiveTab("create")}
            className="mt-4 md:mt-0"
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Жаңа тапсырма
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-1/3 grid-cols-2 mb-8">
          <TabsTrigger value="assignments">
            <FileText className="h-4 w-4 mr-2" />
            Тапсырмалар
          </TabsTrigger>
          <TabsTrigger value="create">
            <PlusCircle className="h-4 w-4 mr-2" />
            Жаңа тапсырма
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Тапсырмалар жоқ
              </h3>
              <p className="text-gray-500 mb-4">
                Жаңа тапсырма жасау үшін қосу түймесін басыңыз
              </p>
              <Button onClick={() => setActiveTab("create")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Тапсырма құру
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((a) => (
                <Card
                  key={a.id}
                  className="overflow-hidden transition-all hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              getTypeColor(a.type).split(" ")[0]
                            }`}
                          >
                            {getAssignmentIcon(a.type)}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold line-clamp-1">
                              {a.title}
                            </h2>
                            <Badge
                              variant="outline"
                              className={`mt-1 ${getTypeColor(a.type)}`}
                            >
                              {getAssignmentTypeName(a.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {a.example && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                          {a.example}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date().toLocaleDateString()}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Edit className="h-4 w-4 mr-1" />
                      Өңдеу
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <div className="max-w-xl mx-auto">
            <Card className="border-t-4 border-t-blue-500">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Тапсырма атауы
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Мысалы: Көктем мәтіні - диктант"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Тапсырма түрі
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(value) =>
                      setType(value as Assignment["type"])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Тапсырма түрін таңдаңыз" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUDIO_DICTATION">
                        <div className="flex items-center">
                          <Headphones className="h-4 w-4 mr-2 text-blue-500" />
                          Аудио-диктант
                        </div>
                      </SelectItem>
                      <SelectItem value="AUDIO_SUMMARY">
                        <div className="flex items-center">
                          <FileAudio className="h-4 w-4 mr-2 text-blue-500" />
                          Аудио-мазмұндама
                        </div>
                      </SelectItem>
                      <SelectItem value="SYNONYM_REPLACE">
                        <div className="flex items-center">
                          <Edit className="h-4 w-4 mr-2 text-purple-500" />
                          Синонимді алмастыр
                        </div>
                      </SelectItem>
                      <SelectItem value="OPEN_SPACE">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-green-500" />
                          Ашық алаң
                        </div>
                      </SelectItem>
                      <SelectItem value="WORD_GAME">
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-2 text-orange-500" />
                          Сөз ойын
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type.includes("AUDIO") ? (
                  <div className="space-y-2">
                    <Label htmlFor="audioFile" className="text-sm font-medium">
                      Аудиофайл
                    </Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {file ? (
                        <div className="space-y-2">
                          <FileAudio className="h-8 w-8 mx-auto text-blue-500" />
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFile(null)}
                          >
                            Файлды өзгерту
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Аудиофайлды таңдау үшін басыңыз немесе сүйреп
                            әкеліңіз
                          </p>
                          <Input
                            id="audioFile"
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) =>
                              setFile(e.target.files?.[0] || null)
                            }
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById("audioFile")?.click()
                            }
                          >
                            Файлды таңдау
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Тапсырма мазмұны
                    </Label>
                    <Textarea
                      id="content"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Тапсырма мәтінін енгізіңіз"
                      rows={5}
                      className="resize-y"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="example" className="text-sm font-medium">
                    Мысал / түсініктеме (міндетті емес)
                  </Label>
                  <Textarea
                    id="example"
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    placeholder="Оқушыларға арналған мысал немесе нұсқаулық"
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("assignments")}
                >
                  Бас тарту
                </Button>
                <Button onClick={handleCreateAssignment} disabled={uploading}>
                  {uploading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </span>
                      Жүктелуде...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Тапсырма құру
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
