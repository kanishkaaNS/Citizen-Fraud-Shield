import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

/**
 * Lazily initialize the Gemini client so the module can be imported
 * at build time without throwing when env vars are unavailable.
 */
function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

export interface ScamClassificationResult {
  risk_score: number;
  verdict: "SCAM" | "SUSPICIOUS" | "SAFE";
  flagged_phrases: string[];
  explanation: string;
}

export interface CurrencyCheckResult {
  verdict: "LIKELY_FAKE" | "SUSPICIOUS" | "LIKELY_GENUINE" | "NOT_CURRENCY";
  confidence: number;
  indicators: string[];
}

/**
 * Classify a text transcript/message for digital-arrest scam indicators.
 * Returns structured JSON with risk_score, verdict, flagged phrases, and explanation.
 */
export async function classifyScam(
  text: string,
  systemPrompt: string
): Promise<ScamClassificationResult> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n---\n\nTEXT TO ANALYZE:\n${text}` }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const response = result.response;
  const responseText = response.text();

  const parsed = JSON.parse(responseText) as ScamClassificationResult;

  // Validate the response shape
  if (
    typeof parsed.risk_score !== "number" ||
    !["SCAM", "SUSPICIOUS", "SAFE"].includes(parsed.verdict) ||
    !Array.isArray(parsed.flagged_phrases) ||
    typeof parsed.explanation !== "string"
  ) {
    throw new Error("Invalid response schema from Gemini");
  }

  // Clamp risk_score to 0-100
  parsed.risk_score = Math.max(0, Math.min(100, Math.round(parsed.risk_score)));

  return parsed;
}

/**
 * Check a currency note image for counterfeit indicators.
 * Accepts a base64-encoded image string.
 */
export async function checkCurrency(
  imageBase64: string,
  mimeType: string,
  systemPrompt: string
): Promise<CurrencyCheckResult> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: systemPrompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const response = result.response;
  const responseText = response.text();

  const parsed = JSON.parse(responseText) as CurrencyCheckResult;

  // Validate response shape
  if (
    !["LIKELY_FAKE", "SUSPICIOUS", "LIKELY_GENUINE", "NOT_CURRENCY"].includes(
      parsed.verdict
    ) ||
    typeof parsed.confidence !== "number" ||
    !Array.isArray(parsed.indicators)
  ) {
    throw new Error("Invalid response schema from Gemini");
  }

  parsed.confidence = Math.max(0, Math.min(100, Math.round(parsed.confidence)));

  return parsed;
}
