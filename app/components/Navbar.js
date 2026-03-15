"use client";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  // Only show navbar on specific admin pages
  const isAdminPage = ["/admin", "/generator", "/vault"].includes(pathname);
  if (!isAdminPage) return null;

  return (
    <nav className="nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30 text-white">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Aura</span>
          </a>
          <div className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar py-2">
            <a href="/admin" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname === "/admin" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}>Dashboard</a>
            <a href="/generator" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname === "/generator" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}>Generator</a>
            <a href="/vault" className={`transition-colors text-xs sm:text-sm font-bold whitespace-nowrap ${pathname === "/vault" ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}>Saved Results</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
