type RateLimitInput = {
  key: string;
  limit?: number;
  windowMs?: number;
};

export async function assertRateLimit({
  key,
  limit = 10,
  windowMs = 60_000,
}: RateLimitInput) {
  // Placeholder implementation.
  // Swap this for Redis/Upstash or a provider-level rate limiter before launch.
  return {
    allowed: true,
    key,
    limit,
    remaining: limit,
    resetAt: new Date(Date.now() + windowMs),
  };
}

