#!/usr/bin/env node

/**
 * Generate secure secrets for LotusDharma environment
 * Run: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

// Generate a secure random string
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate JWT secret (32+ chars)
function generateJWTSecret() {
  return generateSecret(32);
}

// Generate CSRF secret (32+ chars)
function generateCSRFSecret() {
  return generateSecret(32);
}

console.log('🔐 Generating secure secrets for LotusDharma...\n');

// Generate secrets
const jwtSecret = generateJWTSecret();
const csrfSecret = generateCSRFSecret();

console.log('✅ Secrets generated successfully!\n');

// Display secrets
console.log('📋 Add these to your .env.local file:');
console.log('=====================================\n');

console.log('# Authentication');
console.log(`NEXT_PUBLIC_JWT_SECRET=${jwtSecret}`);
console.log('');

console.log('# Security');
console.log(`CSRF_SECRET=${csrfSecret}`);
console.log('');

// Instructions
console.log('📝 Instructions:');
console.log('1. Copy the secrets above');
console.log('2. Paste them into your .env.local file');
console.log('3. Keep these secrets secure and never commit them to git');
console.log('4. For production, use different secrets than development');
console.log('');

console.log('🔄 To regenerate secrets, run this script again.');
console.log('🚀 After updating .env.local, run: npm run dev');

// Export for use in other scripts
module.exports = {
  generateJWTSecret,
  generateCSRFSecret,
  generateSecret
};