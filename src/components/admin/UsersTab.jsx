"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cookies from 'js-cookie';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchUsers = async () => {
    const token = Cookies.get('access-token');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users`, {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ১. রোল আপডেট ফাংশন
  const handleRoleChange = async (id, newRole) => {
    const token = Cookies.get('access-token');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/update-role/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ newRole })
      });
      if (res.ok) {
        toast.success("Role Updated Successfully");
        fetchUsers();
      }
    } catch (err) { toast.error("Failed to update role"); }
  };

  // ২. ব্লক/আনব্লক ফাংশন
  const handleBlockToggle = async (id, currentStatus) => {
    const token = Cookies.get('access-token');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/toggle-block/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ isBlocked: !currentStatus })
      });
      if (res.ok) {
        toast.success(!currentStatus ? "User Blocked" : "User Unblocked");
        fetchUsers();
      }
    } catch (err) { toast.error("Action failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none px-2">Manage <span className="text-[#ff1e6d]">Users</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-zinc-800 h-16 text-left">
                <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] w-[40%]">User Profile</TableHead>
                <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] text-center w-[30%]">Role Control</TableHead>
                <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] w-[30%]">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6 text-left text-white">
                     <p className="font-bold text-lg leading-none">{user.name}</p>
                     <p className="text-zinc-500 text-xs italic mt-1">{user.email}</p>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <Select 
                        onValueChange={(val) => handleRoleChange(user._id, val)} 
                        defaultValue={user.role || "reader"}
                        disabled={user.email === "admin@fable.com"}
                      >
                        <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-800 text-[#ff1e6d] h-8 text-[10px] font-black uppercase rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-zinc-800 text-white font-bold uppercase text-[10px]">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="writer">Writer</SelectItem>
                          <SelectItem value="reader">Reader</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="text-right px-10">
                    {user.email !== "admin@fable.com" && (
                      <button 
                        onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                        className={`h-11 px-6 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ml-auto shadow-lg ${user.isBlocked ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white'}`}
                      >
                        {user.isBlocked ? <><ShieldCheck size={16}/> Unblock</> : <><ShieldAlert size={16}/> Block User</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
export default UsersTab;