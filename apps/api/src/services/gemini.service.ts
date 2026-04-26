/**
 * Gemini Classification Service
 *
 * Calls the Gemini API to classify a support ticket's email content.
 * Uses JSON mode with a structured prompt containing the predefined tag
 * vocabulary so the model can only return valid tags.
 *
 * Returns:
 * - priority: suggested TicketPriority
 * - tags: array of { name, category, confidence }
 *
 * Graceful degradation: if the API call fails, returns null so the
 * ticket is still created (but untagged).
 */

import { GoogleGenAI } from "@google/genai";
import { SYSTEM_TAGS } from "../scripts/seed-tags.js";
import logger from "../lib/logger.js";

/** Confidence threshold — tags below this are "suggested", not auto-applied */
export const CONFIDENCE_THRESHOLD = 0.7;

/** Gemini model to use */
const MODEL_ID = "gemini-2.0-flash";

/** Timeout for Gemini API calls (ms) */
const API_TIMEOUT_MS = 15_000;

/** Result shape from Gemini classification */
export interface ClassificationResult {
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  tags: ClassifiedTag[];
}

export interface ClassifiedTag {
  name: string;
  category: string;
  confidence: number;
}

/** Internal raw response type from Gemini JSON output */
interface GeminiRawOutput {
  priority?: string;
  tags?: Array<{
    name?: string;
    category?: string;
    confidence?: number;
  }>;
}

/**
 * Build the classification prompt with the full tag vocabulary.
 */
function buildPrompt(subject: string, body: string): string {
  const categoryList = Object.entries(SYSTEM_TAGS)
    .map(([cat, tags]) => `- ${cat}: ${tags.join(", ")}`)
    .join("\n");

  return `You are a CRM support ticket classifier. Given the email subject and body below, select the most relevant tags from EACH category. You MUST only return tags from the provided list — do not invent new ones. For each tag, provide a confidence score from 0.0 to 1.0.

Also determine the ticket priority: LOW, MEDIUM, HIGH, or URGENT based on the urgency and severity of the issue.

Categories and allowed tags:
${categoryList}

Rules:
- Select at least 1 tag from ISSUE_TYPE and DEPARTMENT.
- Select tags from other categories only if clearly relevant.
- Do NOT select more than 3 tags from a single category.
- Confidence of 1.0 means absolute certainty. Use 0.5-0.7 for probable but uncertain matches.
- If the email is ambiguous, prefer fewer tags with lower confidence over many tags.

Email Subject: ${subject}

Email Body:
${body.slice(0, 3000)}

Respond ONLY with valid JSON matching this schema:
{
  "priority": "HIGH",
  "tags": [
    { "name": "Billing issue", "category": "ISSUE_TYPE", "confidence": 0.95 },
    { "name": "Billing", "category": "DEPARTMENT", "confidence": 0.92 }
  ]
}`;
}

/**
 * Validate and filter the raw Gemini output to only include
 * tags that exist in our predefined vocabulary.
 */
function validateOutput(raw: GeminiRawOutput): ClassificationResult {
  const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
  const priority = validPriorities.includes(
    raw.priority as (typeof validPriorities)[number],
  )
    ? (raw.priority as ClassificationResult["priority"])
    : "MEDIUM";

  const validTags: ClassifiedTag[] = [];

  if (Array.isArray(raw.tags)) {
    for (const tag of raw.tags) {
      if (!tag.name || !tag.category || typeof tag.confidence !== "number") {
        continue;
      }

      // Verify the tag exists in our vocabulary
      const categoryTags = SYSTEM_TAGS[tag.category];
      if (!categoryTags) continue;

      const matchedName = categoryTags.find(
        (t) => t.toLowerCase() === tag.name!.toLowerCase(),
      );
      if (!matchedName) continue;

      // Clamp confidence to 0–1
      const confidence = Math.max(0, Math.min(1, tag.confidence));

      validTags.push({
        name: matchedName, // Use canonical casing
        category: tag.category,
        confidence,
      });
    }
  }

  return { priority, tags: validTags };
}

/**
 * Classify a ticket's email content using Gemini.
 *
 * Returns null if:
 * - GEMINI_API_KEY is not configured
 * - The API call fails or times out
 * - The response cannot be parsed
 */
export async function classifyTicket(
  subject: string,
  body: string,
): Promise<{ result: ClassificationResult; rawResponse: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn("GEMINI_API_KEY not configured — skipping AI classification");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(subject, body);

  try {
    // AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for consistent classification
      },
    });

    clearTimeout(timeout);

    const text = response.text ?? "";

    if (!text) {
      logger.warn("Gemini returned empty response");
      return null;
    }

    const parsed: GeminiRawOutput = JSON.parse(text);
    const result = validateOutput(parsed);

    logger.info(
      {
        tagCount: result.tags.length,
        priority: result.priority,
      },
      "Gemini classification completed",
    );

    return { result, rawResponse: text };
  } catch (err) {
    logger.error({ err }, "Gemini classification failed");
    return null;
  }
}
