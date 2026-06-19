import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = ({ isLoggedIn, userAvatar, userName }) => {
  return (
    <nav className="w-full bg-[#09090b] border-b border-zinc-800">
      <div className="max-w-[85%] mx-auto flex items-center justify-between py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#ff1e6d] h-9 w-9 rounded-lg flex items-center justify-center font-bold text-white text-lg">F</div>
          <span className="text-xl font-bold tracking-tight text-white">Fable</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/" className="text-white hover:text-[#ff1e6d]">Home</Link>
          <Link href="/browse" className="text-zinc-400 hover:text-white">Browse Ebooks</Link>
          <Link href="/dashboard" className="text-zinc-400 hover:text-white">Dashboard</Link>
        </div>

        {/* Right Side: Logic */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-10 w-10 border-2 border-[#ff1e6d] cursor-pointer">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-zinc-800 text-white">U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#111113] border-zinc-800 text-white w-48 mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 cursor-pointer">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-medium text-zinc-400 hover:text-white">Sign In</Link>
              <Button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-full px-7 font-bold">Get Started</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;