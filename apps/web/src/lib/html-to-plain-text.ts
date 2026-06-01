/** Strip HTML tags and normalize whitespace for plain-text previews. */
export function htmlToPlainText(html: string): string {
  if (!html) return "";

  const normalized = html.replace(/\s+/g, " ").trim();
  if (!/<[a-z][\s\S]*>/i.test(normalized)) {
    return normalized;
  }

  if (typeof document !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
  }

  return normalized
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
