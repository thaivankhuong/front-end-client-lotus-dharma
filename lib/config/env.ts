import { z } from 'zod';

// Load environment variables explicitly (Next.js doesn't always load them automatically)
if (typeof process !== 'undefined' && process.env) {
  // In development, Next.js should load .env.local automatically
  // But let's ensure critical vars are available
  const required = ['NEXT_PUBLIC_JWT_SECRET', 'CSRF_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('⚠️  Missing required environment variables:', missing.join(', '));
    console.warn('💡 Run: npm run generate-secrets');
  }
}

// Environment variables schema
const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.string().default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('LotusDharma'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),

  // API Configuration
  NEXT_PUBLIC_APP_API_DOMAIN: z.string().default('http://localhost:5000'),
  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:5000'),
  API_TIMEOUT: z.coerce.number().default(30000),
  API_RETRIES: z.coerce.number().default(3),

  // Authentication
  NEXT_PUBLIC_JWT_SECRET: z.string().min(32),
  JWT_REFRESH_COOKIE_NAME: z.string().default('refresh_token'),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

  // Security (Chỉ validate bắt buộc ở Server)
  CSRF_SECRET: typeof window === 'undefined' ? z.string().min(32) : z.string().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),

  // CDN & Assets
  NEXT_PUBLIC_CDN_URL: z.string().optional(),
  NEXT_PUBLIC_IMAGE_DOMAIN: z.string().optional(),

  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
  LOG_WEBHOOK_URL: z.string().optional(),

  // Caching
  CACHE_REVALIDATE_INTERVAL: z.coerce.number().default(3600), // 1 hour
  ISR_REVALIDATE_INTERVAL: z.coerce.number().default(86400), // 24 hours

  // Feature Flags
  FEATURE_I18N: z.coerce.boolean().default(false),
  FEATURE_ANALYTICS: z.coerce.boolean().default(false),
  FEATURE_PWA: z.coerce.boolean().default(false),

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000), // 1 minute

  // External Services
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
});

// Parse and validate environment variables
let env: z.infer<typeof envSchema>;

try {
  // Đối với Client, chúng ta cần liệt kê tường tận các biến vì process.env không tồn tại đầy đủ dưới dạng object
  const envData = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_API_DOMAIN: process.env.NEXT_PUBLIC_APP_API_DOMAIN,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_TIMEOUT: process.env.API_TIMEOUT,
    API_RETRIES: process.env.API_RETRIES,
    NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    JWT_REFRESH_COOKIE_NAME: process.env.JWT_REFRESH_COOKIE_NAME,
    JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    CSRF_SECRET: process.env.CSRF_SECRET,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_IMAGE_DOMAIN: process.env.NEXT_PUBLIC_IMAGE_DOMAIN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_WEBHOOK_URL: process.env.LOG_WEBHOOK_URL,
    CACHE_REVALIDATE_INTERVAL: process.env.CACHE_REVALIDATE_INTERVAL,
    ISR_REVALIDATE_INTERVAL: process.env.ISR_REVALIDATE_INTERVAL,
    FEATURE_I18N: process.env.FEATURE_I18N,
    FEATURE_ANALYTICS: process.env.FEATURE_ANALYTICS,
    FEATURE_PWA: process.env.FEATURE_PWA,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    REDIS_URL: process.env.REDIS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  env = envSchema.parse(envData);
} catch (error) {
  // Trong môi trường development, Next.js hot-reloads thường gây ra lỗi validate tạm thời
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    console.warn('⚠️ Environment validation warning (Client-side): Missing some non-public vars');
    // Trả về bản parse không nghiêm ngặt cho client để tránh crash trang
    env = envSchema.partial().parse(process.env) as any;
  } else {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('❌ Environment validation failed:', error);
    }
    throw new Error('Invalid environment configuration');
  }
}

// Export validated environment
export { env };

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// API URLs
export const API_BASE_URL = `${env.NEXT_PUBLIC_APP_API_DOMAIN}/api`;
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
  },
  TEACHINGS: '/api/teachings',
  MEDITATION: '/api/meditation',
  USER: {
    PROFILE: '/api/user/profile',
    PROGRESS: '/api/user/progress',
    PREFERENCES: '/api/user/preferences',
  },
} as const;

// CDN helpers
export const getCDNUrl = (path: string): string => {
  if (env.NEXT_PUBLIC_CDN_URL) {
    return `${env.NEXT_PUBLIC_CDN_URL}${path}`;
  }
  return path;
};

// Environment-specific configurations
export const CONFIG = {
  API: {
    BASE_URL: API_BASE_URL,
    TIMEOUT: env.API_TIMEOUT,
    RETRIES: env.API_RETRIES,
    ENDPOINTS: API_ENDPOINTS,
  },
  AUTH: {
    JWT_SECRET: env.NEXT_PUBLIC_JWT_SECRET,
    REFRESH_COOKIE_NAME: env.JWT_REFRESH_COOKIE_NAME,
    ACCESS_TOKEN_EXPIRY: env.JWT_ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: env.JWT_REFRESH_TOKEN_EXPIRY,
  },
  CACHE: {
    REVALIDATE_INTERVAL: env.CACHE_REVALIDATE_INTERVAL,
    ISR_REVALIDATE_INTERVAL: env.ISR_REVALIDATE_INTERVAL,
  },
  SECURITY: {
    CSRF_SECRET: env.CSRF_SECRET,
    CORS_ORIGINS: env.CORS_ORIGINS.split(','),
  },
  MONITORING: {
    SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
    LOG_LEVEL: env.LOG_LEVEL,
    LOG_WEBHOOK_URL: env.LOG_WEBHOOK_URL,
  },
  RATE_LIMIT: {
    MAX_REQUESTS: env.RATE_LIMIT_MAX_REQUESTS,
    WINDOW_MS: env.RATE_LIMIT_WINDOW_MS,
  },
  FEATURES: {
    I18N: env.FEATURE_I18N,
    ANALYTICS: env.FEATURE_ANALYTICS,
    PWA: env.FEATURE_PWA,
  },
} as const;