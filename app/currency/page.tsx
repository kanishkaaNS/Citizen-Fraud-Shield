import type { Metadata } from "next";
import CurrencyUpload from "@/components/CurrencyUpload";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notice Detector — Citizen Fraud Shield",
  description:
    "Upload a photo of a legal, police, or government notice to check if it's genuine or a scam.",
};

export default function CurrencyPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-hairline)",
            color: "var(--text-muted)",
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Pillar 2 · AI Vision Analysis
        </div>
        <h1 className="text-4xl font-bold mb-3 gradient-text" style={{ lineHeight: 1.2 }}>
          Notice Detector
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--foreground-muted)" }}>
          Upload a photo of a legal, police, or government notice to check if it's genuine or a scam.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <CurrencyUpload />
      </div>
    </main>
  );
}
