import { type NextRequest } from "next/server";
import { checkCurrency } from "@/lib/gemini";
import { insertCurrencyCheck } from "@/lib/supabase";
import { CURRENCY_CHECK_PROMPT } from "@/lib/prompts";

// Allowed image MIME types
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Simple in-memory rate limiter (same pattern as scam route)
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

/**
 * Generate a short hash of the image for the Supabase log.
 * Uses Web Crypto SHA-256, returns the first 16 hex chars.
 */
async function hashImage(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
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

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Invalid form data. Please upload an image file." },
      { status: 400 }
    );
  }

  const file = formData.get("image");

  // Validate file presence
  if (!file || !(file instanceof File)) {
    return Response.json(
      { error: "Missing 'image' field. Please upload a currency note photo." },
      { status: 400 }
    );
  }

  // Validate MIME type
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      {
        error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP.`,
      },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return Response.json(
      { error: "Uploaded file is empty." },
      { status: 400 }
    );
  }

  // Convert to base64 for Gemini API
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imageHash = await hashImage(arrayBuffer);

    // Call Gemini Vision
    const result = await checkCurrency(base64, file.type, CURRENCY_CHECK_PROMPT);

    // Log to Supabase (non-blocking)
    insertCurrencyCheck({
      image_hash: imageHash,
      verdict: result.verdict,
      confidence: result.confidence,
      indicators: result.indicators,
    }).catch((err) => {
      console.error("Supabase logging failed:", err);
    });

    return Response.json(result);
  } catch (error: any) {
    console.error("Currency check failed:", error);
    const msg = error?.message?.includes("taking longer than expected")
      ? error.message
      : "Currency analysis service unavailable. Please try again later.";
    return Response.json(
      { error: msg },
      { status: 502 }
    );
  }
}
