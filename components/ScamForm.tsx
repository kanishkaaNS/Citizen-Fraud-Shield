"use client";

import { useState } from "react";

interface ScamResult {
  risk_score: number;
  verdict: "SCAM" | "SUSPICIOUS" | "SAFE";
  flagged_phrases: string[];
  explanation: string;
}

export default function ScamForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ScamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/scam/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data as ScamResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "SCAM":
        return "var(--risk-scam)";
      case "SUSPICIOUS":
        return "var(--risk-suspicious)";
      case "SAFE":
        return "var(--risk-safe)";
      default:
        return "var(--foreground-muted)";
    }
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return `conic-gradient(var(--risk-scam) ${score}%, transparent ${score}%)`;
    if (score >= 30) return `conic-gradient(var(--risk-suspicious) ${score}%, transparent ${score}%)`;
    return `conic-gradient(var(--risk-safe) ${score}%, transparent ${score}%)`;
  };

  const highlightFlaggedPhrases = (inputText: string, phrases: string[]) => {
    if (!phrases.length) return inputText;

    let highlighted = inputText;
    phrases.forEach((phrase) => {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      highlighted = highlighted.replace(
        regex,
        '<mark style="background: rgba(239, 68, 68, 0.3); color: var(--foreground); padding: 2px 4px; border-radius: 4px;">$1</mark>'
      );
    });
    return highlighted;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="scam-text-input"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--foreground-muted)" }}
          >
            Paste the call transcript, SMS, WhatsApp message, or email content below
          </label>
          <textarea
            id="scam-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., &quot;This is CBI officer Sharma calling. Your Aadhaar has been linked to a money laundering case. You need to transfer ₹2,00,000 to a secure RBI account immediately or face arrest...&quot;"
            rows={8}
            maxLength={10000}
            className="w-full p-4 text-base"
            style={{ lineHeight: 1.6 }}
            required
          />
          <div
            className="flex justify-between mt-1 text-xs"
            style={{ color: "var(--foreground-muted)" }}
          >
            <span>Supports English, Hindi, Hinglish, and regional languages</span>
            <span>{text.length} / 10,000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || text.trim().length === 0}
          className="btn-primary w-full justify-center text-base"
          id="scam-submit-btn"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
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
              Analyze for Scam Risk
            </>
          )}
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div
          className="mt-6 p-4 rounded-xl animate-fade-in"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <p className="flex items-center gap-2 text-sm" style={{ color: "var(--risk-scam)" }}>
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-8 space-y-4">
          <div className="loading-shimmer h-32 rounded-xl" />
          <div className="loading-shimmer h-20 rounded-xl" />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6 animate-slide-up">
          {/* Score & Verdict */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-6">
              {/* Risk Gauge */}
              <div
                className="risk-gauge flex-shrink-0"
                style={{ background: getScoreGradient(result.risk_score) }}
              >
                <span
                  className="risk-gauge-value"
                  style={{ color: getVerdictColor(result.verdict) }}
                >
                  {result.risk_score}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      background: `${getVerdictColor(result.verdict)}22`,
                      color: getVerdictColor(result.verdict),
                      border: `1px solid ${getVerdictColor(result.verdict)}44`,
                    }}
                    id="scam-verdict-badge"
                  >
                    {result.verdict}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Risk Score: {result.risk_score}/100
                  </span>
                </div>
                <p className="text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {result.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Flagged Phrases */}
          {result.flagged_phrases.length > 0 && (
            <div className="glass-card p-6">
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--risk-scam)" }}
              >
                ⚠ Flagged Phrases ({result.flagged_phrases.length})
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {result.flagged_phrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#fca5a5",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                    }}
                  >
                    &ldquo;{phrase}&rdquo;
                  </span>
                ))}
              </div>

              {/* Highlighted text preview */}
              <div
                className="p-4 rounded-lg text-sm leading-relaxed"
                style={{
                  background: "var(--background-secondary)",
                  color: "var(--foreground-muted)",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: highlightFlaggedPhrases(text, result.flagged_phrases),
                }}
              />
            </div>
          )}

          {/* Safe message */}
          {result.verdict === "SAFE" && (
            <div
              className="glass-card p-6 text-center"
              style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
            >
              <div className="text-4xl mb-2">✅</div>
              <p className="font-semibold" style={{ color: "var(--risk-safe)" }}>
                No scam indicators detected
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                This message appears to be legitimate, but always exercise caution with unsolicited communications.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
