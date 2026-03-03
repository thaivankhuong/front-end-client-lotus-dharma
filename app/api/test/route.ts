import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🧪 [TEST API] Testing backend connection...');

  try {
    const backendUrl = 'http://localhost:5000/api/provinces?IncludeGeometry=true';
    console.log('📡 [TEST API] Attempting to fetch from:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📥 [TEST API] Response status:', response.status);
    console.log('📥 [TEST API] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ [TEST API] Error response:', errorText);
      return NextResponse.json({ error: 'Backend error', status: response.status, message: errorText }, { status: 500 });
    }

    const data = await response.json();
    console.log('✅ [TEST API] Success, data type:', typeof data, 'length:', Array.isArray(data) ? data.length : 'N/A');

    return NextResponse.json({
      success: true,
      dataLength: Array.isArray(data) ? data.length : 'not array',
      firstItem: Array.isArray(data) ? data[0] : data
    });

  } catch (error) {
    console.error('❌ [TEST API] Fetch error:', error);
    return NextResponse.json({
      error: 'Fetch failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}