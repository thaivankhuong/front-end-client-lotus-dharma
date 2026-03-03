import { NextRequest, NextResponse } from 'next/server';
import { dataApi } from '@/lib/api/data';
import { ApiError } from '@/lib/api/utils/error-handling';

/**
 * BFF Route Handler: Get communes data
 * GET /api/data/communes
 *
 * Query parameters:
 * - provinceId: Filter by province
 * - q: Search query
 * - limit: Limit results
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('provinceId');
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let communes;

    if (provinceId) {
      // Get communes by province
      communes = await dataApi.getCommunesByProvince(provinceId);
    } else if (query) {
      // Search communes
      communes = await dataApi.searchCommunes(query, limit);
    } else {
      // This would require a getAllCommunes method if needed
      // For now, return empty array or implement pagination
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          pageSize: 0,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
        }
      });
    }

    // Return paginated response format for consistency
    const response = {
      data: communes,
      pagination: {
        page: 1,
        pageSize: communes.length,
        totalPages: 1,
        totalItems: communes.length,
        hasNext: false,
        hasPrev: false,
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });

  } catch (error) {
    console.error('[API] Error fetching communes:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          }
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}