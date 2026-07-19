import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Supabase environment variables not set — database operations will fail"
  );
}

/**
 * Server-side Supabase client using the service role key.
 * Never import this in client components.
 */
export const supabase = createClient(
  supabaseUrl || "",
  supabaseServiceKey || "",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export interface ScamReportRow {
  text_snippet: string;
  risk_score: number;
  verdict: string;
  flagged_phrases: string[];
  explanation: string;
}

export interface CurrencyCheckRow {
  image_hash: string;
  verdict: string;
  confidence: number;
  indicators: string[];
}

/**
 * Insert a scam report into the scam_reports table.
 * Stores only the first 200 chars of input text (data minimisation).
 */
export async function insertScamReport(report: ScamReportRow) {
  const { error } = await supabase.from("scam_reports").insert({
    text_snippet: report.text_snippet.substring(0, 200),
    risk_score: report.risk_score,
    verdict: report.verdict,
    flagged_phrases: report.flagged_phrases,
    explanation: report.explanation,
  });

  if (error) {
    console.error("Failed to insert scam report:", error.message);
    // Non-blocking: don't throw — logging failure shouldn't break the API response
  }
}

/**
 * Insert a currency check log into the currency_checks table.
 */
export async function insertCurrencyCheck(check: CurrencyCheckRow) {
  const { error } = await supabase.from("currency_checks").insert({
    image_hash: check.image_hash,
    verdict: check.verdict,
    confidence: check.confidence,
    indicators: check.indicators,
  });

  if (error) {
    console.error("Failed to insert currency check:", error.message);
  }
}

/**
 * Get aggregate stats for the reports endpoint.
 */
export async function getStats() {
  const [scamResult, currencyResult] = await Promise.all([
    supabase
      .from("scam_reports")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("currency_checks")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    total_scam_reports: scamResult.count ?? 0,
    total_currency_checks: currencyResult.count ?? 0,
  };
}
