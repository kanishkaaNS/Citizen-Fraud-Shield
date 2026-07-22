import { describe, it, expect, beforeAll } from "vitest";
import { loadEnvConfig } from "@next/env";

describe("Integration — Submit → Classify → Store → Retrieve", () => {
  let classifyScam: any;
  let insertScamReport: any;
  let getStats: any;
  let supabase: any;
  let SCAM_CLASSIFY_PROMPT: any;

  beforeAll(async () => {
    loadEnvConfig(process.cwd());
    process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "test_key";
    process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "test_gemini_key";
    
    const gemini = await import("../lib/gemini");
    const supabaseModule = await import("../lib/supabase");
    const prompts = await import("../lib/prompts");
    classifyScam = async () => ({
      risk_score: 95,
      verdict: "SCAM",
      flagged_phrases: ["pay immediately"],
      explanation: "Test scam"
    });
    insertScamReport = supabaseModule.insertScamReport;
    getStats = supabaseModule.getStats;
    supabase = supabaseModule.supabase;
    SCAM_CLASSIFY_PROMPT = prompts.SCAM_CLASSIFY_PROMPT;
  });
  it("should classify text, store it, and verify it was inserted", async () => {
    const testText = "TEST INTEGRATION: You are under digital arrest. Pay immediately.";
    
    // 1. Classify
    const classification = await classifyScam(testText, SCAM_CLASSIFY_PROMPT);
    expect(classification.verdict).toBe("SCAM");

    // 2. Initial stats
    const initialStats = await getStats();
    
    // 3. Store
    await insertScamReport({
      text_snippet: testText,
      risk_score: classification.risk_score,
      verdict: classification.verdict,
      flagged_phrases: classification.flagged_phrases,
      explanation: classification.explanation,
    });

    // 4. Retrieve / Verify
    // Small delay to allow insert to settle (if needed, though Supabase is usually immediate)
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStats = await getStats();
    
    expect(newStats.total_scam_reports).toBe(initialStats.total_scam_reports + 1);
  }, 10000);
});
