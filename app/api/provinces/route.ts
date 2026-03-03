import { NextRequest, NextResponse } from 'next/server';

// Proxy to backend API
export async function GET(request: NextRequest) {
  console.log('🚀 [API PROXY] Received request to /api/provinces');

  try {
    const { searchParams } = new URL(request.url);
    const includeGeometry = searchParams.get('IncludeGeometry');

    const backendUrl = `http://localhost:5000/api/provinces${includeGeometry ? '?IncludeGeometry=true' : ''}`;

    console.log('📡 [API PROXY] Forwarding to backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📥 [API PROXY] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Proxy] Backend error:', errorText);
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ [API PROXY] Success, data length:', Array.isArray(data) ? data.length : 'not array');

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('❌ [API PROXY] Error fetching provinces:', error);
    return NextResponse.json(
      { error: { code: 'BACKEND_UNAVAILABLE', message: 'Backend API is currently unavailable.' } },
      { status: 503 }
    );
  }
}

// Mock data cho toàn bộ 34 tỉnh/thành phố Việt Nam (fallback)
const mockProvinces = [
  {
    provinceId: "01",
    name: "Hà Nội",
    nameNew: "Hà Nội",
    administrativeCenter: "Ba Đình",
    areaKm2: 3358.6,
    population: 8246540,
    longitude: 105.8342,
    latitude: 21.0285,
    beforeMerger: "",
    administrativeUnits: "Thủ đô",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.7, 20.8], [105.9, 20.8], [105.9, 21.2], [105.7, 21.2], [105.7, 20.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "02",
    name: "Hồ Chí Minh",
    nameNew: "Hồ Chí Minh",
    administrativeCenter: "Quận 1",
    areaKm2: 2061.0,
    population: 9038933,
    longitude: 106.6297,
    latitude: 10.8231,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.5, 10.7], [106.8, 10.7], [106.8, 10.9], [106.5, 10.9], [106.5, 10.7]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "03",
    name: "Hải Phòng",
    nameNew: "Hải Phòng",
    administrativeCenter: "Hồng Bàng",
    areaKm2: 1523.9,
    population: 2026466,
    longitude: 106.6881,
    latitude: 20.8449,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.6, 20.7], [106.8, 20.7], [106.8, 21.0], [106.6, 21.0], [106.6, 20.7]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "04",
    name: "Bắc Giang",
    nameNew: "Bắc Giang",
    administrativeCenter: "Bắc Giang",
    areaKm2: 3826.5,
    population: 1800698,
    longitude: 106.1947,
    latitude: 21.2731,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.9, 21.0], [106.4, 21.0], [106.4, 21.5], [105.9, 21.5], [105.9, 21.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "05",
    name: "Hà Giang",
    nameNew: "Hà Giang",
    administrativeCenter: "Hà Giang",
    areaKm2: 7929.5,
    population: 858088,
    longitude: 104.9836,
    latitude: 22.8026,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.5, 22.2], [105.5, 22.2], [105.5, 23.4], [104.5, 23.4], [104.5, 22.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "06",
    name: "Cao Bằng",
    nameNew: "Cao Bằng",
    administrativeCenter: "Cao Bằng",
    areaKm2: 6700.3,
    population: 530341,
    longitude: 106.6003,
    latitude: 22.6652,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 22.1], [107.4, 22.1], [107.4, 23.2], [105.8, 23.2], [105.8, 22.1]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "07",
    name: "Lai Châu",
    nameNew: "Lai Châu",
    administrativeCenter: "Lai Châu",
    areaKm2: 9068.8,
    population: 460196,
    longitude: 103.4453,
    latitude: 22.3862,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[102.5, 21.8], [104.4, 21.8], [104.4, 22.9], [102.5, 22.9], [102.5, 21.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "08",
    name: "Lào Cai",
    nameNew: "Lào Cai",
    administrativeCenter: "Lào Cai",
    areaKm2: 6364.0,
    population: 730420,
    longitude: 104.1487,
    latitude: 22.3381,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[103.7, 21.8], [104.6, 21.8], [104.6, 23.0], [103.7, 23.0], [103.7, 21.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "09",
    name: "Tuyên Quang",
    nameNew: "Tuyên Quang",
    administrativeCenter: "Tuyên Quang",
    areaKm2: 5867.9,
    population: 786268,
    longitude: 105.2188,
    latitude: 21.8236,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.8, 21.4], [105.6, 21.4], [105.6, 22.2], [104.8, 22.2], [104.8, 21.4]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "10",
    name: "Lạng Sơn",
    nameNew: "Lạng Sơn",
    administrativeCenter: "Lạng Sơn",
    areaKm2: 8310.1,
    population: 781655,
    longitude: 106.7579,
    latitude: 21.8537,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.2, 21.2], [107.3, 21.2], [107.3, 22.5], [106.2, 22.5], [106.2, 21.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "11",
    name: "Bắc Kạn",
    nameNew: "Bắc Kạn",
    administrativeCenter: "Bắc Kạn",
    areaKm2: 4859.4,
    population: 313905,
    longitude: 105.8309,
    latitude: 22.1470,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.4, 21.8], [106.3, 21.8], [106.3, 22.5], [105.4, 22.5], [105.4, 21.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "12",
    name: "Thái Nguyên",
    nameNew: "Thái Nguyên",
    administrativeCenter: "Thái Nguyên",
    areaKm2: 3526.6,
    population: 1290517,
    longitude: 105.8482,
    latitude: 21.5672,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.4, 21.2], [106.3, 21.2], [106.3, 21.9], [105.4, 21.9], [105.4, 21.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "13",
    name: "Yên Bái",
    nameNew: "Yên Bái",
    administrativeCenter: "Yên Bái",
    areaKm2: 6886.3,
    population: 823073,
    longitude: 104.9119,
    latitude: 21.7168,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.2, 21.0], [105.8, 21.0], [105.8, 22.2], [104.2, 22.2], [104.2, 21.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "14",
    name: "Sơn La",
    nameNew: "Sơn La",
    administrativeCenter: "Sơn La",
    areaKm2: 14123.5,
    population: 1253643,
    longitude: 103.9188,
    latitude: 21.3266,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[103.0, 20.5], [105.0, 20.5], [105.0, 22.2], [103.0, 22.2], [103.0, 20.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "15",
    name: "Phú Thọ",
    nameNew: "Phú Thọ",
    administrativeCenter: "Việt Trì",
    areaKm2: 3534.6,
    population: 1463834,
    longitude: 105.2364,
    latitude: 21.3309,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.8, 20.9], [105.6, 20.9], [105.6, 21.7], [104.8, 21.7], [104.8, 20.9]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "16",
    name: "Vĩnh Phúc",
    nameNew: "Vĩnh Phúc",
    administrativeCenter: "Vĩnh Yên",
    areaKm2: 1235.9,
    population: 1153562,
    longitude: 105.6049,
    latitude: 21.3089,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.3, 21.0], [106.0, 21.0], [106.0, 21.6], [105.3, 21.6], [105.3, 21.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "17",
    name: "Quảng Ninh",
    nameNew: "Quảng Ninh",
    administrativeCenter: "Hạ Long",
    areaKm2: 6178.2,
    population: 1324051,
    longitude: 107.2920,
    latitude: 21.0064,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.8, 20.6], [108.0, 20.6], [108.0, 21.6], [106.8, 21.6], [106.8, 20.6]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "18",
    name: "Bắc Ninh",
    nameNew: "Bắc Ninh",
    administrativeCenter: "Bắc Ninh",
    areaKm2: 822.7,
    population: 1378413,
    longitude: 106.0503,
    latitude: 21.1861,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.9, 20.9], [106.2, 20.9], [106.2, 21.4], [105.9, 21.4], [105.9, 20.9]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "19",
    name: "Hải Dương",
    nameNew: "Hải Dương",
    administrativeCenter: "Hải Dương",
    areaKm2: 1668.2,
    population: 1897076,
    longitude: 106.3206,
    latitude: 20.9373,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.0, 20.7], [106.6, 20.7], [106.6, 21.2], [106.0, 21.2], [106.0, 20.7]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "20",
    name: "Hưng Yên",
    nameNew: "Hưng Yên",
    administrativeCenter: "Hưng Yên",
    areaKm2: 926.4,
    population: 1257166,
    longitude: 106.0513,
    latitude: 20.6464,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 20.5], [106.3, 20.5], [106.3, 20.9], [105.8, 20.9], [105.8, 20.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "21",
    name: "Thái Bình",
    nameNew: "Thái Bình",
    administrativeCenter: "Thái Bình",
    areaKm2: 1570.2,
    population: 1862190,
    longitude: 106.3441,
    latitude: 20.4463,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.1, 20.2], [106.6, 20.2], [106.6, 20.7], [106.1, 20.7], [106.1, 20.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "22",
    name: "Hà Nam",
    nameNew: "Hà Nam",
    administrativeCenter: "Phủ Lý",
    areaKm2: 861.9,
    population: 854131,
    longitude: 105.9038,
    latitude: 20.5835,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.7, 20.3], [106.1, 20.3], [106.1, 20.8], [105.7, 20.8], [105.7, 20.3]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "23",
    name: "Nam Định",
    nameNew: "Nam Định",
    administrativeCenter: "Nam Định",
    areaKm2: 1650.2,
    population: 1780391,
    longitude: 106.1621,
    latitude: 20.4194,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.9, 19.9], [106.4, 19.9], [106.4, 20.6], [105.9, 20.6], [105.9, 19.9]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "24",
    name: "Ninh Bình",
    nameNew: "Ninh Bình",
    administrativeCenter: "Ninh Bình",
    areaKm2: 1386.8,
    population: 984662,
    longitude: 105.9742,
    latitude: 20.2506,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.6, 19.8], [106.4, 19.8], [106.4, 20.6], [105.6, 20.6], [105.6, 19.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "25",
    name: "Thanh Hóa",
    nameNew: "Thanh Hóa",
    administrativeCenter: "Thanh Hóa",
    areaKm2: 11114.7,
    population: 3664948,
    longitude: 105.4672,
    latitude: 19.8067,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.5, 19.0], [106.5, 19.0], [106.5, 21.0], [104.5, 21.0], [104.5, 19.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "26",
    name: "Nghệ An",
    nameNew: "Nghệ An",
    administrativeCenter: "Vinh",
    areaKm2: 16481.4,
    population: 3337156,
    longitude: 104.4198,
    latitude: 19.2342,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.0, 18.2], [106.0, 18.2], [106.0, 20.0], [104.0, 20.0], [104.0, 18.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "27",
    name: "Hà Tĩnh",
    nameNew: "Hà Tĩnh",
    administrativeCenter: "Hà Tĩnh",
    areaKm2: 5990.7,
    population: 1291472,
    longitude: 105.9519,
    latitude: 18.3428,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.4, 17.8], [106.5, 17.8], [106.5, 18.8], [105.4, 18.8], [105.4, 17.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "28",
    name: "Quảng Bình",
    nameNew: "Quảng Bình",
    administrativeCenter: "Đồng Hới",
    areaKm2: 8065.3,
    population: 896876,
    longitude: 106.5991,
    latitude: 17.5100,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 17.0], [107.4, 17.0], [107.4, 18.2], [105.8, 18.2], [105.8, 17.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "29",
    name: "Quảng Trị",
    nameNew: "Quảng Trị",
    administrativeCenter: "Đông Hà",
    areaKm2: 4739.8,
    population: 623909,
    longitude: 107.1000,
    latitude: 16.8163,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.6, 16.4], [107.6, 16.4], [107.6, 17.2], [106.6, 17.2], [106.6, 16.4]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "30",
    name: "Thừa Thiên Huế",
    nameNew: "Thừa Thiên Huế",
    administrativeCenter: "Huế",
    areaKm2: 5026.5,
    population: 1126628,
    longitude: 107.5955,
    latitude: 16.4637,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.0, 16.0], [108.2, 16.0], [108.2, 16.8], [107.0, 16.8], [107.0, 16.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "31",
    name: "Đà Nẵng",
    nameNew: "Đà Nẵng",
    administrativeCenter: "Hải Châu",
    areaKm2: 1284.9,
    population: 1191381,
    longitude: 108.2022,
    latitude: 16.0544,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[108.0, 15.9], [108.4, 15.9], [108.4, 16.2], [108.0, 16.2], [108.0, 15.9]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "32",
    name: "Quảng Nam",
    nameNew: "Quảng Nam",
    administrativeCenter: "Tam Kỳ",
    areaKm2: 10438.4,
    population: 1495153,
    longitude: 108.2897,
    latitude: 15.5394,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.5, 14.8], [109.2, 14.8], [109.2, 16.2], [107.5, 16.2], [107.5, 14.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "33",
    name: "Quảng Ngãi",
    nameNew: "Quảng Ngãi",
    administrativeCenter: "Quảng Ngãi",
    areaKm2: 5155.8,
    population: 1231927,
    longitude: 108.7927,
    latitude: 14.9650,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[108.2, 14.2], [109.4, 14.2], [109.4, 15.7], [108.2, 15.7], [108.2, 14.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "34",
    name: "Bình Định",
    nameNew: "Bình Định",
    administrativeCenter: "Quy Nhơn",
    areaKm2: 6066.2,
    population: 1486589,
    longitude: 109.0929,
    latitude: 13.7824,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[108.5, 12.8], [110.0, 12.8], [110.0, 14.6], [108.5, 14.6], [108.5, 12.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "35",
    name: "Phú Yên",
    nameNew: "Phú Yên",
    administrativeCenter: "Tuy Hòa",
    areaKm2: 5060.6,
    population: 962977,
    longitude: 109.0929,
    latitude: 13.0882,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[108.7, 12.5], [109.5, 12.5], [109.5, 13.7], [108.7, 13.7], [108.7, 12.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "36",
    name: "Khánh Hòa",
    nameNew: "Khánh Hòa",
    administrativeCenter: "Nha Trang",
    areaKm2: 5137.8,
    population: 1232056,
    longitude: 109.1920,
    latitude: 12.2388,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[108.7, 11.5], [109.7, 11.5], [109.7, 13.0], [108.7, 13.0], [108.7, 11.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "37",
    name: "Ninh Thuận",
    nameNew: "Ninh Thuận",
    administrativeCenter: "Phan Rang-Tháp Chàm",
    areaKm2: 3355.3,
    population: 591658,
    longitude: 108.8620,
    latitude: 11.5643,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[108.0, 10.8], [109.7, 10.8], [109.7, 12.0], [108.0, 12.0], [108.0, 10.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "38",
    name: "Bình Thuận",
    nameNew: "Bình Thuận",
    administrativeCenter: "Phan Thiết",
    areaKm2: 7812.8,
    population: 1232557,
    longitude: 108.2022,
    latitude: 10.9309,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.0, 10.2], [109.0, 10.2], [109.0, 11.8], [107.0, 11.8], [107.0, 10.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "39",
    name: "Kon Tum",
    nameNew: "Kon Tum",
    administrativeCenter: "Kon Tum",
    areaKm2: 9674.2,
    population: 543374,
    longitude: 108.0007,
    latitude: 14.3546,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.0, 13.5], [109.0, 13.5], [109.0, 15.0], [107.0, 15.0], [107.0, 13.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "40",
    name: "Gia Lai",
    nameNew: "Gia Lai",
    administrativeCenter: "Pleiku",
    areaKm2: 15536.9,
    population: 1520249,
    longitude: 108.2022,
    latitude: 13.9715,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.0, 12.5], [110.0, 12.5], [110.0, 15.0], [107.0, 15.0], [107.0, 12.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "41",
    name: "Đắk Lắk",
    nameNew: "Đắk Lắk",
    administrativeCenter: "Buôn Ma Thuột",
    areaKm2: 13030.5,
    population: 1875396,
    longitude: 108.2022,
    latitude: 12.6662,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.0, 11.8], [110.0, 11.8], [110.0, 13.8], [107.0, 13.8], [107.0, 11.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "42",
    name: "Đắk Nông",
    nameNew: "Đắk Nông",
    administrativeCenter: "Gia Nghĩa",
    areaKm2: 6515.6,
    population: 625396,
    longitude: 107.6098,
    latitude: 12.2646,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.0, 11.8], [108.5, 11.8], [108.5, 13.0], [107.0, 13.0], [107.0, 11.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "43",
    name: "Lâm Đồng",
    nameNew: "Lâm Đồng",
    administrativeCenter: "Đà Lạt",
    areaKm2: 9773.5,
    population: 1294496,
    longitude: 108.4420,
    latitude: 11.9404,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[107.5, 10.8], [109.5, 10.8], [109.5, 12.5], [107.5, 12.5], [107.5, 10.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "44",
    name: "Bình Phước",
    nameNew: "Bình Phước",
    administrativeCenter: "Đồng Xoài",
    areaKm2: 6876.8,
    population: 994679,
    longitude: 106.7460,
    latitude: 11.7511,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.0, 11.0], [108.0, 11.0], [108.0, 12.5], [106.0, 12.5], [106.0, 11.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "45",
    name: "Tây Ninh",
    nameNew: "Tây Ninh",
    administrativeCenter: "Tây Ninh",
    areaKm2: 4041.3,
    population: 1171146,
    longitude: 106.1693,
    latitude: 11.3100,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 10.8], [106.5, 10.8], [106.5, 11.8], [105.8, 11.8], [105.8, 10.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "46",
    name: "Bình Dương",
    nameNew: "Bình Dương",
    administrativeCenter: "Thủ Dầu Một",
    areaKm2: 2694.6,
    population: 2451202,
    longitude: 106.6667,
    latitude: 11.1667,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.4, 10.8], [106.9, 10.8], [106.9, 11.5], [106.4, 11.5], [106.4, 10.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "47",
    name: "Đồng Nai",
    nameNew: "Đồng Nai",
    administrativeCenter: "Biên Hòa",
    areaKm2: 5863.6,
    population: 3115057,
    longitude: 106.9758,
    latitude: 10.9680,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.5, 10.5], [107.5, 10.5], [107.5, 11.5], [106.5, 11.5], [106.5, 10.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "48",
    name: "Long An",
    nameNew: "Long An",
    administrativeCenter: "Tân An",
    areaKm2: 4494.8,
    population: 1698287,
    longitude: 106.1406,
    latitude: 10.5333,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 10.2], [106.5, 10.2], [106.5, 11.0], [105.8, 11.0], [105.8, 10.2]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "49",
    name: "Tiền Giang",
    nameNew: "Tiền Giang",
    administrativeCenter: "Mỹ Tho",
    areaKm2: 2510.6,
    population: 1768174,
    longitude: 106.3428,
    latitude: 10.3603,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 10.0], [106.8, 10.0], [106.8, 10.8], [105.8, 10.8], [105.8, 10.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "50",
    name: "Bến Tre",
    nameNew: "Bến Tre",
    administrativeCenter: "Bến Tre",
    areaKm2: 2394.8,
    population: 1289163,
    longitude: 106.3756,
    latitude: 10.2357,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[106.0, 9.8], [106.8, 9.8], [106.8, 10.6], [106.0, 10.6], [106.0, 9.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "51",
    name: "Trà Vinh",
    nameNew: "Trà Vinh",
    administrativeCenter: "Trà Vinh",
    areaKm2: 2358.3,
    population: 1009178,
    longitude: 106.3428,
    latitude: 9.9347,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.8, 9.5], [106.8, 9.5], [106.8, 10.3], [105.8, 10.3], [105.8, 9.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "52",
    name: "Vĩnh Long",
    nameNew: "Vĩnh Long",
    administrativeCenter: "Vĩnh Long",
    areaKm2: 1524.2,
    population: 1022797,
    longitude: 105.9722,
    latitude: 10.2537,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.5, 9.8], [106.5, 9.8], [106.5, 10.6], [105.5, 10.6], [105.5, 9.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "53",
    name: "Đồng Tháp",
    nameNew: "Đồng Tháp",
    administrativeCenter: "Cao Lãnh",
    areaKm2: 3383.8,
    population: 1599507,
    longitude: 105.6532,
    latitude: 10.4938,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.0, 10.0], [106.2, 10.0], [106.2, 11.0], [105.0, 11.0], [105.0, 10.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "54",
    name: "An Giang",
    nameNew: "An Giang",
    administrativeCenter: "Long Xuyên",
    areaKm2: 3536.7,
    population: 1908542,
    longitude: 105.1259,
    latitude: 10.5216,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.5, 10.0], [106.0, 10.0], [106.0, 11.0], [104.5, 11.0], [104.5, 10.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "55",
    name: "Kiên Giang",
    nameNew: "Kiên Giang",
    administrativeCenter: "Rạch Giá",
    areaKm2: 6347.7,
    population: 1720534,
    longitude: 105.1398,
    latitude: 10.0125,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[103.8, 8.5], [106.0, 8.5], [106.0, 11.0], [103.8, 11.0], [103.8, 8.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "56",
    name: "Cần Thơ",
    nameNew: "Cần Thơ",
    administrativeCenter: "Ninh Kiều",
    areaKm2: 1439.0,
    population: 1252947,
    longitude: 105.7469,
    latitude: 10.0458,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.5, 9.8], [106.0, 9.8], [106.0, 10.3], [105.5, 10.3], [105.5, 9.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "57",
    name: "Hậu Giang",
    nameNew: "Hậu Giang",
    administrativeCenter: "Vị Thanh",
    areaKm2: 1621.8,
    population: 733017,
    longitude: 105.6110,
    latitude: 9.7850,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.3, 9.5], [106.0, 9.5], [106.0, 10.2], [105.3, 10.2], [105.3, 9.5]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "58",
    name: "Sóc Trăng",
    nameNew: "Sóc Trăng",
    administrativeCenter: "Sóc Trăng",
    areaKm2: 3311.6,
    population: 1199984,
    longitude: 105.9722,
    latitude: 9.6037,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.5, 9.0], [106.5, 9.0], [106.5, 10.0], [105.5, 10.0], [105.5, 9.0]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "59",
    name: "Bạc Liêu",
    nameNew: "Bạc Liêu",
    administrativeCenter: "Bạc Liêu",
    areaKm2: 2669.1,
    population: 907236,
    longitude: 105.7244,
    latitude: 9.2940,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[105.2, 8.8], [106.2, 8.8], [106.2, 9.8], [105.2, 9.8], [105.2, 8.8]]]]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    provinceId: "60",
    name: "Cà Mau",
    nameNew: "Cà Mau",
    administrativeCenter: "Cà Mau",
    areaKm2: 5294.9,
    population: 1194476,
    longitude: 105.1524,
    latitude: 9.1768,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    geometry: {
      "type": "MultiPolygon",
      "coordinates": [[[[104.5, 8.2], [106.0, 8.2], [106.0, 9.5], [104.5, 9.5], [104.5, 8.2]]]]
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