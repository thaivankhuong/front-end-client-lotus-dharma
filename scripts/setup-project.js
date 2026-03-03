#!/usr/bin/env node

/**
 * Setup script for LotusDharma Phase 2
 * Cleans and installs dependencies properly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up LotusDharma Phase 2...\n');

// Step 1: Clean everything
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Removed .next folder');
  }

  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
    console.log('✅ Removed node_modules');
  }

  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('✅ Removed package-lock.json');
  }
} catch (error) {
  console.warn('⚠️  Clean step had issues:', error.message);
}

// Step 2: Fresh install
console.log('\n📦 Installing dependencies...');
try {
  // Try with legacy peer deps first (common for complex dependency trees)
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Dependency installation failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Try manual install: npm install --legacy-peer-deps --force');
  console.log('2. Check Node.js version:', process.version);
  console.log('3. Clear npm cache: npm cache clean --force');
  console.log('4. Check TROUBLESHOOTING.md for detailed solutions');
  process.exit(1);
}

// Step 3: Type check
console.log('\n🔍 Running TypeScript check...');
try {
  execSync('npm run type-check', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.error('❌ TypeScript check failed');
  console.log('Run "npm run type-check" manually to see detailed errors');
}

// Step 4: Generate sample types
console.log('\n🔧 Generating sample API types...');
try {
  execSync('npm run generate:types:test', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Sample API types generated');
} catch (error) {
  console.error('❌ Type generation failed');
  console.log('Run "npm run generate:types:test" manually');
}

// Step 5: Test Phase 2
console.log('\n🧪 Running Phase 2 tests...');
try {
  execSync('npm run test:phase2', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Phase 2 tests passed');
} catch (error) {
  console.error('❌ Phase 2 tests failed');
  console.log('Run "npm run test:phase2" manually');
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('1. npm run dev - Start development server');
console.log('2. Visit http://localhost:3001/api/data/provinces - Test API');
console.log('3. Run "npm run build" - Test production build');
console.log('\n🚀 Ready for Phase 3: State Management & i18n!');