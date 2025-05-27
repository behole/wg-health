import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class ApiValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ApiValidationError';
  }
}

export class ApiAuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'ApiAuthenticationError';
  }
}

export class ApiAuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'ApiAuthorizationError';
  }
}

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || record.resetTime < now) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  };
}

// Input validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiValidationError('Invalid input data', error.errors);
      }
      throw new ApiValidationError('Invalid JSON format');
    }
  };
}

// Error handler middleware
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiValidationError) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details 
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiAuthenticationError) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'AUTHENTICATION_ERROR',
        message: error.message 
      },
      { status: 401 }
    );
  }

  if (error instanceof ApiAuthorizationError) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'AUTHORIZATION_ERROR',
        message: error.message 
      },
      { status: 403 }
    );
  }

  // Generic server error
  return NextResponse.json(
    { 
      success: false, 
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred' 
    },
    { status: 500 }
  );
}

// CORS middleware
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Security headers middleware
export function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

// Request logging middleware
export function logRequest(request: NextRequest): void {
  const { method, url, headers } = request;
  const userAgent = headers.get('user-agent') || 'unknown';
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
}

// Main API wrapper with middleware
export function withApiMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: { maxRequests: number; windowMs: number };
    requireAuth?: boolean;
    cors?: boolean;
    security?: boolean;
    logging?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Request logging
      if (options.logging !== false) {
        logRequest(request);
      }

      // Rate limiting
      if (options.rateLimit) {
        const clientIp = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const limiter = rateLimit(options.rateLimit.maxRequests, options.rateLimit.windowMs);
        
        if (!limiter(clientIp)) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests' 
            },
            { status: 429 }
          );
        }
      }

      // Handle OPTIONS requests for CORS
      if (request.method === 'OPTIONS') {
        let response = new NextResponse(null, { status: 200 });
        if (options.cors !== false) {
          response = setCorsHeaders(response);
        }
        return response;
      }

      // Execute main handler
      let response = await handler(request);

      // Apply security headers
      if (options.security !== false) {
        response = setSecurityHeaders(response);
      }

      // Apply CORS headers
      if (options.cors !== false) {
        response = setCorsHeaders(response);
      }

      return response;

    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Common validation schemas
export const schemas = {
  appointment: z.object({
    title: z.string().min(1).max(100),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    location: z.string().max(200).optional(),
    withPerson: z.string().max(200).optional(),
    notes: z.string().max(500).optional()
  }),
  
  user: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    role: z.enum(['admin', 'family', 'user']).optional()
  }),
  
  priority: z.object({
    text: z.string().min(1).max(200),
    priority: z.enum(['high', 'medium', 'low']),
    dueDate: z.string().optional()
  }),
  
  medicine: z.object({
    name: z.string().min(1).max(100),
    dosage: z.string().min(1).max(50),
    frequency: z.string().min(1).max(100),
    times: z.array(z.string()),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    instructions: z.string().max(500).optional()
  })
};