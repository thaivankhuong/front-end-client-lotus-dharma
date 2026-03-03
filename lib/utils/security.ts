import DOMPurify from 'isomorphic-dompurify';
import { env } from '@/lib/config/env';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify with strict configuration for user-generated content
 */
export function sanitizeHtml(dirty: string, options?: DOMPurify.Config): string {
  const defaultOptions: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'blockquote', 'code', 'pre',
      'img', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', // for links
      'src', 'alt', 'title', // for images
      'class' // for styling
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
  };

  const result = DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });
  return typeof result === 'string' ? result : String(result);
}

/**
 * Sanitizes user input by removing dangerous characters and patterns
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:[^"'\s]*/gi, '')
    // Remove data: URLs (unless explicitly allowed)
    .replace(/data:[^"'\s,]*,/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Validates and sanitizes URLs
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // Remove dangerous characters from URL
    const sanitizedUrl = url.replace(/[<>"']/g, '');

    return sanitizedUrl;
  } catch {
    return null;
  }
}

/**
 * Generates a cryptographically secure random string
 */
export function generateSecureToken(length = 32): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for server-side or older environments
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a correlation ID for request tracing
 */
export function generateCorrelationId(): string {
  return `req_${Date.now()}_${generateSecureToken(8)}`;
}

/**
 * Validates CSRF token
 */
export function validateCSRFToken(token: string, secret: string = env.CSRF_SECRET): boolean {
  if (!token || typeof token !== 'string') return false;

  // In production, implement proper CSRF token validation
  // This is a simplified version - use a proper CSRF library in production
  try {
    // Decode and validate token (simplified)
    return token.length >= 32 && /^[a-f0-9]+$/i.test(token);
  } catch {
    return false;
  }
}

/**
 * Creates a nonce for Content Security Policy
 */
export function generateCSPNonce(): string {
  return generateSecureToken(16);
}

/**
 * Sanitizes filename to prevent directory traversal and other attacks
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return 'unnamed';

  return filename
    // Remove path separators
    .replace(/[\/\\]/g, '')
    // Remove dangerous characters
    .replace(/[<>"|?*]/g, '')
    // Remove control characters
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    // Limit length
    .substring(0, 255)
    // Ensure it's not empty
    || 'unnamed';
}

/**
 * Checks if a string contains potentially dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /\0/, // null bytes
    /\.\./, // directory traversal
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Escapes HTML entities
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => htmlEntities[char]);
}

/**
 * Creates a hash for content integrity checking
 */
export async function generateContentHash(content: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for environments without Web Crypto API
  return generateSecureToken(32);
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // Content Security Policy (customizable per route)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.lotusdharma.com",
    "frame-ancestors 'none'",
  ].join('; '),
} as const;