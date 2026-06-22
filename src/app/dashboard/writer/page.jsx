"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import MyEbooksTab from "@/components/writer/MyEbooksTab";
import AddEbookTab from "@/components/writer/AddEbookTab";
import SalesHistoryTab from "@/components/writer/SalesHistoryTab";

const WriterPage = () => {
  const [activeTab, setActiveTab] = useState("my-ebooks");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:block w-72 h-screen sticky top-0"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="writer" /></aside>
      <div className="flex-1">
        {activeTab === "my-ebooks" && <MyEbooksTab setActiveTab={setActiveTab} />}
        {activeTab === "add-ebook" && <AddEbookTab setActiveTab={setActiveTab} />}
        {activeTab === "sales" && <SalesHistoryTab />}
      </div>
    </div>
  );
};
export default WriterPage;