import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from 'limiter';

// Store rate limiters in memory
const limiters = new Map<string, RateLimiter>();

// Default rate limits
const DEFAULT_TOKENS = 10;          // Number of requests allowed
const DEFAULT_INTERVAL = 60 * 1000; // Time window in milliseconds (1 minute)
const ANON_TOKENS = 5;              // Fewer tokens for anonymous users
const ANON_INTERVAL = 60 * 1000;    // Same time window for anonymous users
const IP_HEADER = 'x-forwarded-for'; // Header containing the real IP

// Type extension for msBeforeNext property
interface ExtendedRateLimiter extends RateLimiter {
  msBeforeNext: number;
}

/**
 * Rate limiting middleware for API routes
 * 
 * @param req The incoming request
 * @param anonymous Whether the user is anonymous
 * @returns NextResponse if rate limited, null if allowed
 */
export async function rateLimit(
  req: NextRequest,
  anonymous: boolean = true
): Promise<NextResponse | null> {
  // Get client identifier (IP address or user ID if authenticated)
  const ip = req.headers.get(IP_HEADER) || 'unknown';
  const clientId = anonymous ? `anon-${ip}` : `user-${ip}`; // Would use actual user ID in production
  
  // Get or create rate limiter for this client
  if (!limiters.has(clientId)) {
    const tokens = anonymous ? ANON_TOKENS : DEFAULT_TOKENS;
    const interval = anonymous ? ANON_INTERVAL : DEFAULT_INTERVAL;
    limiters.set(clientId, new RateLimiter({ tokensPerInterval: tokens, interval }));
  }
  
  const limiter = limiters.get(clientId)! as ExtendedRateLimiter;
  
  // Try to remove a token from the bucket
  const remainingTokens = await limiter.removeTokens(1);
  
  // If no tokens remain, rate limit is exceeded
  if (remainingTokens < 0) {
    const retryAfter = Math.floor(limiter.msBeforeNext / 1000) || 60; // Default to 60 seconds if msBeforeNext is unavailable
    return NextResponse.json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: {
          'Retry-After': `${retryAfter}`,
          'X-RateLimit-Limit': `${anonymous ? ANON_TOKENS : DEFAULT_TOKENS}`,
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': `${Math.floor((Date.now() + (limiter.msBeforeNext || 60000)) / 1000)}`
        }
      }
    );
  }
  
  // Request is allowed
  return null;
} 