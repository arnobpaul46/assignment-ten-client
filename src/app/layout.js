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
        
        {!isDashboard && <Navbar />}
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}