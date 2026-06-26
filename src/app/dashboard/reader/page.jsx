"use client"
import React from 'react';
import { useSearchParams } from "next/navigation";
import MyLibraryTab from "@/components/reader/PurchasedEbooksTab";
import OrderHistoryTab from "@/components/reader/PurchaseHistoryTab";
import BookmarkTab from "@/components/reader/BookmarkPageTab";
import UserProfileTab from "@/components/reader/UserProfileTab";

export default function ReaderDashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "my-library"; 

  return (
    <div className="max-w-[1300px] mx-auto animate-in fade-in duration-700">
       {activeTab === "my-library" && <MyLibraryTab />}
       {activeTab === "order-history" && <OrderHistoryTab />}
       {activeTab === "bookmarks" && <BookmarkTab />}
       {activeTab === "profile" && <UserProfileTab />}
    </div>
  );
}