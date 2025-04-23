"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !login || !password) {
      toast.error("Барлық өрістерді толтырыңыз");
      return;
    }

    if (password.length < 6) {
      toast.error("Құпия сөз кемінде 6 таңбадан тұруы керек");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name,
        login: login.trim().toLowerCase(),
        password,
        role,
      });

      const { access_token, user } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", user.role);

      toast.success("Тіркеу сәтті өтті!");

      router.push(user.role === "TEACHER" ? "/teacher" : "/student");
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Тіркеу қатесі";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Аккаунтты тіркеу
              </h1>
              <p className="text-gray-500 mt-2">
                Тіркелу үшін барлық өрістерді толтырыңыз
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Аты-жөні</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Сіздің атыңыз"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Логин (латиница)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Құпия сөз</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Құпия сөзді енгізіңіз"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Рөлі</Label>
                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as "STUDENT" | "TEACHER")
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      {role === "STUDENT" ? "Оқушы" : "Мұғалім"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Оқушы</SelectItem>
                    <SelectItem value="TEACHER">Мұғалім</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-2" />
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Тіркелу
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-8">
          Аккаунтыңыз бар ма?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Кіру
          </a>
        </p>
      </div>
    </div>
  );
}
