import { ApiClient, apiClient } from './client';
import { ApiError } from './utils/error-handling';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  User
} from './types/common';

/**
 * Authentication API client
 * Handles all auth-related operations with .NET backend
 */
export class AuthApi extends ApiClient {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/login', credentials, {
        // Don't retry auth failures
        retries: 0,
      });

      // Validate response structure
      this.validateAuthResponse(response.data);

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        // Convert auth errors to user-friendly messages
        if (error.status === 401) {
          throw ApiError.authError('Email hoặc mật khẩu không đúng');
        }
        if (error.status === 429) {
          throw ApiError.authError('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.');
        }
      }
      throw error;
    }
  }

  /**
   * Register new user account
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/register', userData, {
        retries: 0, // Don't retry registration failures
      });

      this.validateAuthResponse(response.data);

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          throw ApiError.validationError(
            { email: ['Email này đã được sử dụng'] },
            'Email đã tồn tại'
          );
        }
        if (error.status === 422 && error.details) {
          // Pass through validation errors
          throw error;
        }
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * Refresh token is sent via HttpOnly cookie by the client
   */
  async refresh(): Promise<AuthResponse> {
    try {
      const response = await this.post('/auth/refresh', undefined, {
        retries: 1, // Only retry once for refresh
        headers: {
          // Don't set Content-Type for requests without body - remove it entirely
        },
      });

      this.validateAuthResponse(response.data);

      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Refresh token is invalid/expired
        throw ApiError.authError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw error;
    }
  }

  /**
   * Logout user by invalidating refresh token
   */
  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout', undefined, {
        retries: 0, // Don't retry logout
        headers: {
          // Don't set Content-Type for requests without body
        },
      });
    } catch (error) {
      // Logout failures are not critical, just log them
      console.warn('Logout request failed:', error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.get('/auth/me', {
      next: {
        tags: ['user', 'auth'],
        revalidate: 300, // 5 minutes
      },
    });

    return response.data;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
    await this.post('/auth/password-reset', request, {
      retries: 1,
    });
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(request: PasswordResetConfirmRequest): Promise<void> {
    await this.post('/auth/password-reset/confirm', request, {
      retries: 0, // Don't retry for security
    });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await this.post('/auth/verify-email', { token }, {
      retries: 0,
    });
  }

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<void> {
    await this.post('/auth/resend-verification', undefined, {
      retries: 1,
    });
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.post('/auth/change-password', {
      currentPassword,
      newPassword,
    }, {
      retries: 0, // Don't retry password changes
    });
  }

  /**
   * Validate authentication response structure
   */
  private validateAuthResponse(data: any): asserts data is AuthResponse {
    if (!data || typeof data !== 'object') {
      throw new ApiError('Invalid auth response format', 500, 'INVALID_RESPONSE');
    }

    const requiredFields = ['accessToken', 'tokenType', 'expiresIn', 'user'];
    const missingFields = requiredFields.filter(field => !(field in data));

    if (missingFields.length > 0) {
      throw new ApiError(
        `Auth response missing required fields: ${missingFields.join(', ')}`,
        500,
        'INVALID_RESPONSE'
      );
    }

    // Validate user object
    if (!data.user || !data.user.id || !data.user.email) {
      throw new ApiError('Auth response contains invalid user data', 500, 'INVALID_RESPONSE');
    }
  }
}

// Default auth API instance
export const authApi = new AuthApi();

// BFF Route handlers for authentication
// These will be created in app/api/auth/ directory

/**
 * BFF: Handle login requests
 * POST /api/auth/login
 */
export async function handleLogin(request: Request): Promise<Response> {
  try {
    const body: LoginRequest = await request.json();
    const result = await authApi.login(body);

    // Return response without refresh token (it's in HttpOnly cookie)
    const response = {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      user: result.user,
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          }
        },
        { status: error.status }
      );
    }

    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

/**
 * BFF: Handle token refresh
 * POST /api/auth/refresh
 */
export async function handleRefresh(request: Request): Promise<Response> {
  try {
    const result = await authApi.refresh();

    const response = {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      user: result.user,
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          }
        },
        { status: error.status }
      );
    }

    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

/**
 * BFF: Handle logout
 * POST /api/auth/logout
 */
export async function handleLogout(request: Request): Promise<Response> {
  try {
    await authApi.logout();
    return Response.json({ success: true });
  } catch (error) {
    // Logout failures are not critical
    return Response.json({ success: true });
  }
}

/**
 * BFF: Get current user
 * GET /api/auth/me
 */
export async function handleGetCurrentUser(request: Request): Promise<Response> {
  try {
    const user = await authApi.getCurrentUser();
    return Response.json(user);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return Response.json(
        { error: { code: 'UNAUTHENTICATED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}