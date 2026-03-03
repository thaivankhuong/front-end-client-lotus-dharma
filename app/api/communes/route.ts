import { NextRequest, NextResponse } from 'next/server';

// Proxy to backend API
export async function GET(request: NextRequest) {
  console.log('🚀 [API PROXY] Received request to /api/communes');

  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('ProvinceId');
  const includeGeometry = searchParams.get('IncludeGeometry');

  try {

    if (!provinceId) {
      console.log('⚠️ [API PROXY] Missing ProvinceId parameter');
      return NextResponse.json(
        { error: 'ProvinceId parameter is required' },
        { status: 400 }
      );
    }

    const backendUrl = `http://localhost:5000/api/communes?ProvinceId=${provinceId}${includeGeometry ? '&IncludeGeometry=true' : ''}`;

    console.log('📡 [API PROXY] Forwarding communes request to backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📥 [API PROXY] Backend communes response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Proxy] Backend error:', errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[API Proxy] Success, data length:', Array.isArray(data) ? data.length : 'not array');

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });

  } catch (error) {
    console.error('[API Proxy] Error fetching communes:', error);
    return NextResponse.json(
      { error: { code: 'BACKEND_UNAVAILABLE', message: 'Backend API is currently unavailable.' } },
      { status: 503 }
    );
  }
}

// Mock data cho communes của toàn bộ Việt Nam (fallback)
const mockCommunes = [
  // Hà Nội
  {
    communeId: "00101",
    name: "Phúc Xá",
    nameNew: "Phúc Xá",
    provinceId: "01",
    type: "Xã",
    areaKm2: 10.5,
    population: 15000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[105.8, 21.0], [105.85, 21.0], [105.85, 21.05], [105.8, 21.05], [105.8, 21.0]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "00102",
    name: "Phúc Tân",
    nameNew: "Phúc Tân",
    provinceId: "01",
    type: "Xã",
    areaKm2: 12.3,
    population: 18000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[105.82, 21.02], [105.87, 21.02], [105.87, 21.07], [105.82, 21.07], [105.82, 21.02]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "00103",
    name: "Hoàng Liệt",
    nameNew: "Hoàng Liệt",
    provinceId: "01",
    type: "Phường",
    areaKm2: 8.2,
    population: 22000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[105.84, 21.04], [105.89, 21.04], [105.89, 21.09], [105.84, 21.09], [105.84, 21.04]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },

  // Hồ Chí Minh
  {
    communeId: "00201",
    name: "Phường 1",
    nameNew: "Phường 1",
    provinceId: "02",
    type: "Phường",
    areaKm2: 1.8,
    population: 25000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.69, 10.77], [106.71, 10.77], [106.71, 10.79], [106.69, 10.79], [106.69, 10.77]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "00202",
    name: "Phường 2",
    nameNew: "Phường 2",
    provinceId: "02",
    type: "Phường",
    areaKm2: 2.1,
    population: 28000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.71, 10.77], [106.73, 10.77], [106.73, 10.79], [106.71, 10.79], [106.71, 10.77]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "00203",
    name: "Phường 3",
    nameNew: "Phường 3",
    provinceId: "02",
    type: "Phường",
    areaKm2: 1.9,
    population: 23000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.67, 10.75], [106.69, 10.75], [106.69, 10.77], [106.67, 10.77], [106.67, 10.75]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },

  // Hải Phòng
  {
    communeId: "00301",
    name: "Hồng Bàng",
    nameNew: "Hồng Bàng",
    provinceId: "03",
    type: "Quận",
    areaKm2: 15.2,
    population: 85000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.65, 20.85], [106.7, 20.85], [106.7, 20.9], [106.65, 20.9], [106.65, 20.85]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "00302",
    name: "Ngô Quyền",
    nameNew: "Ngô Quyền",
    provinceId: "03",
    type: "Quận",
    areaKm2: 12.8,
    population: 92000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.68, 20.85], [106.73, 20.85], [106.73, 20.9], [106.68, 20.9], [106.68, 20.85]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },

  // Bắc Giang
  {
    communeId: "00401",
    name: "Bắc Giang",
    nameNew: "Bắc Giang",
    provinceId: "04",
    type: "Thành phố",
    areaKm2: 45.6,
    population: 150000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.18, 21.25], [106.25, 21.25], [106.25, 21.32], [106.18, 21.32], [106.18, 21.25]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "00402",
    name: "Hiệp Hòa",
    nameNew: "Hiệp Hòa",
    provinceId: "04",
    type: "Huyện",
    areaKm2: 89.2,
    population: 120000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[105.95, 21.15], [106.15, 21.15], [106.15, 21.35], [105.95, 21.35], [105.95, 21.15]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },

  // Đà Nẵng
  {
    communeId: "03101",
    name: "Hải Châu",
    nameNew: "Hải Châu",
    provinceId: "31",
    type: "Quận",
    areaKm2: 23.5,
    population: 220000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[108.18, 16.04], [108.25, 16.04], [108.25, 16.08], [108.18, 16.08], [108.18, 16.04]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "03102",
    name: "Thanh Khê",
    nameNew: "Thanh Khê",
    provinceId: "31",
    type: "Quận",
    areaKm2: 9.1,
    population: 180000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[108.16, 16.06], [108.2, 16.06], [108.2, 16.1], [108.16, 16.1], [108.16, 16.06]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },

  // Đồng Nai
  {
    communeId: "04801",
    name: "Biên Hòa",
    nameNew: "Biên Hòa",
    provinceId: "48",
    type: "Thành phố",
    areaKm2: 78.2,
    population: 800000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.8, 10.9], [107.0, 10.9], [107.0, 11.1], [106.8, 11.1], [106.8, 10.9]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "04802",
    name: "Long Thành",
    nameNew: "Long Thành",
    provinceId: "48",
    type: "Huyện",
    areaKm2: 192.5,
    population: 250000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[106.9, 10.7], [107.2, 10.7], [107.2, 10.95], [106.9, 10.95], [106.9, 10.7]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },

  // Cần Thơ
  {
    communeId: "05601",
    name: "Ninh Kiều",
    nameNew: "Ninh Kiều",
    provinceId: "56",
    type: "Quận",
    areaKm2: 29.2,
    population: 300000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[105.7, 10.02], [105.78, 10.02], [105.78, 10.08], [105.7, 10.08], [105.7, 10.02]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    communeId: "05602",
    name: "Cái Răng",
    nameNew: "Cái Răng",
    provinceId: "56",
    type: "Quận",
    areaKm2: 25.1,
    population: 220000,
    geometry: {
      "type": "Polygon",
      "coordinates": [[[105.75, 10.0], [105.82, 10.0], [105.82, 10.04], [105.75, 10.04], [105.75, 10.0]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  }
];



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
