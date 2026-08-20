interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 5000;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export function checkRateLimit(request: Request): { success: boolean; retryAfterMs: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { attempts: 1, windowStart: now });
    return { success: true, retryAfterMs: 0 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.windowStart);
    return { success: false, retryAfterMs };
  }

  entry.attempts++;
  return { success: true, retryAfterMs: 0 };
}
