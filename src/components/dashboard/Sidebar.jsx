import { Users, BookText, BarChart3, CreditCard, LogOut, Settings } from "lucide-react";
import Link from 'next/link';

const Sidebar = ({ isMobile }) => {
  const menuItems = [
    { id: "manage", label: "Manage Users", icon: Users, href: "/dashboard" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "#" },
    { id: "ebooks", label: "All Ebooks", icon: BookText, href: "#" },
    { id: "transactions", label: "Transactions", icon: CreditCard, href: "#" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] p-6 lg:p-8">
      <nav className="flex-1 space-y-2 mt-4">
        <p className="text-[10px] uppercase tracking-[4px] text-zinc-600 font-black mb-6 ml-4">Control</p>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold text-zinc-400 hover:bg-[#ff1e6d]/10 hover:text-[#ff1e6d] transition-all"
          >
            <item.icon size={18} /> {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-800 pt-6 space-y-2">
        <button className="w-full flex items-center gap-4 px-5 py-3 text-zinc-500 hover:text-white transition-all text-sm font-bold">
          <Settings size={18} /> Settings
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-sm font-black">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;