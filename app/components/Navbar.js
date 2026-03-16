"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedName = (localStorage.getItem("aura_user_name") || "").toLowerCase();
    setIsAdmin(storedName === "admin" || storedName === "stupidking");
  }, []);

  // Show navbar on user-facing pages
  const showNavbar = ["/admin", "/admin/users", "/generator", "/vault", "/dashboard"].includes(pathname);
  if (!showNavbar) return null;

  return (
    <nav className="nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30 text-white">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Aura</span>
          </a>
          <div className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar py-2">
            <a href="/dashboard" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname === "/dashboard" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}>Dashboard</a>
            <a href="/generator" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname === "/generator" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}>Generator</a>
            <a href="/vault" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname === "/vault" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}>Saved Results</a>
            {isAdmin && (
              <a href="/admin" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname.startsWith("/admin") ? "text-amber-600" : "text-amber-500 hover:text-amber-700"}`}>⚡ Admin</a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
