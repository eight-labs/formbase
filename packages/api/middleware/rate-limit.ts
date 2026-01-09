const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const requestCounts = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds?: number;
}

export function checkRateLimit(keyId: string): RateLimitResult {
  const now = Date.now();
  const entry = requestCounts.get(keyId);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    requestCounts.set(keyId, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: new Date(now + WINDOW_MS),
    };
  }

  const remaining = MAX_REQUESTS - entry.count - 1;
  const resetAt = new Date(entry.windowStart + WINDOW_MS);

  if (entry.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfterSeconds,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: Math.max(0, remaining),
    resetAt,
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now - entry.windowStart >= WINDOW_MS * 2) {
      requestCounts.delete(key);
    }
  }
}, WINDOW_MS);
