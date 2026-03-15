"use client";
import { useState } from "react";

export default function GeneratorPage() {
  const templates = [
    { id: "fb-recovery", name: "Facebook Recovery", mask: "facebook", icon: "👤", description: "Account recovery and security check simulation." },
    { id: "ig-followers", name: "Instagram Followers", mask: "instagram", icon: "📸", description: "Free followers and engagement booster." },
    { id: "tiktok", name: "TikTok Booster", mask: "youtube", icon: "🎵", description: "Get viral and increase your view count." },
    { id: "pubg", name: "PUBG Mobile UC", mask: "google", icon: "🔫", description: "Free UC giveaway and skin rewards." },
    { id: "eid-gift", name: "Eid Celebration Gift", mask: "google", icon: "🌙", description: "Special festive rewards and gift cards." },
    { id: "temp-number", name: "Temporary Number", mask: "google", icon: "📱", description: "Get an anonymous temporary number for verifications." }
  ];

  const [selected, setSelected] = useState(null);
  const [maskedLink, setMaskedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateAndMask = async () => {
    if (!selected) return;
    setLoading(true);
    setMaskedLink("");
    setCopied(false);

    try {
      const baseUrl = window.location.origin;
      const uniqueId = Math.random().toString(36).substring(2, 6);
      const targetUrl = `${baseUrl}/${selected}-${uniqueId}`;

      // Request shortening
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url: targetUrl }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.shortUrl) {
        setMaskedLink(data.shortUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(maskedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="main-container animate-fade-in py-6 sm:py-12">
      <header className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">Link <span className="text-gradient">Generator</span></h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">Choose a tool and click to generate your secure link.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {templates.map((template) => (
          <div 
            key={template.id} 
            onClick={() => setSelected(template.id)}
            className={`glass-card p-5 sm:p-8 rounded-2xl cursor-pointer transition-all relative border-2 ${selected === template.id ? 'border-indigo-600 bg-indigo-50/50 scale-[1.02]' : 'border-transparent hover:bg-slate-50'}`}
          >
            <div className="text-2xl sm:text-4xl mb-3">{template.icon}</div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 text-slate-800">{template.name}</h3>
            <p className="text-[10px] sm:text-sm text-slate-500 line-clamp-2">{template.description}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {!maskedLink ? (
          <button 
            onClick={handleGenerateAndMask}
            disabled={!selected || loading}
            className={`w-full py-4 sm:py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${selected ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20' : 'bg-slate-100 text-slate-300'}`}
          >
            {loading ? "Generating Link..." : selected ? `Generate ${templates.find(t => t.id === selected)?.name} Link` : 'Select a tool above'}
          </button>
        ) : (
          <div className="animate-fade-in-up">
            <div className="p-6 sm:p-8 glass-card rounded-[1.5rem] border-emerald-200 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Link Generated Successfully</p>
                <button onClick={() => setMaskedLink("")} className="text-[10px] font-bold text-indigo-600">Create New</button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input readOnly value={maskedLink} className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold font-mono text-slate-700 shadow-inner overflow-hidden truncate" />
                <button 
                  onClick={copyToClipboard} 
                  className={`w-full sm:w-auto px-8 py-4 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 ${copied ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'}`}
                >
                  {copied ? 'Copied! ✨' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
