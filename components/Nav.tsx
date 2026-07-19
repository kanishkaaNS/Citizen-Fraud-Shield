"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-white underline underline-offset-4 decoration-2 decoration-[var(--grad-indigo)]" : "text-muted hover:text-white";
  };

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Announcement Bar */}
      <div
        className="w-full py-2 text-center text-sm font-medium text-white px-4"
        style={{ backgroundColor: "var(--announcement-bg)" }}
      >
        ET AI Hackathon 2026 · Problem Statement #6 — AI for Digital Public Safety
      </div>

      {/* Main Navigation */}
      <nav className="w-full border-b backdrop-blur-md" style={{ borderColor: "var(--border-hairline)", backgroundColor: "rgba(8, 8, 11, 0.8)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-primary hover:opacity-80 transition-opacity">
            Citizen Fraud Shield
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/scam" className={`text-sm font-medium transition-colors ${isActive("/scam")}`}>
              Scam Detector
            </Link>
            <Link href="/currency" className={`text-sm font-medium transition-colors ${isActive("/currency")}`}>
              Counterfeit Detector
            </Link>
            <Link href="/graph" className={`text-sm font-medium transition-colors ${isActive("/graph")}`}>
              Fraud Graph
            </Link>
            <a
              href="https://github.com/kanishkaaNS/Citizen-Fraud-Shield"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link href="/scam" className="btn-pill-primary">
              Try it now
            </Link>
          </div>
          
          {/* Mobile minimal nav */}
          <div className="md:hidden flex items-center gap-4">
             <Link href="/scam" className="btn-pill-primary text-xs px-3 py-1.5">
              Try it now
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
