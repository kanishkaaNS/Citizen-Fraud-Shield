"use client";

import { useState, useRef, useCallback } from "react";

interface CurrencyResult {
  verdict: "LIKELY_FAKE" | "SUSPICIOUS" | "LIKELY_GENUINE" | "NOT_CURRENCY";
  confidence: number;
  indicators: string[];
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function CurrencyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CurrencyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return `Unsupported file type. Please upload a JPEG, PNG, or WebP image.`;
    }
    if (f.size > MAX_SIZE_BYTES) {
      return `File too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_SIZE_MB} MB.`;
    }
    if (f.size === 0) {
      return "File is empty.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setResult(null);
      setFile(f);

      // Create preview URL
      const url = URL.createObjectURL(f);
      setPreview(url);
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) {
        handleFile(selected);
      }
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [preview]);

  const handleSubmit = async () => {
    if (!file) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/currency/check", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data as CurrencyResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "LIKELY_GENUINE":
        return "var(--risk-safe)";
      case "SUSPICIOUS":
        return "var(--risk-suspicious)";
      case "LIKELY_FAKE":
        return "var(--risk-scam)";
      case "NOT_CURRENCY":
        return "var(--foreground-muted)";
      default:
        return "var(--foreground-muted)";
    }
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case "LIKELY_GENUINE":
        return "Likely Genuine";
      case "SUSPICIOUS":
        return "Suspicious";
      case "LIKELY_FAKE":
        return "Likely Fake";
      case "NOT_CURRENCY":
        return "Not Currency";
      default:
        return verdict;
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "LIKELY_GENUINE":
        return "✅";
      case "SUSPICIOUS":
        return "⚠️";
      case "LIKELY_FAKE":
        return "🚨";
      case "NOT_CURRENCY":
        return "❌";
      default:
        return "❓";
    }
  };

  const getConfidenceGradient = (confidence: number, verdict: string) => {
    const color = getVerdictColor(verdict);
    return `conic-gradient(${color} ${confidence}%, transparent ${confidence}%)`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload area */}
      {!result && (
        <>
          <div
            className={`dropzone ${dragActive ? "dropzone-active" : ""} ${file ? "dropzone-has-file" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            id="currency-dropzone"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
              id="currency-file-input"
            />

            {preview && file ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Uploaded currency note preview"
                  className="image-preview mx-auto"
                />
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {file.name}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                    {file.type.split("/")[1].toUpperCase()} · Click or drop to
                    replace
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{
                    background: "rgba(6, 182, 212, 0.1)",
                    color: "var(--accent-400)",
                  }}
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-base font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    Drop a currency note photo here
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    or click to browse · JPEG, PNG, WebP · Max {MAX_SIZE_MB} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="btn-accent flex-1 justify-center text-base"
              id="currency-submit-btn"
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Check Authenticity
                </>
              )}
            </button>
            {file && !loading && (
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--background-card)",
                  color: "var(--foreground-muted)",
                  border: "1px solid var(--border)",
                }}
                id="currency-reset-btn"
              >
                Clear
              </button>
            )}
          </div>
        </>
      )}

      {/* Error state */}
      {error && (
        <div
          className="mt-6 p-4 rounded-xl animate-fade-in"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <p
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--risk-scam)" }}
          >
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-8 space-y-4">
          <div className="loading-shimmer h-32 rounded-xl" />
          <div className="loading-shimmer h-48 rounded-xl" />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Uploaded image + verdict header */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Confidence gauge */}
              <div
                className="risk-gauge flex-shrink-0"
                style={{
                  background: getConfidenceGradient(
                    result.confidence,
                    result.verdict
                  ),
                }}
              >
                <span
                  className="risk-gauge-value"
                  style={{ color: getVerdictColor(result.verdict) }}
                >
                  {result.confidence}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                  <span className="text-2xl">
                    {getVerdictIcon(result.verdict)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      background: `${getVerdictColor(result.verdict)}22`,
                      color: getVerdictColor(result.verdict),
                      border: `1px solid ${getVerdictColor(result.verdict)}44`,
                    }}
                    id="currency-verdict-badge"
                  >
                    {getVerdictLabel(result.verdict)}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    Confidence: {result.confidence}%
                  </span>
                </div>

                {result.verdict === "NOT_CURRENCY" ? (
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    The uploaded image doesn&apos;t appear to be a currency
                    note. Please upload a clear photo of an Indian Rupee
                    banknote.
                  </p>
                ) : result.verdict === "LIKELY_GENUINE" ? (
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--foreground)" }}
                  >
                    The note appears to have genuine security features. However,
                    always verify with a bank for high-value transactions.
                  </p>
                ) : result.verdict === "SUSPICIOUS" ? (
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--foreground)" }}
                  >
                    Some features raise concern. We recommend physical
                    verification at a bank before accepting this note.
                  </p>
                ) : (
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--foreground)" }}
                  >
                    Multiple indicators suggest this note may be counterfeit. Do
                    not accept it — report to your nearest bank or police
                    station.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded image preview */}
          {preview && (
            <div className="glass-card p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Analyzed currency note"
                className="image-preview mx-auto"
              />
            </div>
          )}

          {/* Indicators list */}
          {result.indicators.length > 0 && (
            <div className="glass-card p-6">
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: getVerdictColor(result.verdict) }}
              >
                🔍 Analysis Details ({result.indicators.length} observations)
              </h3>
              <div className="space-y-2">
                {result.indicators.map((indicator, i) => (
                  <div key={i} className="indicator-item">
                    <span
                      className="indicator-bullet"
                      style={{
                        background: getVerdictColor(result.verdict),
                      }}
                    />
                    <span>{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Try another */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="btn-accent justify-center"
              id="currency-try-another-btn"
            >
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                />
              </svg>
              Check Another Note
            </button>
          </div>

          {/* Disclaimer */}
          <div
            className="text-center text-xs p-3 rounded-lg"
            style={{
              color: "var(--foreground-muted)",
              background: "var(--background-secondary)",
            }}
          >
            ⚠️ This is an AI-assisted analysis tool, not a definitive
            authentication. Always consult a bank or authorized entity for
            official currency verification.
          </div>
        </div>
      )}
    </div>
  );
}
