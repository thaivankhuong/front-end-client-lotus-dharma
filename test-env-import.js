// Simple test to verify env import works
try {
  require('dotenv').config({ path: '.env.local' });
  const { env } = require('./lib/config/env.ts');
  console.log('✅ Environment import successful!');
  console.log('API URL:', env.NEXT_PUBLIC_API_URL);
  console.log('JWT Secret length:', env.NEXT_PUBLIC_JWT_SECRET?.length || 0);
  console.log('CSRF Secret length:', env.CSRF_SECRET?.length || 0);
} catch (error) {
  console.error('❌ Environment import failed:', error.message);
  if (error.errors) {
    console.error('Validation errors:', error.errors);
  }
  process.exit(1);
}