import { NextRequest, NextResponse } from 'next/server';
import { handleLogout } from '@/lib/api/auth';

/**
 * BFF Route Handler: User Logout
 * POST /api/auth/logout
 *
 * Response:
 * {
 *   "success": true
 * }
 */
export async function POST(request: NextRequest) {
  return handleLogout(request);
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