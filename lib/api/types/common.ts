// Common API types shared across the application

// Pagination types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Common filter types
export interface DateRangeFilter {
  from?: string; // ISO date string
  to?: string;   // ISO date string
}

export interface TextSearchFilter {
  search?: string;
  searchFields?: string[];
}

// Common entity fields
export interface BaseEntity {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Audit fields (if supported by backend)
export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
}

// Soft delete support
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: string | null;
  isDeleted?: boolean;
}

// User-related types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  roles: string[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'vi' | 'en';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  meditationReminders: boolean;
  dailyQuotes: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  activityTracking: boolean;
  analyticsSharing: boolean;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // Only in response from BFF
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  // Refresh token is sent via HttpOnly cookie
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// API Request/Response wrappers
export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  correlationId?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  correlationId?: string;
}

// Error types (detailed in error-handling.ts)
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiValidationError {
  errors: Record<string, string[]>;
}

// Generic API response types
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export type ApiResponseUnion<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Utility types for API operations
export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
export type CreateResponse<T> = T;
export type UpdateResponse<T> = T;

// Search and filter types
export interface SearchFilters {
  query?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: PaginationParams;
}

export interface SearchResponse<T> extends PaginatedResponse<T> {
  query?: string;
  filters?: Record<string, any>;
  took: number; // Search execution time in ms
}

// Upload types
export interface FileUploadRequest {
  file: File;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Real-time event types (for WebSocket/SSE)
export interface RealTimeEvent<T = any> {
  type: string;
  payload: T;
  timestamp: string;
  userId?: string;
}

// Generic CRUD operation types
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export interface CrudEvent<T = any> {
  operation: CrudOperation;
  entityType: string;
  entityId: string;
  data?: T;
  userId: string;
  timestamp: string;
}

// Health check types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    database: 'healthy' | 'unhealthy';
    cache: 'healthy' | 'unhealthy';
    api: 'healthy' | 'unhealthy';
  };
  uptime: number;
  version: string;
}