type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 10_000;

/** Best-effort per-instance limiter; entries expire and are never persisted. */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): boolean {
  let entry = buckets.get(key);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }
  if (entry.count >= limit) return true;
  entry.count += 1;

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, value] of buckets) {
      if (now >= value.resetAt) buckets.delete(bucketKey);
      if (buckets.size <= MAX_BUCKETS) break;
    }
    if (buckets.size > MAX_BUCKETS) buckets.delete(buckets.keys().next().value as string);
  }
  return false;
}

export function getClientRateLimitKey(headers: Record<string, string | string[] | undefined>, fallback: string) {
  const forwarded = headers["x-vercel-forwarded-for"] || headers["x-forwarded-for"];
  const address = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
  return address || fallback || "unknown";
}
