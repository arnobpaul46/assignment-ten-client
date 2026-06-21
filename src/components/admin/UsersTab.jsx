"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockUser, setBlockUser] = useState(null); // এটি শুরুতে null থাকে
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlockConfirm = async () => {
    if (!blockUser) return; // সেফটি চেক

    const toastId = toast.loading("Updating access...");
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/toggle-block/${blockUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !blockUser.isBlocked })
      });
      if (res.ok) {
        toast.success(blockUser.isBlocked ? "User Unblocked!" : "User Blocked!", { id: toastId });
        setBlockUser(null);
        fetchUsers();
      }
    } catch (err) { toast.error("Action failed", { id: toastId }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Manage <span className="text-[#ff1e6d]">Users</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] w-[40%] text-left">User Profile</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] text-center w-[30%]">Role Control</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] w-[30%]">Access</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                <td className="px-10 py-6 text-left">
                   <p className="font-bold text-white text-lg">{user.name}</p>
                   <p className="text-zinc-500 text-xs italic mt-1">{user.email}</p>
                </td>
                <td className="text-center">
                  <div className="flex justify-center">
                    <Select defaultValue={user.role} disabled={user.email === "admin@fable.com"}>
                      <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-800 text-[#ff1e6d] h-8 text-[10px] font-black uppercase rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111113] border-zinc-800 text-white font-bold">
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
                      onClick={() => setBlockUser(user)}
                      className={`h-11 px-6 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center gap-2 ml-auto ${user.isBlocked ? 'bg-green-600 text-white shadow-lg' : 'bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white'}`}
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

      {/* --- BLOCK MODAL FIXED --- */}
      <Dialog open={!!blockUser} onOpenChange={() => setBlockUser(null)}>
        {/* এখানে চেক করা হচ্ছে: যদি blockUser থাকে তবেই কন্টেন্ট দেখাবে */}
        {blockUser && (
          <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
              <ShieldAlert className="text-red-500 mx-auto mb-4" size={48} />
              <DialogTitle className="text-xl font-black uppercase italic">
                {blockUser.isBlocked ? "Unblock" : "Block"} {blockUser.name}?
              </DialogTitle>
              <DialogDescription className="text-zinc-500 mt-2 text-sm">
                {blockUser.isBlocked 
                  ? "This will restore user access to the platform." 
                  : "Banning this user will prevent them from logging into Fable."}
              </DialogDescription>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setBlockUser(null)} className="flex-1 bg-zinc-900 rounded-xl h-12 font-bold text-xs uppercase border border-zinc-800">Cancel</button>
                <button onClick={handleBlockConfirm} className={`flex-1 rounded-xl h-12 font-black text-xs uppercase shadow-lg ${blockUser.isBlocked ? 'bg-green-600' : 'bg-red-600'}`}>Confirm</button>
              </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
export default UsersTab;