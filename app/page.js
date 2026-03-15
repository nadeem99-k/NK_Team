"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GatewayPage() {
  const [gatewayStep, setGatewayStep] = useState(0); // 0: Tasks, 1: Passed
  const [userName, setUserName] = useState("");
  const [shareProgress, setShareProgress] = useState(0);
  const [whatsappClicked, setWhatsappClicked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user already passed gateway
    if (typeof window !== "undefined") {
      const isCleared = localStorage.getItem("aura_gateway_cleared_v1");
      if (isCleared === "true") {
        router.push("/admin"); // Redirect immediately if cleared
      } else {
        setIsChecking(false);
      }
    }
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
    if (userName.trim().length > 1 && shareProgress >= 3 && whatsappClicked) {
      const uniqueId = "aura_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("aura_gateway_cleared_v1", "true");
      localStorage.setItem("aura_user_name", userName.trim());
      localStorage.setItem("aura_user_id", uniqueId);
      router.push("/admin"); // Redirect upon completion
    }
  };

  if (isChecking) return <div className="min-h-screen bg-slate-50"></div>;

  // STEP 0: Merged Security Check & Tasks
  const isReady = userName.trim().length > 1 && shareProgress >= 3 && whatsappClicked;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-900 relative">
      
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up mt-10 mb-10 px-4">

        <div className="bg-white/70 border border-white/50 rounded-[2rem] p-8 sm:p-12 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-[0_10px_20px_rgba(59,130,246,0.2)] relative">
            🛡️
            <div className="absolute inset-0 border-2 border-white/30 rounded-3xl"></div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-center mb-3 tracking-tight text-slate-900">Security Check</h1>
          <p className="text-slate-500 text-base text-center mb-10 leading-relaxed max-w-md mx-auto">
            Complete the verification steps below to unlock the VIP rewards generator.
          </p>

          {/* Step 1: Name Input */}
          <div className={`mb-6 p-6 rounded-2xl border-2 transition-all ${userName.trim().length > 1 ? 'bg-green-50/50 border-green-200' : 'bg-white/50 border-slate-200'}`}>
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center justify-between">
              <span className="flex items-center gap-3">
                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs text-slate-500">1</span>
                 Enter Your First Name
              </span>
              {userName.trim().length > 1 && <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold shadow-sm">✓</span>}
            </h3>
            <input
              type="text"
              required
              placeholder="First Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-white/60 border border-slate-200 focus:border-blue-500 rounded-xl px-5 py-4 text-slate-900 text-lg placeholder-slate-400 outline-none transition-all focus:bg-white shadow-inner"
            />
          </div>

          {/* Task 1: WhatsApp */}
          <div className={`mb-6 p-6 rounded-2xl border-2 transition-all ${whatsappClicked ? 'bg-green-50/50 border-green-200' : 'bg-white/50 border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] text-3xl shrink-0">
                 📱
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-base mb-1 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs text-slate-500 mr-1">2</span>
                  Join Official Channel
                  {whatsappClicked && <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold ml-2 shadow-sm">✓</span>}
                </h3>
                <p className="text-slate-500 text-sm mb-4 sm:mb-0 leading-relaxed">
                  Follow the official NK_TEAM✅ WhatsApp channel.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <a 
                  href="https://whatsapp.com/channel/0029Vb7x2fNATRSsiwgQrF3N"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setTimeout(() => setWhatsappClicked(true), 1500)}
                  className={`inline-block w-full sm:w-48 text-center py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm ${whatsappClicked ? 'bg-slate-100 text-slate-400 pointer-events-none' : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_4px_14px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)]'}`}
                >
                  {whatsappClicked ? "Channel Joined" : "Join via WhatsApp"}
                </a>
              </div>
            </div>
          </div>

          {/* Task 2: Share */}
          <div className={`mb-10 p-6 rounded-2xl border-2 transition-all ${shareProgress >= 3 ? 'bg-green-50/50 border-green-200' : 'bg-white/50 border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 text-3xl shrink-0">
                 ↗️
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-base mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-3">
                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs text-slate-500">3</span>
                     Share with Friends
                  </span>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">{shareProgress}/3</span>
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  Share this page with your friends on WhatsApp 3 times.
                </p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex mb-2 sm:mb-0">
                  <div 
                    className={`h-full transition-all duration-500 ${shareProgress >= 3 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${(shareProgress / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <button 
                  onClick={handleShareClick}
                  disabled={loading || shareProgress >= 3}
                  className={`relative overflow-hidden w-full sm:w-48 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm ${shareProgress >= 3 ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-white text-blue-600 border-2 border-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-[0_4px_14px_rgba(59,130,246,0.15)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.3)]'}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                       <span className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></span>
                       Processing...
                    </span>
                  ) : shareProgress >= 3 ? (
                    "Share Completed"
                  ) : (
                    "Share Now"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Final Action */}
          <button
            onClick={completeGateway}
            disabled={!isReady}
            className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide transition-all ${isReady ? 'bg-slate-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-slate-800 hover:scale-[1.02] cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
          >
            Start Verification
          </button>
          {!isReady && (
            <p className="text-center text-xs text-slate-400 mt-5 uppercase tracking-[0.2em] font-mono font-bold">
               Awaiting Task Completion
            </p>
          )}
          
        </div>
      </div>
    </div>
  );
}
