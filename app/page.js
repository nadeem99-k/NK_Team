"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GatewayPage() {
  const [gatewayStep, setGatewayStep] = useState(0); // 0: Tasks, 1: Passed
  const [userName, setUserName] = useState("");
  const [shareProgress, setShareProgress] = useState(0);
  const [whatsappClicked, setWhatsappClicked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      if (typeof window === "undefined") return;

      const isCleared = localStorage.getItem("aura_gateway_cleared_v1") === "true";
      const storedName = localStorage.getItem("aura_user_name") || "";

      // If already cleared, go straight to the dashboard
      if (isCleared && storedName) {
        router.replace("/dashboard");
        // Keep isChecking=true (shows blank) while redirect happens — that's fine
        return;
      }

      if (storedName) {
        setUserName(storedName);
      }
      setIsChecking(false);
    }
    checkUser();
  }, [router]);

  const handleShareClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (shareProgress < 3) {
        setShareProgress(prev => prev + 1);
        
        if (navigator.share) {
          navigator.share({
            title: 'Free Rewards & Tools',
            text: 'I just unlocked amazing free rewards and tools. Check it out here:',
            url: window.location.href,
          }).catch(console.error);
        } else {
          window.open(`https://wa.me/?text=${encodeURIComponent('I just unlocked amazing free rewards and tools. Check it out here: ' + window.location.href)}`, '_blank');
        }
      }
    }, 1500);
  };

  const completeGateway = () => {
    if (userName.trim().length < 2) return;

    const isCleared = localStorage.getItem("aura_gateway_cleared_v1") === "true";
    if (!isCleared && (shareProgress < 3 || !whatsappClicked)) return;

    // Generate or reuse user ID
    let uniqueId = localStorage.getItem("aura_user_id");
    if (!uniqueId || !uniqueId.includes('-')) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        uniqueId = crypto.randomUUID();
      } else {
        uniqueId = Math.random().toString(36).substring(2, 12) + '-' + Math.random().toString(36).substring(2, 12);
      }
    }

    // Save to localStorage and redirect — no Supabase blocking
    localStorage.setItem("aura_gateway_cleared_v1", "true");
    localStorage.setItem("aura_user_name", userName.trim());
    localStorage.setItem("aura_user_id", uniqueId);
    router.push("/dashboard");
  };

  if (isChecking) return <div className="min-h-screen bg-slate-50"></div>;

  // STEP 0: Merged Security Check & Tasks
  const isReady = userName.trim().length > 1 && shareProgress >= 3 && whatsappClicked;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-slate-900 relative">
      
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up my-6 sm:my-10 px-0 sm:px-4">

        <div className="bg-white/80 border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-12 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative text-center">
          
          {!(userName && localStorage.getItem("aura_gateway_cleared_v1") === "true") && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-6 sm:mb-8 shadow-[0_10px_20px_rgba(59,130,246,0.15)] relative">
                🛡️
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl sm:rounded-3xl"></div>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black text-center mb-2 sm:mb-3 tracking-tight text-slate-900">Security Check</h1>
              <p className="text-slate-500 text-sm sm:text-base text-center mb-8 sm:mb-10 leading-relaxed max-w-sm sm:max-w-md mx-auto">
                Complete the verification steps below to unlock the VIP rewards generator.
              </p>
            </>
          )}


          {/* Step 1: Name Input (Hidden if already set) */}
          {!(userName && localStorage.getItem("aura_gateway_cleared_v1") === "true") && (
            <div className={`mb-4 sm:mb-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${userName.trim().length > 1 ? 'bg-green-50/40 border-green-200/60' : 'bg-white/40 border-slate-100'}`}>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-3 sm:mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 sm:gap-3">
                   <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-[10px] sm:text-xs text-slate-500">1</span>
                   Enter Your Name
                </span>
                {userName.trim().length > 1 && <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 text-white text-[10px] sm:text-xs font-bold shadow-sm">✓</span>}
              </h3>
              <input
                type="text"
                required
                placeholder="First Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-slate-900 text-base sm:text-lg placeholder-slate-400 outline-none transition-all focus:bg-white shadow-inner"
              />
            </div>
          )}

          {/* Task 1: WhatsApp (Conditionally Hidden) */}
          {localStorage.getItem("aura_gateway_cleared_v1") !== "true" && (
            <div className={`mb-4 sm:mb-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${whatsappClicked ? 'bg-green-50/40 border-green-200/60' : 'bg-white/40 border-slate-100'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-5">
                <div className="hidden sm:flex w-14 h-14 rounded-full bg-[#25D366]/10 items-center justify-center text-[#25D366] text-3xl shrink-0">
                   📱
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-[10px] sm:text-xs text-slate-500 mr-1">2</span>
                    Join NK_TEAM Channel
                    {whatsappClicked && <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 text-white text-[8px] sm:text-[10px] font-bold ml-1 shadow-sm">✓</span>}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Join our official WhatsApp channel for updates.
                  </p>
                </div>
                <div className="w-full md:w-auto mt-2 md:mt-0">
                  <a 
                    href="https://whatsapp.com/channel/0029Vb7x2fNATRSsiwgQrF3N"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setTimeout(() => setWhatsappClicked(true), 1500)}
                    className={`inline-block w-full md:w-44 text-center py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${whatsappClicked ? 'bg-slate-100 text-slate-400 pointer-events-none' : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_4px_14px_rgba(37,211,102,0.2)]'}`}
                  >
                    {whatsappClicked ? "Joined" : "Join Channel"}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Task 2: Share (Conditionally Hidden) */}
          {localStorage.getItem("aura_gateway_cleared_v1") !== "true" && (
            <div className={`mb-8 sm:mb-10 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${shareProgress >= 3 ? 'bg-green-50/40 border-green-200/60' : 'bg-white/40 border-slate-100'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-5">
                <div className="hidden sm:flex w-14 h-14 rounded-full bg-blue-500/10 items-center justify-center text-blue-600 text-3xl shrink-0">
                   ↗️
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 sm:gap-3">
                       <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-[10px] sm:text-xs text-slate-500">3</span>
                       Share with Friends
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold bg-slate-100 px-2 sm:px-3 py-1 rounded-full text-slate-500">{shareProgress}/3</span>
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                    Share this page 3 times on WhatsApp.
                  </p>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-700 ease-out ${shareProgress >= 3 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${(shareProgress / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-full md:w-auto mt-1 md:mt-0">
                  <button 
                    onClick={handleShareClick}
                    disabled={loading || shareProgress >= 3}
                    className={`relative overflow-hidden w-full md:w-44 py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${shareProgress >= 3 ? 'bg-slate-50 text-slate-400 border border-slate-100' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-sm'}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                         <span className="w-3.5 h-3.5 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></span>
                         Sharing...
                      </span>
                    ) : shareProgress >= 3 ? (
                      "Completed"
                    ) : (
                      "Share Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Final Action */}
          <button
            onClick={completeGateway}
            disabled={userName.trim().length < 2 || (localStorage.getItem("aura_gateway_cleared_v1") !== "true" && !isReady)}
            className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl tracking-tight transition-all duration-300 ${userName.trim().length >= 2 && (localStorage.getItem("aura_gateway_cleared_v1") === "true" || isReady) ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800 active:scale-[0.98] cursor-pointer' : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-100'}`}
          >
            {localStorage.getItem("aura_gateway_cleared_v1") === "true" 
              ? "Enter Dashboard"
              : "Start Verification"}
          </button>
          {localStorage.getItem("aura_gateway_cleared_v1") !== "true" && !isReady && (
            <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-4 sm:mt-5 uppercase tracking-[0.15em] font-mono font-bold opacity-60">
               Completion Required
            </p>
          )}
          
        </div>
      </div>
    </div>
  );
}
