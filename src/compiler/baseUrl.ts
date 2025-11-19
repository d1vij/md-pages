
/** True if a URL is relative and should be rewritten */
function isRelativeUrl(url: string): boolean {
  if (!url) return false;

  // Absolute schemes
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return false;

  // Already absolute (starting with /)
  if (url.startsWith("/")) return false;

  // Anchors
  if (url.startsWith("#")) return false;

  return true;
}

/** Resolve relative paths against the base */
export function resolveRelativeUrl(base: string, href: string): string {
  if(isRelativeUrl(href)){
    const resolved = new URL(href, base).toString();
    return resolved;
  }
  else return href
}
