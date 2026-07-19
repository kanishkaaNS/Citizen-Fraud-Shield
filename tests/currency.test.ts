import { describe, it, expect, vi } from "vitest";

// Mock the Gemini module
vi.mock("@/lib/gemini", () => ({
  checkCurrency: vi.fn(),
}));

import { checkCurrency } from "@/lib/gemini";

const mockCheckCurrency = vi.mocked(checkCurrency);

describe("Currency Checker — Schema Validation", () => {
  it("returns correct schema shape for a genuine note", async () => {
    const mockResponse = {
      verdict: "LIKELY_GENUINE" as const,
      confidence: 88,
      indicators: [
        "Watermark of Mahatma Gandhi is clearly visible and properly positioned",
        "Security thread appears intact with colour-shifting properties",
        "Intaglio printing shows raised texture on denomination numeral",
      ],
    };

    mockCheckCurrency.mockResolvedValueOnce(mockResponse);

    const result = await checkCurrency("base64data", "image/jpeg", "test prompt");

    expect(result).toHaveProperty("verdict");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("indicators");

    expect(["LIKELY_FAKE", "SUSPICIOUS", "LIKELY_GENUINE", "NOT_CURRENCY"]).toContain(
      result.verdict
    );
    expect(typeof result.confidence).toBe("number");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.indicators)).toBe(true);
  });

  it("returns correct schema shape for a fake note", async () => {
    const mockResponse = {
      verdict: "LIKELY_FAKE" as const,
      confidence: 91,
      indicators: [
        "Watermark appears printed rather than embedded in paper",
        "Security thread is absent — likely a colour photocopy",
        "Serial number font is inconsistent with RBI standards",
        "Overall print quality is blurry with visible dot patterns",
      ],
    };

    mockCheckCurrency.mockResolvedValueOnce(mockResponse);

    const result = await checkCurrency("base64data", "image/jpeg", "test prompt");

    expect(result.verdict).toBe("LIKELY_FAKE");
    expect(result.confidence).toBeGreaterThanOrEqual(70);
    expect(result.indicators.length).toBeGreaterThan(0);
  });

  it("returns correct schema shape for a suspicious note", async () => {
    const mockResponse = {
      verdict: "SUSPICIOUS" as const,
      confidence: 55,
      indicators: [
        "Image quality limits analysis — some features cannot be verified",
        "Watermark is partially visible but appears faded",
      ],
    };

    mockCheckCurrency.mockResolvedValueOnce(mockResponse);

    const result = await checkCurrency("base64data", "image/png", "test prompt");

    expect(result.verdict).toBe("SUSPICIOUS");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
  });

  it("returns NOT_CURRENCY for non-currency images", async () => {
    const mockResponse = {
      verdict: "NOT_CURRENCY" as const,
      confidence: 95,
      indicators: [
        "The uploaded image does not appear to be a banknote",
      ],
    };

    mockCheckCurrency.mockResolvedValueOnce(mockResponse);

    const result = await checkCurrency("base64data", "image/webp", "test prompt");

    expect(result.verdict).toBe("NOT_CURRENCY");
  });
});

describe("Currency Checker — Error Handling", () => {
  it("propagates Gemini API errors", async () => {
    mockCheckCurrency.mockRejectedValueOnce(
      new Error("Gemini API rate limited")
    );

    await expect(
      checkCurrency("base64data", "image/jpeg", "test prompt")
    ).rejects.toThrow("Gemini API rate limited");
  });

  it("propagates network errors", async () => {
    mockCheckCurrency.mockRejectedValueOnce(new Error("Network error"));

    await expect(
      checkCurrency("base64data", "image/jpeg", "test prompt")
    ).rejects.toThrow("Network error");
  });
});
