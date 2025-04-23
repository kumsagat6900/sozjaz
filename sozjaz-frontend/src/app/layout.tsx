import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext"; // 👈

export const metadata: Metadata = {
  title: "SozJaz",
  description: "Онлайн-платформа для учеников и учителей",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* 👈 */}
          <Header />
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
