"use client"
import { BarChart3, Users, BookText, CreditCard, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const adminLinks = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "manage-users", label: "Manage Users", icon: Users },
    { id: "all-ebooks", label: "Manage Ebooks", icon: BookText },
    { id: "transactions", label: "Transactions", icon: CreditCard },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] p-6 lg:p-8">
      <nav className="flex-1 space-y-3 mt-4">
        <p className="text-[10px] uppercase tracking-[4px] text-zinc-500 font-black mb-8 ml-4">System Control</p>
        
        {adminLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === link.id 
                ? "bg-[#ff1e6d] text-white shadow-[0_10px_30px_rgba(255,30,109,0.3)]" 
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <link.icon size={20} /> {link.label}
          </button>
        ))}
      </nav>

      {/* Logout Session - Functional */}
      <div className="border-t border-zinc-800/60 pt-6 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={18} /> Logout Session
        </button>
      </div>
    </div>
  );
};
export default Sidebar;