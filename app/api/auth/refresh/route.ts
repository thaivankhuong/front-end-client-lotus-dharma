import { NextRequest, NextResponse } from 'next/server';
import { handleRefresh } from '@/lib/api/auth';

/**
 * BFF Route Handler: Refresh Access Token
 * POST /api/auth/refresh
 *
 * Refresh token is sent via HttpOnly cookie automatically
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
  return handleRefresh(request);
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