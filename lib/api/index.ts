// LotusDharma API Layer
// Main entry point for all API operations

// Core API client and utilities
export { ApiClient, apiClient, createAuthenticatedClient } from './client';
export type { RequestConfig, ApiClientConfig } from './client';

// Authentication API
export { AuthApi, authApi } from './auth';
export {
  handleLogin,
  handleRefresh,
  handleLogout,
  handleGetCurrentUser
} from './auth';

// Data API
export { DataApi, dataApi } from './data';
export type {
  DharmaTeaching,
  MeditationSession,
  UserProgress,
  Province,
  Commune,
  TeachingFilters,
  MeditationFilters
} from './data';

// Utilities
export { normalizeApiError, ApiError, getUserFriendlyErrorMessage } from './utils/error-handling';
export { withRetry, withTimeout } from './utils/retry';

// Common types
export type {
  PaginationParams,
  PaginatedResponse,
  SearchFilters,
  SearchResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UserPreferences,
  NotificationPreferences,
  PrivacyPreferences
} from './types/common';

// Re-export generated types (when available)
// export * from './types/generated';
// export * from './types/enhanced';