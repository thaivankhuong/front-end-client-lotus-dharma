// Quick check to see if env vars are loaded
console.log('JWT_SECRET:', process.env.NEXT_PUBLIC_JWT_SECRET ? 'present' : 'missing');
console.log('CSRF_SECRET:', process.env.CSRF_SECRET ? 'present' : 'missing');
console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL || 'default');