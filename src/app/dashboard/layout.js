"use client"
import React, { useState } from 'react';


export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {children}
    </div>
  );
}