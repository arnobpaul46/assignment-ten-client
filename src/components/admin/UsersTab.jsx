"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // Form States
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) { toast.error("Connection failed"); }
  };

  useEffect(() => { fetchUsers(); }, []);

  
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/delete-user/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/update-role/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole })
      });
      if (res.ok) {
        toast.success(`Updated to ${newRole}`);
        fetchUsers();
      }
    } catch (err) { toast.error("Update failed"); }
  };

  
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/add-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: newRole })
      });
      if (res.ok) {
        toast.success("Member added! They can now login.");
        setOpen(false);
        fetchUsers();
        setNewName(""); setNewEmail(""); setNewPassword("");
      }
    } catch (err) { toast.error("Failed to add user"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Manage <span className="text-[#ff1e6d]">Users</span></h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
              <UserPlus size={18} /> Add Member
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#111113] border-zinc-800 text-white rounded-3xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic">Create <span className="text-[#ff1e6d]">New Account</span></DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 mt-4">
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">Full Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-black/40 border-zinc-800 text-white h-12 rounded-xl focus:border-[#ff1e6d]" placeholder="John Doe" required />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">Email Address</Label>
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="bg-black/40 border-zinc-800 text-white h-12 rounded-xl focus:border-[#ff1e6d]" placeholder="user@fable.com" required />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">Login Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-black/40 border-zinc-800 text-white h-12 rounded-xl focus:border-[#ff1e6d]" placeholder="••••••••" required />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">User Role</Label>
                <Select onValueChange={setNewRole} defaultValue="admin">
                  <SelectTrigger className="bg-black/40 border-zinc-800 h-12 rounded-xl text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-zinc-800 text-white">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="reader">Reader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <button type="submit" className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white font-black py-4 rounded-xl shadow-lg mt-4 active:scale-95 transition-all">
                Add Member to Database
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase tracking-widest text-[11px]">User Profile</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Email</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Role</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase tracking-widest text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all group">
                <td className="px-10 py-6 font-bold text-white">{user.name}</td>
                <td className="text-zinc-400 font-mono text-xs">{user.email}</td>
                <td className="py-6">
                  <Select onValueChange={(val) => handleRoleChange(user._id, val)} defaultValue={user.role || "reader"}>
                    <SelectTrigger className="w-[110px] bg-zinc-900 border-zinc-800 text-[#ff1e6d] h-8 text-[10px] font-black uppercase rounded-lg focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111113] border-zinc-800 text-white">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="writer">Writer</SelectItem>
                      <SelectItem value="reader">Reader</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="text-right px-10 py-6 flex justify-end gap-3">
                  <button onClick={() => handleDelete(user._id)} className="h-10 bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-3 transition-all">
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default UsersTab;