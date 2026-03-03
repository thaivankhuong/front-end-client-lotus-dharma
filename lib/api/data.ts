// Mock data for provinces (Vietnamese administrative divisions)
// This is used when backend API is not available
const mockProvinces = [
  {
    id: "01",
    code: "01",
    name: "Hà Nội",
    nameEn: "Ha Noi",
    region: "Đồng bằng sông Hồng",
    population: 8246540,
    area: 3358.6,
    latitude: 21.0285,
    longitude: 105.8342,
    // Map component specific fields
    geometry: null, // Will be set when IncludeGeometry=true
    provinceId: "01",
    nameNew: "Hà Nội",
    administrativeCenter: "Ba Đình",
    areaKm2: 3358.6,
    beforeMerger: "",
    administrativeUnits: "Thủ đô",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "02",
    code: "02",
    name: "Hồ Chí Minh",
    nameEn: "Ho Chi Minh City",
    region: "Đông Nam Bộ",
    population: 9038933,
    area: 2061.0,
    latitude: 10.8231,
    longitude: 106.6297,
    // Map component specific fields
    geometry: null,
    provinceId: "02",
    nameNew: "Hồ Chí Minh",
    administrativeCenter: "Quận 1",
    areaKm2: 2061.0,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "30",
    code: "30",
    name: "Đà Nẵng",
    nameEn: "Da Nang",
    region: "Miền Trung",
    population: 1191381,
    area: 1284.9,
    latitude: 16.0544,
    longitude: 108.2022,
    // Map component specific fields
    geometry: null,
    provinceId: "30",
    nameNew: "Đà Nẵng",
    administrativeCenter: "Hải Châu",
    areaKm2: 1284.9,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "48",
    code: "48",
    name: "Đồng Nai",
    nameEn: "Dong Nai",
    region: "Đông Nam Bộ",
    population: 3115057,
    area: 5863.6,
    latitude: 10.9680,
    longitude: 106.9758,
    // Map component specific fields
    geometry: null,
    provinceId: "48",
    nameNew: "Đồng Nai",
    administrativeCenter: "Biên Hòa",
    areaKm2: 5863.6,
    beforeMerger: "",
    administrativeUnits: "Tỉnh",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "79",
    code: "79",
    name: "Cần Thơ",
    nameEn: "Can Tho",
    region: "Đồng bằng sông Cửu Long",
    population: 1252947,
    area: 1439.0,
    latitude: 10.0458,
    longitude: 105.7469,
    // Map component specific fields
    geometry: null,
    provinceId: "79",
    nameNew: "Cần Thơ",
    administrativeCenter: "Ninh Kiều",
    areaKm2: 1439.0,
    beforeMerger: "",
    administrativeUnits: "Thành phố trực thuộc trung ương",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Mock data for communes
const mockCommunes = [
  // Hà Nội communes
  {
    id: "01001",
    code: "01001",
    name: "Phúc Xá",
    nameEn: "Phuc Xa",
    provinceId: "01",
    districtId: "001",
    population: 15000,
    latitude: 21.0285,
    longitude: 105.8342,
    // Map component specific fields
    geometry: null,
    communeId: "01001",
    nameNew: "Phúc Xá",
    type: "Xã",
    areaKm2: 10.5,
    beforeMerger: "",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "01002",
    code: "01002",
    name: "Phúc Tân",
    nameEn: "Phuc Tan",
    provinceId: "01",
    districtId: "001",
    population: 18000,
    latitude: 21.0350,
    longitude: 105.8400,
    // Map component specific fields
    geometry: null,
    communeId: "01002",
    nameNew: "Phúc Tân",
    type: "Xã",
    areaKm2: 12.3,
    beforeMerger: "",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  // Hồ Chí Minh communes
  {
    id: "02001",
    code: "02001",
    name: "Phường 1",
    nameEn: "Ward 1",
    provinceId: "02",
    districtId: "001",
    population: 25000,
    latitude: 10.7744,
    longitude: 106.6990,
    // Map component specific fields
    geometry: null,
    communeId: "02001",
    nameNew: "Phường 1",
    type: "Phường",
    areaKm2: 1.8,
    beforeMerger: "",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

import { ApiClient, apiClient } from './client';
import { ApiError } from './utils/error-handling';
import type {
  PaginatedResponse,
  PaginationParams,
  SearchFilters,
  SearchResponse
} from './types/common';

// Placeholder types for LotusDharma domain entities
// These will be replaced by generated types from OpenAPI spec

export interface DharmaTeaching {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  language: 'vi' | 'en';
  isPublished: boolean;
  publishedAt?: string;
  readingTime?: number; // in minutes
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  type: 'guided' | 'timer' | 'breathing';
  audioUrl?: string;
  instructorId?: string;
  instructor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  completedTeachings: string[];
  meditationStats: {
    totalSessions: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
  };
  favoriteTeachings: string[];
  favoriteMeditations: string[];
  readingGoals: {
    daily: number; // minutes
    weekly: number; // minutes
  };
  lastActivity: string;
  updatedAt: string;
}

export interface Province {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  region?: string;
  population?: number;
  area?: number; // in km²
  latitude?: number;
  longitude?: number;
  // Map component specific fields
  geometry?: any;
  provinceId?: string;
  nameNew?: string;
  administrativeCenter?: string;
  areaKm2?: number;
  beforeMerger?: string;
  administrativeUnits?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Commune {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  provinceId: string;
  province?: Province;
  districtId: string;
  district?: {
    id: string;
    name: string;
    nameEn?: string;
  };
  population?: number;
  latitude?: number;
  longitude?: number;
  // Map component specific fields
  geometry?: any;
  communeId?: string;
  nameNew?: string;
  type?: string;
  areaKm2?: number;
  beforeMerger?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API request/response types
export interface TeachingFilters {
  category?: string;
  author?: string;
  language?: 'vi' | 'en';
  isPublished?: boolean;
  tags?: string[];
  search?: string;
}

export interface MeditationFilters {
  type?: 'guided' | 'timer' | 'breathing';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: {
    min?: number;
    max?: number;
  };
  instructor?: string;
  category?: string;
  search?: string;
}

/**
 * Data API client for LotusDharma domain operations
 * Handles teachings, meditations, user progress, and geographical data
 */
export class DataApi extends ApiClient {
  // ========== TEACHINGS ==========

  /**
   * Get paginated list of teachings
   */
  async getTeachings(
    filters: TeachingFilters & PaginationParams = {}
  ): Promise<PaginatedResponse<DharmaTeaching>> {
    // Convert filters to search params, filtering out undefined values
    const searchParams: Record<string, string | number | boolean> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams[key] = value;
      }
    });

    const response = await this.get('/teachings', {
      searchParams,
      next: {
        tags: ['teachings'],
        revalidate: 1800, // 30 minutes
      },
    });

    return response.data;
  }

  /**
   * Get single teaching by ID
   */
  async getTeaching(id: string): Promise<DharmaTeaching> {
    const response = await this.get(`/teachings/${id}`, {
      next: {
        tags: [`teaching:${id}`],
        revalidate: 3600, // 1 hour
      },
    });

    return response.data;
  }

  /**
   * Search teachings
   */
  async searchTeachings(filters: SearchFilters): Promise<SearchResponse<DharmaTeaching>> {
    const searchParams: Record<string, string | number | boolean> = {};

    if (filters.query) searchParams.q = filters.query;
    if (filters.filters) {
      Object.entries(filters.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams[key] = value;
        }
      });
    }
    if (filters.pagination) {
      Object.entries(filters.pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams[key] = value;
        }
      });
    }

    const response = await this.get('/teachings/search', {
      searchParams,
      next: {
        tags: ['teachings', 'search'],
        revalidate: 300, // 5 minutes
      },
    });

    return response.data;
  }

  /**
   * Get featured/popular teachings
   */
  async getFeaturedTeachings(limit: number = 10): Promise<DharmaTeaching[]> {
    const response = await this.get('/teachings/featured', {
      searchParams: { limit },
      next: {
        tags: ['teachings', 'featured'],
        revalidate: 1800, // 30 minutes
      },
    });

    return response.data;
  }

  // ========== MEDITATION ==========

  /**
   * Get paginated list of meditation sessions
   */
  async getMeditations(
    filters: MeditationFilters & PaginationParams = {}
  ): Promise<PaginatedResponse<MeditationSession>> {
    // Convert filters to search params, filtering out undefined values
    const searchParams: Record<string, string | number | boolean> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams[key] = value;
      }
    });

    const response = await this.get('/meditations', {
      searchParams,
      next: {
        tags: ['meditations'],
        revalidate: 1800, // 30 minutes
      },
    });

    return response.data;
  }

  /**
   * Get single meditation session
   */
  async getMeditation(id: string): Promise<MeditationSession> {
    const response = await this.get(`/meditations/${id}`, {
      next: {
        tags: [`meditation:${id}`],
        revalidate: 3600, // 1 hour
      },
    });

    return response.data;
  }

  /**
   * Get meditation sessions by category
   */
  async getMeditationsByCategory(category: string): Promise<MeditationSession[]> {
    const response = await this.get(`/meditations/category/${category}`, {
      next: {
        tags: [`meditations:category:${category}`],
        revalidate: 1800, // 30 minutes
      },
    });

    return response.data;
  }

  // ========== USER PROGRESS ==========

  /**
   * Get user progress and statistics
   */
  async getUserProgress(userId?: string): Promise<UserProgress> {
    const endpoint = userId ? `/users/${userId}/progress` : '/user/progress';

    const response = await this.get(endpoint, {
      next: {
        tags: ['user-progress'],
        revalidate: 300, // 5 minutes
      },
    });

    return response.data;
  }

  /**
   * Update user progress (complete teaching, etc.)
   */
  async updateUserProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    const response = await this.patch('/user/progress', updates);

    return response.data;
  }

  /**
   * Mark teaching as completed
   */
  async completeTeaching(teachingId: string): Promise<void> {
    await this.post(`/user/progress/teachings/${teachingId}/complete`);
  }

  /**
   * Add/remove favorite teaching
   */
  async toggleFavoriteTeaching(teachingId: string, favorite: boolean): Promise<void> {
    const method = favorite ? 'POST' : 'DELETE';
    await this.request(`/user/favorites/teachings/${teachingId}`, {
      method,
    });
  }

  // ========== GEOGRAPHICAL DATA ==========

  /**
   * Get all provinces
   */
  async getProvinces(): Promise<Province[]> {
    // Return mock data for now (when backend is not available)
    // In production, this would call the backend API
    return Promise.resolve(mockProvinces);
  }

  /**
   * Get single province
   */
  async getProvince(id: string): Promise<Province> {
    const response = await this.get(`/provinces/${id}`, {
      next: {
        tags: [`province:${id}`],
        revalidate: 86400,
      },
    });

    return response.data;
  }

  /**
   * Get communes by province
   */
  async getCommunesByProvince(provinceId: string): Promise<Commune[]> {
    // Return mock communes for the specified province
    const communes = mockCommunes.filter(commune => commune.provinceId === provinceId);
    return Promise.resolve(communes);
  }

  /**
   * Search communes
   */
  async searchCommunes(query: string, limit: number = 20): Promise<Commune[]> {
    const response = await this.get('/communes/search', {
      searchParams: { q: query, limit },
      next: {
        tags: ['communes', 'search'],
        revalidate: 3600, // 1 hour
      },
    });

    return response.data;
  }

  // ========== ANALYTICS & STATISTICS ==========

  /**
   * Get teaching reading statistics
   */
  async getTeachingStats(teachingId: string): Promise<{
    viewCount: number;
    likeCount: number;
    averageReadingTime: number;
    completionRate: number;
  }> {
    const response = await this.get(`/teachings/${teachingId}/stats`, {
      next: {
        tags: [`teaching:stats:${teachingId}`],
        revalidate: 300, // 5 minutes
      },
    });

    return response.data;
  }

  /**
   * Record teaching view
   */
  async recordTeachingView(teachingId: string): Promise<void> {
    await this.post(`/teachings/${teachingId}/view`, undefined, {
      retries: 0, // Don't retry analytics calls
    });
  }

  // ========== CONTENT MANAGEMENT (Admin only) ==========

  /**
   * Create new teaching (admin)
   */
  async createTeaching(teaching: Omit<DharmaTeaching, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'>): Promise<DharmaTeaching> {
    const response = await this.post('/admin/teachings', teaching);

    return response.data;
  }

  /**
   * Update teaching (admin)
   */
  async updateTeaching(id: string, updates: Partial<DharmaTeaching>): Promise<DharmaTeaching> {
    const response = await this.put(`/admin/teachings/${id}`, updates);

    return response.data;
  }

  /**
   * Delete teaching (admin)
   */
  async deleteTeaching(id: string): Promise<void> {
    await this.delete(`/admin/teachings/${id}`);
  }
}

// Default data API instance
export const dataApi = new DataApi();