import { NextRequest, NextResponse } from 'next/server';
import { handleLogin } from '@/lib/api/auth';

/**
 * BFF Route Handler: User Login
 * POST /api/auth/login
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "rememberMe": false
 * }
 *
 * Response:
 * {
 *   "accessToken": "eyJ...",
 *   "tokenType": "Bearer",
 *   "expiresIn": 900,
 *   "user": { ... }
 * }
 */
export async function POST(request: NextRequest) {
  return handleLogin(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}