"use client"
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // চেক করছি ইউজার কি ড্যাশবোর্ডে আছে?
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className="bg-[#09090b] text-white antialiased">
        {/* যদি ড্যাশবোর্ড না হয়, তবেই মেইন নেভবার দেখাবে */}
        {!isDashboard && <Navbar />}
        
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}