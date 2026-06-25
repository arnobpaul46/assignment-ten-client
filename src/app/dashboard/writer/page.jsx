"use client"
import React from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import MyEbooksTab from "@/components/writer/MyEbooksTab";
import AddEbookTab from "@/components/writer/AddEbookTab";
import SalesHistoryTab from "@/components/writer/SalesHistoryTab";
import WriterProfileTab from "@/components/writer/WriterProfileTab";
import BookmarksTab from "@/components/reader/BookmarkPageTab"; 

export default function WriterDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "my-ebooks";

  const setActiveTab = (tabName) => {
    router.push(`/dashboard/writer?tab=${tabName}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-10">
      {activeTab === "my-ebooks" && <MyEbooksTab setActiveTab={setActiveTab} />}
      {activeTab === "add-ebook" && <AddEbookTab setActiveTab={setActiveTab} />}
      {activeTab === "sales" && <SalesHistoryTab setActiveTab={setActiveTab} />}
      {activeTab === "bookmarks" && <BookmarksTab setActiveTab={setActiveTab} />}
      {activeTab === "profile" && <WriterProfileTab setActiveTab={setActiveTab} />}
    </div>
  );
}