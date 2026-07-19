import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-16 md:mt-24" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold tracking-tight text-primary mb-2">
              Citizen Fraud Shield
            </h2>
            <p className="text-sm italic" style={{ color: "var(--text-faint)" }}>
              Doubt hard. Build harder.
            </p>
          </div>

          {/* Pillars Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wide font-semibold text-primary mb-1">
              Pillars
            </h3>
            <Link href="/scam" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
              Scam Detector
            </Link>
            <Link href="/currency" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
              Counterfeit Detector
            </Link>
            <Link href="/graph" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
              Fraud Network Graph
            </Link>
          </div>

          {/* Project Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-wide font-semibold text-primary mb-1">
              Project
            </h3>
            <a
              href="https://github.com/kanishkaaNS/Citizen-Fraud-Shield"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}
            >
              GitHub Repo
            </a>
            <span className="text-sm font-medium cursor-default" style={{ color: "var(--text-muted)" }}>
              Problem Statement #6
            </span>
            <span className="text-sm font-medium cursor-default" style={{ color: "var(--text-muted)" }}>
              ET AI Hackathon 2026
            </span>
          </div>
        </div>

        {/* Small Print */}
        <div className="pt-8 border-t text-xs text-center md:text-left" style={{ borderColor: "var(--border-hairline)", color: "var(--text-faint)" }}>
          Built for ET AI Hackathon 2026 — Problem Statement #6: AI for Digital Public Safety
        </div>
      </div>
    </footer>
  );
}
