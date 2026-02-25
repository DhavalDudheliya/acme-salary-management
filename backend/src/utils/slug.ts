/**
 * Slug Generation Utility
 *
 * Converts a company name into a URL-safe slug used for tenant routing.
 * Example: "Acme Corp!" → "acme-corp"
 *
 * The slug is stored in the Domain model and used as the workspace
 * identifier in URLs (e.g., /acme-corp/login).
 */

/**
 * Convert a company name to a URL-safe slug.
 *
 * Transformation steps:
 * 1. Convert to lowercase
 * 2. Trim leading/trailing whitespace
 * 3. Remove special characters (keep letters, numbers, spaces, hyphens)
 * 4. Replace spaces and underscores with hyphens
 * 5. Collapse consecutive hyphens into one
 * 6. Remove leading/trailing hyphens
 *
 * @param companyName - The raw company name from registration
 * @returns URL-safe slug string
 *
 * @example
 * generateSlug("Acme Corp")     // "acme-corp"
 * generateSlug("My  Company!")  // "my-company"
 * generateSlug("  HELLO World ") // "hello-world"
 */
export function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Step 3: Remove special characters
    .replace(/[\s_]+/g, "-") // Step 4: Spaces/underscores → hyphens
    .replace(/-+/g, "-") // Step 5: Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Step 6: Trim leading/trailing hyphens
}
