// Application Constants
export const APP_CONFIG = {
  NAME: 'LotusDharma',
  DESCRIPTION: 'Ứng dụng Phật giáo - Khám phá Phật pháp và thiền tập',
  VERSION: '1.0.0',
  AUTHOR: 'LotusDharma Team',
  KEYWORDS: ['phật giáo', 'phật pháp', 'thiền', 'meditation', 'buddhism', 'dharma'],
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  PUBLIC: {
    TEACHINGS: '/teachings',
    TEACHINGS_DETAIL: '/teachings/[slug]',
    MEDITATION: '/meditation',
    ABOUT: '/about',
    CONTACT: '/contact',
  },
  USER: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    PROGRESS: '/progress',
    PREFERENCES: '/preferences',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    TEACHINGS: '/admin/teachings',
    ANALYTICS: '/admin/analytics',
  },
} as const;

// API Status Codes
export const API_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Error Types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

// Cache Keys & Tags
export const CACHE_KEYS = {
  TEACHINGS: 'teachings',
  TEACHINGS_LIST: 'teachings:list',
  TEACHINGS_DETAIL: 'teachings:detail',
  USER_PROFILE: 'user:profile',
  USER_PROGRESS: 'user:progress',
  USER_PREFERENCES: 'user:preferences',
  MEDITATION_SESSIONS: 'meditation:sessions',
  MEDITATION_PROGRESS: 'meditation:progress',
  AUTH_USER: 'auth:user',
  AUTH_SESSION: 'auth:session',
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'lotus_dharma_theme',
  LANGUAGE: 'lotus_dharma_language',
  USER_PREFERENCES: 'lotus_dharma_user_preferences',
  LAST_VISITED_PAGE: 'lotus_dharma_last_visited_page',
  ONBOARDING_COMPLETED: 'lotus_dharma_onboarding_completed',
} as const;

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language Constants
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en',
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

// Time Constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

// File Size Limits
export const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  TEACHING_AUDIO: 50 * 1024 * 1024, // 50MB
  TEACHING_VIDEO: 500 * 1024 * 1024, // 500MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_VI: /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// Feature Flags (can be controlled by environment)
export const FEATURES = {
  AUTH: true,
  TEACHINGS: true,
  MEDITATION: true,
  PROGRESS_TRACKING: true,
  SOCIAL_SHARING: false,
  OFFLINE_MODE: false,
  MULTI_LANGUAGE: false,
  DARK_MODE: true,
  NOTIFICATIONS: false,
  ANALYTICS: false,
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/lotusdharmavn',
  YOUTUBE: 'https://youtube.com/@lotusdharmavn',
  INSTAGRAM: 'https://instagram.com/lotusdharmavn',
  WEBSITE: 'https://lotusdharma.vn',
} as const;

// Contact Information
export const CONTACT = {
  EMAIL: 'contact@lotusdharma.vn',
  PHONE: '+84 123 456 789',
  ADDRESS: 'Hà Nội, Việt Nam',
} as const;

// SEO Constants
export const SEO = {
  TITLE_TEMPLATE: '%s | LotusDharma',
  DEFAULT_TITLE: 'LotusDharma - Ứng dụng Phật giáo',
  DEFAULT_DESCRIPTION: 'Khám phá Phật pháp, thực hành thiền tập và phát triển tâm linh cùng LotusDharma.',
  SITE_NAME: 'LotusDharma',
  TWITTER_HANDLE: '@lotusdharmavn',
  IMAGE_WIDTH: 1200,
  IMAGE_HEIGHT: 630,
} as const;