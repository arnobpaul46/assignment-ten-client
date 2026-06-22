"use client"
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MyEbooksTab from "@/components/writer/MyEbooksTab";
import AddEbookTab from "@/components/writer/AddEbookTab";
import SalesHistoryTab from "@/components/writer/SalesHistoryTab";
import WriterProfileTab from "@/components/writer/WriterProfileTab";

export default function WriterDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "my-ebooks";

  const setActiveTab = (tab) => {
    router.push(`/dashboard/writer?tab=${tab}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
        {activeTab === "my-ebooks" && <MyEbooksTab setActiveTab={setActiveTab} />}
        {activeTab === "add-ebook" && <AddEbookTab setActiveTab={setActiveTab} />}
        {activeTab === "sales" && <SalesHistoryTab />}
        {activeTab === "profile" && <WriterProfileTab setActiveTab={setActiveTab} />}
    </div>
  );
}