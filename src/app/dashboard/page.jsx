"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else {
        const role = session.user.role || "reader";
        // Supreme Admin logic
        if (session.user.email === "admin@fable.com") {
          router.push("/dashboard/admin");
        } else if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "writer") {
          router.push("/dashboard/writer");
        } else {
          router.push("/dashboard/reader");
        }
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#09090b]">
      <Loader2 className="animate-spin text-[#ff1e6d]" size={40} />
    </div>
  );
}