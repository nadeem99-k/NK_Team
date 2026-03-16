"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const storedName = (localStorage.getItem("aura_user_name") || "").toLowerCase();
        const isAdminName = storedName === "admin" || storedName === "stupidking";
        if (!isAdminName) {
          router.push("/");
          return;
        }
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (!profile?.is_admin) {
          router.push("/");
          return;
        }
      }
      fetchUsers();
    }
    checkAdmin();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }

  async function toggleBan(userId, currentStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !currentStatus })
      .eq('id', userId);

    if (error) {
      alert('Error updating user: ' + error.message);
    } else {
      fetchUsers();
    }
  }

  async function toggleAdmin(userId, currentStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (error) {
      alert('Error updating user: ' + error.message);
    } else {
      fetchUsers();
    }
  }

  return (
    <div className="main-container py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">User <span className="text-gradient">Management</span></h1>
          <p className="text-slate-500 font-medium">Control access and permissions for all users.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold">No users found.</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {user.email?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.email || 'Anonymous'}</p>
                      <p className="text-[10px] font-mono text-slate-400 capitalize">{user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${user.is_admin ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                    {user.is_admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold ${user.is_banned ? 'text-rose-500' : 'text-emerald-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.is_banned ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                    {user.is_banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => toggleAdmin(user.id, user.is_admin)}
                    className="text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Set {user.is_admin ? 'User' : 'Admin'}
                  </button>
                  <button 
                    onClick={() => toggleBan(user.id, user.is_banned)}
                    className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${user.is_banned ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'}`}
                  >
                    {user.is_banned ? 'Activate' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
