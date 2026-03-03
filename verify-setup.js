#!/usr/bin/env node

/**
 * Quick verification that LotusDharma Phase 2 setup is working
 * Run: node verify-setup.js
 */

console.log('🔍 Verifying LotusDharma Phase 2 setup...\n');

// Load environment variables from .env.local manually
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    });
  }
} catch (error) {
  // Ignore dotenv errors, will show as missing env vars
}

// Check 1: Environment files
const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: 'Environment file (.env.local)',
    check: () => fs.existsSync('.env.local'),
    message: 'Create .env.local with required secrets'
  },
  {
    name: 'Package dependencies',
    check: () => fs.existsSync('node_modules'),
    message: 'Run: npm install --legacy-peer-deps'
  },
  {
    name: 'Next.js config',
    check: () => fs.existsSync('next.config.js'),
    message: 'next.config.js should exist'
  },
  {
    name: 'TypeScript config',
    check: () => fs.existsSync('tsconfig.json'),
    message: 'tsconfig.json should exist'
  }
];

let allPassed = true;

checks.forEach(({ name, check, message }) => {
  const passed = check();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed) {
    console.log(`   💡 ${message}`);
    allPassed = false;
  }
});

console.log('');

// Check 2: Environment variables
console.log('🔐 Checking environment variables...');

const required = ['NEXT_PUBLIC_JWT_SECRET', 'CSRF_SECRET'];
const optional = ['NEXT_PUBLIC_API_URL', 'NODE_ENV'];

required.forEach(key => {
  const value = process.env[key];
  const valid = value && value.length >= 32;
  console.log(`${valid ? '✅' : '❌'} ${key}: ${value ? `${value.length} chars` : 'missing'}`);
  if (!valid) allPassed = false;
});

optional.forEach(key => {
  const value = process.env[key];
  console.log(`✅ ${key}: ${value || 'default'}`);
});

// Final result
console.log('');
if (allPassed) {
  console.log('🎉 All checks passed! LotusDharma Phase 2 is ready.');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   npm run dev          # Start development server');
  console.log('   npm run type-check   # Verify TypeScript');
  console.log('   npm run test:phase2  # Run comprehensive tests');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
  console.log('');
  console.log('🛠️  Common fixes:');
  console.log('   npm run generate-secrets  # Generate missing secrets');
  console.log('   npm run setup            # Full project setup');
  console.log('   npm run debug-env         # Debug environment issues');
}

console.log('');
console.log('📖 See TROUBLESHOOTING.md for detailed help.');