"use client";

import { useEffect, useState } from "react";

export default function PlatformStats() {
  const [stats, setStats] = useState<{ total_scam_reports: number; total_currency_checks: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/reports");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (error) return null;

  if (loading) {
    return (
      <div className="mt-12 flex items-center justify-center gap-4 opacity-50">
        <div className="loading-shimmer h-6 w-64 rounded-md"></div>
      </div>
    );
  }

  if (!stats) return null;
  if (stats.total_scam_reports === 0 && stats.total_currency_checks === 0) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-3 text-sm font-medium animate-fade-in" style={{ color: "var(--foreground-muted)" }}>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--risk-safe)" }}></span>
        <span className="text-white">{stats.total_scam_reports.toLocaleString()}</span> scam messages analyzed
      </div>
      <span style={{ color: "var(--border-light)" }}>·</span>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent-400)" }}></span>
        <span className="text-white">{stats.total_currency_checks.toLocaleString()}</span> currency notes checked
      </div>
    </div>
  );
}
