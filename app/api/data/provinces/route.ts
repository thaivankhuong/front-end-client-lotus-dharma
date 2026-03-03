import { NextRequest, NextResponse } from 'next/server';
import { dataApi } from '@/lib/api/data';
import { ApiError } from '@/lib/api/utils/error-handling';

/**
 * BFF Route Handler: Get provinces data
 * GET /api/data/provinces
 *
 * Query parameters:
 * - region: Filter by region
 * - q: Search query
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const query = searchParams.get('q');

    // Get all provinces
    const provinces = await dataApi.getProvinces();

    // Apply filters
    let filteredProvinces = provinces;

    if (region) {
      filteredProvinces = provinces.filter(p => p.region === region);
    }

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProvinces = provinces.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(searchTerm))
      );
    }

    // Return paginated response format for consistency
    const response = {
      data: filteredProvinces,
      pagination: {
        page: 1,
        pageSize: filteredProvinces.length,
        totalPages: 1,
        totalItems: filteredProvinces.length,
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
    console.error('[API] Error fetching provinces:', error);

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

/**
 * BFF Route Handler: Get single province
 * GET /api/data/provinces/[id]
 */
export async function generateStaticParams() {
  // In a real app, you might pre-generate static params for provinces
  // For now, we'll handle this dynamically
  return [];
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