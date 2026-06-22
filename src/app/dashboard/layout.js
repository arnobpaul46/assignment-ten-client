"use client"
import React from 'react';
import { Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}