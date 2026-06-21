"use client"
import { BarChart3, Users, BookText, CreditCard, LogOut, Home, PlusCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const Sidebar = ({ activeTab, setActiveTab, role }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out", { id: toastId });
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const links = role === "admin" ? [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "manage-users", label: "Manage Users", icon: Users },
    { id: "all-ebooks", label: "Manage Ebooks", icon: BookText },
  ] : [
    { id: "my-ebooks", label: "My Ebooks", icon: BookText },
    { id: "add-ebook", label: "Publish Book", icon: PlusCircle },
    { id: "sales", label: "Sales History", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] p-6 lg:p-8 border-r border-zinc-800/60">
      <nav className="flex-1 space-y-3 mt-4">
        <Link href="/" className="flex items-center gap-4 px-5 py-4 mb-8 rounded-2xl text-white bg-zinc-900/50 hover:bg-[#ff1e6d] transition-all font-black text-sm uppercase">
          <Home size={18} /> Visit Store
        </Link>
        <p className="text-[10px] uppercase tracking-[4px] text-zinc-500 font-black mb-4 ml-4">{role} Control</p>
        {links.map((link) => (
          <button key={link.id} onClick={() => setActiveTab(link.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === link.id ? "bg-[#ff1e6d] text-white shadow-lg shadow-pink-500/20" : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"}`}>
            <link.icon size={20} /> {link.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-zinc-800/60 pt-6 mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase">
          <LogOut size={18} /> Logout Session
        </button>
      </div>
    </div>
  );
};
export default Sidebar;