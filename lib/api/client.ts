import { env, API_BASE_URL, API_ENDPOINTS } from '@/lib/config/env';
import { ApiError, normalizeApiError, logApiError } from './utils/error-handling';
import { withRetry, withTimeout, requestDeduplicationCache, defaultCircuitBreaker } from './utils/retry';
import type { ApiRequestOptions, ApiResponse } from './types/common';

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

// Request configuration
export interface RequestConfig extends ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  searchParams?: Record<string, string | number | boolean>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig; // Next.js specific
}

// Next.js fetch configuration
export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
  cache?: RequestCache;
}

// API Client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  enableDeduplication: boolean;
  enableCircuitBreaker: boolean;
  enableLogging: boolean;
}

// Default client configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: API_BASE_URL,
  timeout: env.API_TIMEOUT,
  retries: env.API_RETRIES,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  enableDeduplication: true,
  enableCircuitBreaker: true,
  enableLogging: true,
};

/**
 * Base API Client for LotusDharma
 * Provides resilient HTTP communication with .NET backend
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Make an HTTP request with full resilience features
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const correlationId = config.correlationId || this.generateCorrelationId();

    try {
      // Build full URL
      const url = this.buildUrl(endpoint, config.searchParams);

      // Build request options
      const requestOptions = this.buildRequestOptions(config, correlationId);

      // Create fetch function with resilience
      const fetchFn = () => this.executeFetch<T>(url, requestOptions, correlationId);

      // Apply resilience features
      let result: ApiResponse<T>;

      if (this.config.enableCircuitBreaker) {
        result = await defaultCircuitBreaker.execute(fetchFn);
      } else {
        result = await fetchFn();
      }

      // Log successful request
      if (this.config.enableLogging) {
        console.log(`✅ API ${config.method || 'GET'} ${endpoint}`, {
          correlationId,
          status: result.status,
          duration: Date.now() - (requestOptions.startTime || Date.now())
        });
      }

      return result;

    } catch (error) {
      const apiError = error instanceof ApiError ? error : normalizeApiError(error, correlationId);

      // Log error
      if (this.config.enableLogging) {
        logApiError(apiError, { endpoint, method: config.method });
      }

      throw apiError;
    }
  }

  /**
   * Convenience methods for HTTP verbs
   */
  async get<T = any>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T = any>(endpoint: string, body?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T = any>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Execute the actual fetch request
   */
  private async executeFetch<T>(
    url: string,
    options: RequestInit & { startTime: number },
    correlationId: string
  ): Promise<ApiResponse<T>> {
    // Apply request deduplication for GET requests
    if (this.config.enableDeduplication && options.method === 'GET') {
      return requestDeduplicationCache.dedupe(
        'GET',
        url,
        () => this.performFetch<T>(url, options, correlationId),
        undefined,
        5000 // 5 second deduplication window
      );
    }

    return this.performFetch<T>(url, options, correlationId);
  }

  /**
   * Perform the actual fetch with timeout and retry
   */
  private async performFetch<T>(
    url: string,
    options: RequestInit & { startTime: number },
    correlationId: string
  ): Promise<ApiResponse<T>> {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // Apply timeout
      const response = await withTimeout(
        fetch(url, {
          ...options,
          signal: controller.signal,
        }),
        this.config.timeout,
        'Request timeout'
      );

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        throw response;
      }

      // Parse response
      const data = await this.parseResponse<T>(response);

      return {
        data,
        status: response.status,
        headers: response.headers,
        correlationId,
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request aborted', 408, 'TIMEOUT', correlationId);
      }

      throw error;
    }
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    if (contentType?.includes('text/')) {
      return response.text() as T;
    }

    // For binary data or unknown types
    return response.blob() as T;
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, searchParams?: Record<string, string | number | boolean>): string {
    const baseUrl = this.config.baseURL.replace(/\/$/, ''); // Remove trailing slash
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${baseUrl}${path}`);

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Build request options
   */
  private buildRequestOptions(
    config: RequestConfig,
    correlationId: string
  ): RequestInit & { startTime: number } {
    const headers = new Headers(this.config.headers);

    // Add custom headers
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    // Add correlation ID
    headers.set('x-correlation-id', correlationId);

    // Add Next.js specific headers if needed
    if (config.next) {
      if (config.next.tags) {
        headers.set('x-next-cache-tags', config.next.tags.join(','));
      }
    }

    // Build request body
    let body: BodyInit | undefined;
    if (config.body) {
      if (typeof config.body === 'object' && !(config.body instanceof FormData)) {
        body = JSON.stringify(config.body);
        headers.set('Content-Type', 'application/json');
      } else {
        body = config.body;
      }
    }

    return {
      method: config.method || 'GET',
      headers,
      body,
      cache: config.cache || 'default',
      startTime: Date.now(),
    };
  }

  /**
   * Generate correlation ID for request tracing
   */
  private generateCorrelationId(): string {
    return `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ApiClientConfig {
    return { ...this.config };
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Helper function to create authenticated client
export function createAuthenticatedClient(accessToken?: string): ApiClient {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return new ApiClient({
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...headers,
    },
  });
}