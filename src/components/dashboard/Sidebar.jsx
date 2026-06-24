"use client"
import React from 'react';
import { 
  BarChart3, Users, BookText, CreditCard, LogOut, 
  Home, Heart, ShoppingBag, User, PlusCircle 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from 'js-cookie';

const Sidebar = ({ role }) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || (role === "admin" ? "analytics" : "my-library");

  const links = {
    admin: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "manage-users", label: "Manage Users", icon: Users },
      { id: "all-ebooks", label: "Manage Ebooks", icon: BookText },
      { id: "transactions", label: "Transactions", icon: CreditCard },
    ],
    writer: [
      { id: "my-ebooks", label: "My Ebooks", icon: BookText },
      { id: "add-ebook", label: "Publish Book", icon: PlusCircle },
      { id: "sales", label: "Sales History", icon: CreditCard },
      { id: "bookmarks", label: "Bookmarks", icon: Heart },
      { id: "profile", label: "Profile Settings", icon: User },
    ],
    reader: [
      { id: "my-library", label: "My Library", icon: BookText },
      { id: "order-history", label: "Order History", icon: ShoppingBag },
      { id: "bookmarks", label: "Bookmarks", icon: Heart },
      { id: "profile", label: "My Profile", icon: User },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e] p-6 border-r border-zinc-800/40">
      <nav className="flex-1 space-y-3 mt-4">
        <Link href="/" className="flex items-center gap-4 px-5 py-4 mb-10 rounded-2xl text-white bg-zinc-900/50 hover:bg-[#ff1e6d] transition-all font-black text-xs uppercase tracking-widest shadow-xl">
          <Home size={18} /> Visit Store
        </Link>

        {links[role]?.map((link) => (
          <Link
            key={link.id}
            href={`/dashboard/${role}?tab=${link.id}`}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === link.id 
                ? "bg-[#ff1e6d] text-white shadow-lg shadow-pink-500/20 scale-[1.02]" 
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <link.icon size={20} /> {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-800/60 pt-6 mt-auto">
        <button 
          onClick={async () => { await authClient.signOut(); window.location.href = "/login"; }} 
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase"
        >
          <LogOut size={18} /> Logout Session
        </button>
      </div>
    </div>
  );
};
export default Sidebar;