import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Citizen Fraud Shield — AI-Powered Digital Public Safety",
  description:
    "Real-time AI tools to detect digital-arrest scams, counterfeit currency, and map fraud networks. Protecting citizens before money moves.",
};

const pillars = [
  {
    id: "scam-detector",
    href: "/scam",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Scam Detector",
    description:
      "Paste a call transcript or message to instantly classify digital-arrest scam risk with AI-powered analysis.",
    tech: "Gemini Text AI",
    color: "#3b82f6",
    status: "live" as const,
  },
  {
    id: "counterfeit-detector",
    href: "/currency",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Counterfeit Detector",
    description:
      "Upload a photo of a currency note to check for counterfeit indicators using AI vision analysis.",
    tech: "Gemini Vision AI",
    color: "#06b6d4",
    status: "live" as const,
  },
  {
    id: "fraud-graph",
    href: "/graph",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "Fraud Network Graph",
    description:
      "Visualize scammer-victim-mule connections as an explorable graph to trace fraud patterns.",
    tech: "Neo4j Graph DB",
    color: "#a855f7",
    status: "coming" as const,
  },
];

const stats = [
  { value: "1.14M+", label: "Cybercrime complaints in India (2023)" },
  { value: "₹1,776 Cr", label: "Lost to digital-arrest scams (2024)" },
  { value: "3", label: "AI-powered detection pillars" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary-600)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--accent-500)" }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              color: "var(--primary-400)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            ET AI Hackathon 2026 — AI for Digital Public Safety
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s", lineHeight: 1.1 }}
          >
            <span className="gradient-text">Citizen Fraud Shield</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-4 animate-fade-in"
            style={{
              animationDelay: "0.2s",
              color: "var(--foreground)",
              fontWeight: 300,
            }}
          >
            AI-Powered Digital Public Safety Platform
          </p>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{
              animationDelay: "0.3s",
              color: "var(--foreground-muted)",
              lineHeight: 1.7,
            }}
          >
            Real-time tools to detect digital-arrest scams, identify counterfeit
            currency, and map fraud networks — protecting citizens{" "}
            <strong style={{ color: "var(--foreground)" }}>
              before money moves
            </strong>
            .
          </p>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/scam"
              className="btn-primary text-base px-8 py-3 justify-center"
              id="cta-try-scam-detector"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Try Scam Detector
            </Link>
            <a
              href="#pillars"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--background-card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              Explore All Pillars
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="py-8 px-4"
        style={{
          background: "var(--background-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-2xl md:text-3xl font-bold gradient-text"
              >
                {stat.value}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--foreground-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Three Pillars of Protection
          </h2>
          <p
            className="text-center mb-12 max-w-xl mx-auto"
            style={{ color: "var(--foreground-muted)" }}
          >
            Each pillar addresses a distinct fraud vector — together, they
            provide comprehensive citizen protection.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                id={pillar.id}
                className="glass-card p-6 transition-all duration-300 animate-slide-up group block"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${pillar.color}15`,
                    color: pillar.color,
                  }}
                >
                  {pillar.icon}
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background:
                        pillar.status === "live"
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                      color:
                        pillar.status === "live"
                          ? "var(--risk-safe)"
                          : "var(--risk-suspicious)",
                    }}
                  >
                    {pillar.status === "live" ? "● Live" : "◌ Coming Soon"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--foreground-muted)", lineHeight: 1.6 }}
                >
                  {pillar.description}
                </p>

                <div
                  className="text-xs font-mono px-2 py-1 rounded inline-block"
                  style={{
                    background: "var(--background-secondary)",
                    color: "var(--foreground-muted)",
                  }}
                >
                  {pillar.tech}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center text-sm"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--foreground-muted)",
        }}
      >
        <p>
          Built for{" "}
          <strong style={{ color: "var(--foreground)" }}>
            ET AI Hackathon 2026
          </strong>{" "}
          — Problem Statement #6: AI for Digital Public Safety
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--border-light)" }}>
          Doubt hard. Build harder.
        </p>
      </footer>
    </main>
  );
}
