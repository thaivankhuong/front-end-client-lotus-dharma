#!/usr/bin/env node

/**
 * Simple test to verify environment loading works
 */

console.log('🧪 Testing environment loading...\n');

// Simulate environment loading like in Next.js
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_APP_NAME = 'LotusDharma';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';

// Load from .env.local (simulate)
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');

  // Parse .env.local content
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
        process.env[key] = value;
      }
    }
  });

  console.log('✅ Environment loaded from .env.local');

  // Check required variables
  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
  const csrfSecret = process.env.CSRF_SECRET;

  console.log(`JWT_SECRET: ${jwtSecret ? jwtSecret.length + ' chars' : 'MISSING'}`);
  console.log(`CSRF_SECRET: ${csrfSecret ? csrfSecret.length + ' chars' : 'MISSING'}`);

  if (!jwtSecret || jwtSecret.length < 32) {
    console.error('❌ JWT_SECRET invalid or too short');
    process.exit(1);
  }

  if (!csrfSecret || csrfSecret.length < 32) {
    console.error('❌ CSRF_SECRET invalid or too short');
    process.exit(1);
  }

  console.log('✅ All required environment variables valid');

  // Test Zod validation
  const { z } = require('zod');

  const envSchema = z.object({
    NEXT_PUBLIC_JWT_SECRET: z.string().min(32),
    CSRF_SECRET: z.string().min(32),
    NEXT_PUBLIC_API_URL: z.string().url(),
  });

  const result = envSchema.parse({
    NEXT_PUBLIC_JWT_SECRET: jwtSecret,
    CSRF_SECRET: csrfSecret,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  console.log('✅ Zod validation passed');
  console.log('🎉 Environment setup is working!');

} catch (error) {
  console.error('❌ Environment loading failed:', error.message);
  process.exit(1);
}