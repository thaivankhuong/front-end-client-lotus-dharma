import { NextRequest, NextResponse } from 'next/server';
import { handleGetCurrentUser } from '@/lib/api/auth';

/**
 * BFF Route Handler: Get Current User
 * GET /api/auth/me
 *
 * Response:
 * {
 *   "id": "user-id",
 *   "email": "user@example.com",
 *   "username": "username",
 *   "displayName": "Display Name",
 *   "avatar": "https://...",
 *   "roles": ["user"],
 *   "preferences": { ... },
 *   "createdAt": "2024-01-01T00:00:00Z",
 *   "updatedAt": "2024-01-01T00:00:00Z"
 * }
 */
export async function GET(request: NextRequest) {
  return handleGetCurrentUser(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}