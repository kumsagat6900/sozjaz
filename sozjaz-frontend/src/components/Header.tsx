"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; // ← используем глобальный контекст

export default function Header() {
  const router = useRouter();
  const { role, setRole, setToken } = useAuth(); // ← берём роль и set-функции из контекста

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setRole(null);   // теперь шапка обновится
    setToken(null);  // на всякий случай

    router.push("/login");
  };

  return (
    <header className="w-full p-4 border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1
            className="text-xl font-bold cursor-pointer text-blue-600"
            onClick={() => router.push("/")}
          >
            SozJaz
          </h1>

          <Button variant="ghost" onClick={() => router.push("/")}>
            Басты бет
          </Button>
          <Button variant="ghost" onClick={() => router.push("/about")}>
            Жоба жәйлі
          </Button>

          {role === "TEACHER" && (
            <>
              <Button variant="ghost" onClick={() => router.push("/teacher")}>
                Тапсырмалар
              </Button>
              <Button variant="ghost" onClick={() => router.push("/teacher/students")}>
                Студенттер
              </Button>
            </>
          )}

          {role === "STUDENT" && (
            <>
              <Button variant="ghost" onClick={() => router.push("/student")}>
                Тапсырмалар
              </Button>
              <Button variant="ghost" onClick={() => router.push("/student/submissions")}>
                Менің жауаптарым
              </Button>
            </>
          )}
        </div>

        {role ? (
          <Button variant="outline" onClick={handleLogout}>
            Шығу
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/login")}>Кіру</Button>
            <Button onClick={() => router.push("/register")}>Тіркелу</Button>
          </div>
        )}
      </div>
    </header>
  );
}
