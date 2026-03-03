import { env } from '@/lib/config/env';
import { ApiError, isRetryableError } from './error-handling';

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // Base delay in milliseconds
  maxDelay: number; // Maximum delay in milliseconds
  backoffFactor: number; // Exponential backoff factor
  jitter: boolean; // Add random jitter to delay
}

// Default retry configuration
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: env.API_RETRIES,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffFactor: 2,
  jitter: true,
};

// Calculate delay for retry attempt
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const exponentialDelay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
  const delay = Math.min(exponentialDelay, config.maxDelay);

  if (config.jitter) {
    // Add random jitter (±25% of delay)
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    return Math.max(0, delay + jitter);
  }

  return delay;
}

// Generic retry function with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (error: ApiError, attempt: number) => void
): Promise<T> {
  let lastError: ApiError | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(
        error instanceof Error ? error.message : String(error),
        500,
        'UNKNOWN_ERROR'
      );

      lastError = apiError;

      // Don't retry if error is not retryable
      if (!isRetryableError(apiError)) {
        throw apiError;
      }

      // Don't retry on last attempt
      if (attempt === config.maxAttempts) {
        throw apiError;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(apiError, attempt);
      }

      // Wait before retrying
      const delay = calculateRetryDelay(attempt, config);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new ApiError('Retry failed with unknown error', 500, 'UNKNOWN_ERROR');
}

// Circuit breaker pattern implementation
export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  recoveryTimeout: number; // Time to wait before trying to close (ms)
  monitoringPeriod: number; // Time window to count failures (ms)
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new ApiError(
          'Circuit breaker is OPEN',
          503,
          'CIRCUIT_BREAKER_OPEN'
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }
}

// Default circuit breaker instance
export const defaultCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  recoveryTimeout: 60000, // 1 minute
  monitoringPeriod: 300000, // 5 minutes
});

// Request deduplication cache
class RequestDeduplicationCache {
  private cache = new Map<string, Promise<any>>();
  private timeouts = new Map<string, NodeJS.Timeout>();

  private generateKey(method: string, url: string, body?: any): string {
    const bodyHash = body ? JSON.stringify(body) : '';
    return `${method}:${url}:${bodyHash}`;
  }

  async dedupe<T>(
    method: string,
    url: string,
    fn: () => Promise<T>,
    body?: any,
    ttl: number = 5000 // 5 seconds
  ): Promise<T> {
    const key = this.generateKey(method, url, body);

    // Return existing promise if request is in flight
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Create new promise and cache it
    const promise = fn().finally(() => {
      // Clean up after completion
      this.cache.delete(key);
      if (this.timeouts.has(key)) {
        clearTimeout(this.timeouts.get(key));
        this.timeouts.delete(key);
      }
    });

    this.cache.set(key, promise);

    // Set TTL cleanup
    const timeout = setTimeout(() => {
      this.cache.delete(key);
      this.timeouts.delete(key);
    }, ttl);

    this.timeouts.set(key, timeout);

    return promise;
  }

  clear(): void {
    this.cache.clear();
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
  }
}

// Global request deduplication cache
export const requestDeduplicationCache = new RequestDeduplicationCache();

// HTTP status code utilities
export function isServerError(status: number): boolean {
  return status >= 500;
}

export function isClientError(status: number): boolean {
  return status >= 400 && status < 500;
}

export function isRetryableStatus(status: number): boolean {
  // Retry on server errors and specific client errors
  return isServerError(status) ||
         status === 408 || // Request Timeout
         status === 429;   // Too Many Requests
}

// Timeout wrapper for requests
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Request timeout'
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new ApiError(timeoutMessage, 408, 'TIMEOUT'));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}