"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';
import MyEbooksTab from "@/components/writer/MyEbooksTab";
import AddEbookTab from "@/components/writer/AddEbookTab";
import SalesHistoryTab from "@/components/writer/SalesHistoryTab";
import WriterProfileTab from "@/components/writer/WriterProfileTab";
import BookmarksTab from "@/components/reader/BookmarkPageTab"; 

export default function WriterDashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "my-ebooks";

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-10">
        {activeTab === "my-ebooks" && <MyEbooksTab />}
        {activeTab === "add-ebook" && <AddEbookTab />}
        {activeTab === "sales" && <SalesHistoryTab />}
        {activeTab === "bookmarks" && <BookmarksTab />}
        {activeTab === "profile" && <WriterProfileTab />}
    </div>
  );
}