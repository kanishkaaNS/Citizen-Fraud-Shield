import type { Metadata } from "next";
import GraphView from "@/components/GraphView";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fraud Network Graph — Citizen Fraud Shield",
  description:
    "Explore the fraud network — visualize scammer, victim, and mule account connections as an interactive graph.",
};

export default function GraphPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <header className="max-w-5xl mx-auto text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{
            background: "rgba(168, 85, 247, 0.1)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            color: "#c084fc",
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Pillar 3 · Graph Intelligence
        </div>
        <h1 className="text-4xl font-bold mb-3 gradient-text" style={{ lineHeight: 1.2 }}>
          Fraud Network Graph
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--foreground-muted)" }}>
          Visualize connections between scammers, victims, and mule accounts.
        </p>
      </header>

      <div className="max-w-5xl mx-auto">
        <GraphView />
      </div>
    </main>
  );
}
