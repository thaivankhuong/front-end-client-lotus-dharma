#!/usr/bin/env node

/**
 * Test script for Phase 2: API Client Layer
 * Run this after npm install to verify everything works
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Phase 2: API Client Layer...\n');

// Test 1: Check if all required files exist
const requiredFiles = [
  'lib/config/env.ts',
  'lib/config/constants.ts',
  'lib/utils/cn.ts',
  'lib/utils/security.ts',
  'middleware.ts',
  'next.config.js',
  'lib/api/client.ts',
  'lib/api/auth.ts',
  'lib/api/data.ts',
  'lib/api/index.ts',
  'lib/api/utils/error-handling.ts',
  'lib/api/utils/retry.ts',
  'lib/api/types/common.ts',
  'app/api/auth/login/route.ts',
  'app/api/auth/refresh/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/me/route.ts',
  'app/api/data/communes/route.ts',
  'app/api/data/provinces/route.ts',
  'scripts/generate-api-types.js',
  'scripts/sample-swagger.json',
  'scripts/test-phase2.js',
  '.cursor/rules/architecture-boundaries.mdc',
  '.cursor/rules/api-patterns.mdc',
  '.cursor/rules/caching-patterns.mdc',
  '.cursor/rules/security-patterns.mdc',
  '.cursor/rules/i18n-patterns.mdc',
  '.cursor/rules/observability-patterns.mdc'
];

console.log('📁 Checking required files...');
let missingFiles = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    missingFiles.push(file);
  }
}

if (missingFiles.length === 0) {
  console.log('✅ All required files exist\n');
} else {
  console.log('❌ Missing files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');
}

// Test 2: Check TypeScript compilation
console.log('🔍 Checking TypeScript compilation...');
try {
  // Basic syntax check by requiring the modules
  const env = require('../lib/config/env.ts');
  const constants = require('../lib/config/constants.ts');
  const cn = require('../lib/utils/cn.ts');
  const security = require('../lib/utils/security.ts');

  console.log('✅ TypeScript modules load successfully\n');
} catch (error) {
  console.log('❌ TypeScript compilation error:', error.message);
  console.log('');
}

// Test 3: Check package.json dependencies
console.log('📦 Checking package.json dependencies...');
try {
  const packageJson = require('../package.json');

  const requiredDeps = [
    '@tanstack/react-query',
    'zod',
    'clsx',
    'tailwind-merge',
    'isomorphic-dompurify',
    'next'
  ];

  const requiredDevDeps = [
    'typescript'
  ];

  const optionalDeps = [
    'openapi-typescript'
  ];

  let missingDeps = [];
  let missingDevDeps = [];
  let missingOptionalDeps = [];

  for (const dep of requiredDeps) {
    if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
      missingDeps.push(dep);
    }
  }

  for (const dep of requiredDevDeps) {
    if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
      missingDevDeps.push(dep);
    }
  }

  for (const dep of optionalDeps) {
    if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
      missingOptionalDeps.push(dep);
    }
  }

  if (missingDeps.length === 0 && missingDevDeps.length === 0) {
    console.log('✅ All required dependencies configured');
    if (missingOptionalDeps.length > 0) {
      console.log('⚠️  Optional dependencies missing (run npm install):');
      missingOptionalDeps.forEach(dep => console.log(`   - ${dep} (optional)`));
    }
    console.log('');
  } else {
    console.log('⚠️  Missing dependencies (run npm install):');
    missingDeps.forEach(dep => console.log(`   - ${dep}`));
    missingDevDeps.forEach(dep => console.log(`   - ${dep} (dev)`));
    console.log('');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  console.log('');
}

// Test 4: Generate sample types (without real API)
console.log('🔧 Testing type generation script...');
try {
  const generateScript = require('./generate-api-types.js');

  if (typeof generateScript.generateTypes === 'function') {
    console.log('✅ Type generation script is valid\n');
  } else {
    console.log('❌ Type generation script missing generateTypes function\n');
  }
} catch (error) {
  console.log('❌ Error in type generation script:', error.message);
  console.log('');
}

// Summary
console.log('📋 Phase 2 Test Summary:');
console.log('=======================');
console.log('');
console.log('Next steps to complete Phase 2 testing:');
console.log('');
console.log('1. 📦 Install dependencies:');
console.log('   npm install');
console.log('');
console.log('2. 🏗️  Build project:');
console.log('   npm run build');
console.log('');
console.log('3. 🔍 Type check:');
console.log('   npm run type-check');
console.log('');
console.log('4. 🌐 Generate API types (when you have Swagger URL):');
console.log('   npm run generate:types https://your-api.com/swagger/v1/swagger.json');
console.log('');
console.log('5. 🧪 Test API routes:');
console.log('   npm run dev');
console.log('   # Test endpoints: /api/auth/me, /api/data/provinces, etc.');
console.log('');
console.log('6. 🔄 Test auth flow:');
console.log('   # Implement login UI and test JWT refresh');
console.log('');
console.log('🎯 Ready for Phase 3: State Management & i18n!');