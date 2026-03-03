import { z } from 'zod';
import { ERROR_TYPES, API_STATUS } from '@/lib/config/constants';
import { generateCorrelationId } from '@/lib/utils/security';

// API Error response schema from .NET backend
const ApiErrorResponseSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  status: z.number().optional(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(), // Validation errors
  traceId: z.string().optional(), // .NET correlation ID
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// LotusDharma API Error class
export class ApiError extends Error {
  public readonly type: string;
  public readonly status: number;
  public readonly code: string;
  public readonly correlationId: string;
  public readonly details?: Record<string, string[]>;
  public readonly traceId?: string;
  public readonly timestamp: Date;

  constructor(
    message: string,
    status: number = API_STATUS.INTERNAL_SERVER_ERROR,
    code: string = ERROR_TYPES.SERVER,
    correlationId: string = generateCorrelationId(),
    details?: Record<string, string[]>,
    traceId?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = ERROR_TYPES.SERVER;
    this.status = status;
    this.code = code;
    this.correlationId = correlationId;
    this.details = details;
    this.traceId = traceId;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Static factory method for network errors
  static networkError(error: unknown, correlationId?: string): ApiError {
    const message = error instanceof Error ? error.message : 'Network request failed';
    return new ApiError(
      message,
      API_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_TYPES.NETWORK,
      correlationId
    );
  }

  // Static factory method for authentication errors
  static authError(message: string = 'Authentication required', correlationId?: string): ApiError {
    return new ApiError(
      message,
      API_STATUS.UNAUTHORIZED,
      ERROR_TYPES.AUTHENTICATION,
      correlationId
    );
  }

  // Static factory method for authorization errors
  static forbiddenError(message: string = 'Access denied', correlationId?: string): ApiError {
    return new ApiError(
      message,
      API_STATUS.FORBIDDEN,
      ERROR_TYPES.AUTHORIZATION,
      correlationId
    );
  }

  // Static factory method for validation errors
  static validationError(
    details: Record<string, string[]>,
    message: string = 'Validation failed',
    correlationId?: string
  ): ApiError {
    return new ApiError(
      message,
      API_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_TYPES.VALIDATION,
      correlationId,
      details
    );
  }

  // Static factory method for not found errors
  static notFoundError(resource: string = 'Resource', correlationId?: string): ApiError {
    return new ApiError(
      `${resource} not found`,
      API_STATUS.NOT_FOUND,
      ERROR_TYPES.NOT_FOUND,
      correlationId
    );
  }

  // Convert to plain object for logging/serialization
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      status: this.status,
      code: this.code,
      correlationId: this.correlationId,
      details: this.details,
      traceId: this.traceId,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

// Normalize API error from .NET backend response
export function normalizeApiError(
  response: Response | unknown,
  correlationId?: string
): ApiError {
  const correlationIdToUse = correlationId || generateCorrelationId();

  // Handle network errors
  if (!(response instanceof Response)) {
    const error = response instanceof Error ? response : new Error(String(response));
    return ApiError.networkError(error, correlationIdToUse);
  }

  // Handle HTTP error responses
  if (!response.ok) {
    try {
      // Try to parse error response from .NET
      const errorData = ApiErrorResponseSchema.parse(response.json());

      // Map .NET error types to our error types
      let errorType: string = ERROR_TYPES.SERVER;
      let statusCode = response.status;

      switch (response.status) {
        case API_STATUS.UNAUTHORIZED:
          errorType = ERROR_TYPES.AUTHENTICATION;
          break;
        case API_STATUS.FORBIDDEN:
          errorType = ERROR_TYPES.AUTHORIZATION;
          break;
        case API_STATUS.NOT_FOUND:
          errorType = ERROR_TYPES.NOT_FOUND;
          break;
        case API_STATUS.CONFLICT:
          errorType = ERROR_TYPES.CONFLICT;
          break;
        case API_STATUS.UNPROCESSABLE_ENTITY:
          errorType = ERROR_TYPES.VALIDATION;
          break;
        default:
          errorType = ERROR_TYPES.SERVER;
      }

      return new ApiError(
        errorData.detail || errorData.title || `HTTP ${response.status}`,
        statusCode,
        errorType,
        correlationIdToUse,
        errorData.errors,
        errorData.traceId
      );
    } catch (parseError) {
      // Fallback for non-standard error responses
      return new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        ERROR_TYPES.SERVER,
        correlationIdToUse
      );
    }
  }

  // Should not reach here for error responses
  return new ApiError(
    'Unknown error occurred',
    API_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_TYPES.UNKNOWN,
    correlationIdToUse
  );
}

// Check if error is retryable
export function isRetryableError(error: ApiError): boolean {
  // Retry network errors
  if (error.code === ERROR_TYPES.NETWORK) {
    return true;
  }

  // Retry server errors (5xx)
  if (error.status >= 500) {
    return true;
  }

  // Don't retry client errors (4xx)
  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  // Retry timeout errors
  if (error.message.toLowerCase().includes('timeout')) {
    return true;
  }

  return false;
}

// Get user-friendly error message
export function getUserFriendlyErrorMessage(error: ApiError): string {
  switch (error.code) {
    case ERROR_TYPES.NETWORK:
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
    case ERROR_TYPES.AUTHENTICATION:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case ERROR_TYPES.AUTHORIZATION:
      return 'Bạn không có quyền truy cập chức năng này.';
    case ERROR_TYPES.VALIDATION:
      return 'Thông tin nhập vào không hợp lệ. Vui lòng kiểm tra và thử lại.';
    case ERROR_TYPES.NOT_FOUND:
      return 'Không tìm thấy dữ liệu yêu cầu.';
    case ERROR_TYPES.CONFLICT:
      return 'Dữ liệu đã tồn tại hoặc có xung đột. Vui lòng thử lại.';
    default:
      return 'Có lỗi xảy ra. Vui lòng thử lại sau.';
  }
}

// Error logging utility
export function logApiError(error: ApiError, context?: Record<string, any>) {
  const logData = {
    error: error.toJSON(),
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', logData);
  }

  // In production, this would send to monitoring service
  // await monitoringService.logError(logData);
}