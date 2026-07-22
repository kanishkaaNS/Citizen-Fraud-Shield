import { type NextRequest } from "next/server";
import { classifyScam } from "@/lib/gemini";
import { insertScamReport } from "@/lib/supabase";
import { SCAM_CLASSIFY_PROMPT } from "@/lib/prompts";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  // Parse and validate request body
  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { text } = body;

  // Validate input
  if (!text || typeof text !== "string") {
    return Response.json(
      { error: "Missing or invalid 'text' field. Must be a non-empty string." },
      { status: 400 }
    );
  }

  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    return Response.json(
      { error: "Text cannot be empty." },
      { status: 400 }
    );
  }

  if (trimmedText.length > 10000) {
    return Response.json(
      { error: "Text exceeds maximum length of 10,000 characters." },
      { status: 400 }
    );
  }

  // Classify with Gemini
  try {
    const result = await classifyScam(trimmedText, SCAM_CLASSIFY_PROMPT);

    // Log to Supabase (non-blocking)
    insertScamReport({
      text_snippet: trimmedText,
      risk_score: result.risk_score,
      verdict: result.verdict,
      flagged_phrases: result.flagged_phrases,
      explanation: result.explanation,
    }).catch((err) => {
      console.error("Supabase logging failed:", err);
    });

    return Response.json(result);
  } catch (error: any) {
    console.error("Scam classification failed:", error);
    const msg = error?.message || "Classification service unavailable. Please try again later.";
    return Response.json(
      { error: msg },
      { status: 502 }
    );
  }
}
