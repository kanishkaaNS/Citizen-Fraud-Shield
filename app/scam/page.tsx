import type { Metadata } from "next";
import ScamForm from "@/components/ScamForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scam Detector — Citizen Fraud Shield",
  description:
    "Analyze call transcripts, SMS, and messages for digital-arrest scam indicators using AI-powered detection.",
};

export default function ScamPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      {/* Navigation */}
      <nav className="max-w-3xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--foreground-muted)" }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="max-w-3xl mx-auto text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "var(--primary-400)",
          }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          Pillar 1 · AI-Powered Analysis
        </div>
        <h1
          className="text-4xl font-bold mb-3 gradient-text"
          style={{ lineHeight: 1.2 }}
        >
          Scam Detector
        </h1>
        <p
          className="text-lg max-w-xl mx-auto"
          style={{ color: "var(--foreground-muted)" }}
        >
          Paste any suspicious call transcript, SMS, or message to instantly
          detect digital-arrest scam patterns and fraud indicators.
        </p>
      </header>

      {/* Form */}
      <ScamForm />

      {/* Info Section */}
      <section className="max-w-3xl mx-auto mt-12 mb-8">
        <div className="glass-card p-6">
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--foreground-muted)" }}
          >
            What this detects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🚔",
                label: "Digital Arrest Scams",
                desc: "Fake CBI/police calls demanding immediate payment",
              },
              {
                icon: "📱",
                label: "Impersonation Fraud",
                desc: "Scammers posing as government or bank officials",
              },
              {
                icon: "💳",
                label: "Financial Phishing",
                desc: "Requests for bank details, OTPs, or money transfers",
              },
              {
                icon: "🎭",
                label: "Social Engineering",
                desc: "Pressure tactics, threats, and urgency-based manipulation",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "var(--background-secondary)" }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
