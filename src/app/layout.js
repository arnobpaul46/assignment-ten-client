"use client"
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#09090b] text-white antialiased">
        {/* ড্যাশবোর্ডে থাকলে মেইন নেভবার দেখাবে না */}
        {!isDashboard && <Navbar />}
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}