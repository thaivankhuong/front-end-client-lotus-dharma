#!/usr/bin/env node

/**
 * Debug environment validation
 * Run: node scripts/debug-env.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { z } = require('zod');

// Environment variables schema (copy từ lib/config/env.ts)
const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('LotusDharma'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000'),
  API_TIMEOUT: z.coerce.number().default(30000),
  API_RETRIES: z.coerce.number().default(3),

  // Authentication
  NEXT_PUBLIC_JWT_SECRET: z.string().min(32),
  JWT_REFRESH_COOKIE_NAME: z.string().default('refresh_token'),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

  // Security
  CSRF_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),

  // CDN & Assets (Optional)
  NEXT_PUBLIC_CDN_URL: z.string().url().optional(),
  NEXT_PUBLIC_IMAGE_DOMAIN: z.string().optional(),

  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_WEBHOOK_URL: z.string().url().optional(),

  // Caching
  CACHE_REVALIDATE_INTERVAL: z.coerce.number().default(3600),
  ISR_REVALIDATE_INTERVAL: z.coerce.number().default(86400),

  // Feature Flags
  FEATURE_I18N: z.coerce.boolean().default(false),
  FEATURE_ANALYTICS: z.coerce.boolean().default(false),
  FEATURE_PWA: z.coerce.boolean().default(false),

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  // External Services
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
});

console.log('🔍 Debugging environment validation...\n');

// Check individual required variables
console.log('📋 Checking required environment variables:');
console.log('');

const requiredVars = ['NEXT_PUBLIC_JWT_SECRET', 'CSRF_SECRET'];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}:`);
  console.log(`  Value: ${value ? `"${value.substring(0, 10)}..." (${value.length} chars)` : 'undefined'}`);
  console.log(`  Valid: ${value && value.length >= 32 ? '✅' : '❌'}`);
  console.log('');
});

// Try validation
console.log('🚀 Running Zod validation...');
try {
  const result = envSchema.parse(process.env);
  console.log('✅ Validation successful!');
  console.log('📊 Parsed environment:', {
    NODE_ENV: result.NODE_ENV,
    NEXT_PUBLIC_API_URL: result.NEXT_PUBLIC_API_URL,
    JWT_SECRET_LENGTH: result.NEXT_PUBLIC_JWT_SECRET?.length,
    CSRF_SECRET_LENGTH: result.CSRF_SECRET?.length,
  });
} catch (error) {
  console.log('❌ Validation failed!');
  console.log('Error details:', error.issues || error);

  // Show specific validation issues
  if (error.issues) {
    console.log('\n🔴 Specific issues:');
    error.issues.forEach(issue => {
      console.log(`  ${issue.path.join('.')}: ${issue.message}`);
    });
  }
}