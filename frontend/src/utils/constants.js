// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: "authToken",
  USER_STORAGE_KEY: "userData",
  REFRESH_TOKEN_KEY: "refreshToken",
  TOKEN_REFRESH_THRESHOLD: 300, // 5 minutes before expiry
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Voice Recording
export const VOICE_CONFIG = {
  MAX_RECORDING_DURATION: 30, // seconds
  MIN_RECORDING_DURATION: 1, // seconds
  SAMPLE_RATE: 44100,
  AUDIO_FORMAT: "audio/wav",
  SUPPORTED_MIME_TYPES: [
    "audio/webm; codecs=opus",
    "audio/webm",
    "audio/wav",
    "audio/mp3",
  ],
};

// Learning System
export const LEARNING_CONFIG = {
  MAX_LESSON_DURATION: 60, // minutes
  MIN_LESSON_DURATION: 5, // minutes
  PROGRESS_SAVE_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT_WARNING: 300000, // 5 minutes
  AUTO_SAVE_ENABLED: true,
};

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300, // milliseconds
  DEBOUNCE_DELAY: 500, // milliseconds
  TOAST_DURATION: 5000, // 5 seconds
  MODAL_ANIMATION_DURATION: 200,
  LOADING_DELAY: 1000, // Show loader after 1 second
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AUDIO_SIZE: 25 * 1024 * 1024, // 25MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  SUPPORTED_AUDIO_TYPES: ["audio/wav", "audio/mp3", "audio/webm", "audio/ogg"],
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large uploads
};

// PWA Configuration
export const PWA_CONFIG = {
  UPDATE_CHECK_INTERVAL: 60000, // 1 minute
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  OFFLINE_FALLBACK_PAGE: "/offline.html",
  NOTIFICATION_TIMEOUT: 10000, // 10 seconds
};

// Lesson Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  EXPERT: "expert",
};

// Lesson Categories
export const LESSON_CATEGORIES = {
  NUMBERS: "numbers",
  ALPHABET: "alphabet",
  COLORS: "colors",
  SHAPES: "shapes",
  ANIMALS: "animals",
  FOOD: "food",
  FAMILY: "family",
  BODY_PARTS: "body-parts",
  EMOTIONS: "emotions",
  WEATHER: "weather",
  TRANSPORTATION: "transportation",
  CLOTHING: "clothing",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  WORKER: "worker",
  PARENT: "parent",
  CHILD: "child",
  GUEST: "guest",
};

// Session Status
export const SESSION_STATUS = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed",
};

// Scoring System
export const SCORING = {
  PERFECT_PRONUNCIATION: 100,
  GOOD_PRONUNCIATION: 80,
  FAIR_PRONUNCIATION: 60,
  POOR_PRONUNCIATION: 40,
  NO_PRONUNCIATION: 0,
  BONUS_FIRST_TRY: 10,
  BONUS_STREAK: 5,
};

// Feedback Types
export const FEEDBACK_TYPES = {
  POSITIVE: "positive",
  NEGATIVE: "negative",
  NEUTRAL: "neutral",
  ENCOURAGING: "encouraging",
  CORRECTIVE: "corrective",
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  SESSION_STARTED: "session_started",
  SESSION_COMPLETED: "session_completed",
  SESSION_ABANDONED: "session_abandoned",
  LESSON_STARTED: "lesson_started",
  LESSON_COMPLETED: "lesson_completed",
  STEP_COMPLETED: "step_completed",
  RECORDING_MADE: "recording_made",
  FEEDBACK_RECEIVED: "feedback_received",
  SCORE_ACHIEVED: "score_achieved",
  ERROR_OCCURRED: "error_occurred",
  USER_REGISTERED: "user_registered",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
};

// Error Codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",

  // Authentication errors
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",

  // Voice recording errors
  VOICE_NOT_SUPPORTED: "VOICE_NOT_SUPPORTED",
  VOICE_PERMISSION_DENIED: "VOICE_PERMISSION_DENIED",
  VOICE_DEVICE_NOT_FOUND: "VOICE_DEVICE_NOT_FOUND",
  VOICE_DEVICE_BUSY: "VOICE_DEVICE_BUSY",
  VOICE_RECORDING_FAILED: "VOICE_RECORDING_FAILED",

  // File upload errors
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_TYPE_NOT_SUPPORTED: "FILE_TYPE_NOT_SUPPORTED",
  UPLOAD_FAILED: "UPLOAD_FAILED",

  // Data errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DATA_NOT_FOUND: "DATA_NOT_FOUND",
  DATA_CORRUPTED: "DATA_CORRUPTED",

  // Generic errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  PROGRESS_DATA: "learningProgress",
  SESSION_DATA: "currentSession",
  SETTINGS: "userSettings",
  OFFLINE_QUEUE: "offlineQueue",
  CACHED_LESSONS: "cachedLessons",
  LAST_SYNC: "lastSyncTimestamp",
  PWA_INSTALLED: "pwaInstalled",
  FIRST_VISIT: "firstVisit",
};

// Default User Settings
export const DEFAULT_SETTINGS = {
  language: "en-US",
  voiceRecognition: true,
  audioFeedback: true,
  visualFeedback: true,
  autoAdvance: false,
  recordingMaxDuration: 30,
  theme: "light",
  notifications: true,
  offlineMode: true,
  dataSync: true,
  analytics: true,
};

// Color Palette
export const COLORS = {
  PRIMARY: "#3B82F6", // Blue 500
  SECONDARY: "#10B981", // Green 500
  ACCENT: "#F59E0B", // Yellow 500
  DANGER: "#EF4444", // Red 500
  WARNING: "#F59E0B", // Yellow 500
  SUCCESS: "#10B981", // Green 500
  INFO: "#3B82F6", // Blue 500
  LIGHT: "#F8FAFC", // Gray 50
  DARK: "#1F2937", // Gray 800
  MUTED: "#6B7280", // Gray 500
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: "640px",
  MD: "768px",
  LG: "1024px",
  XL: "1280px",
  "2XL": "1536px",
};

// Z-Index Scale
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
};

// Common Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Common HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Feature Flags (for gradual rollouts)
export const FEATURES = {
  VOICE_RECOGNITION_V2: import.meta.env.VITE_FEATURE_VOICE_V2 === "true",
  ANALYTICS_ENHANCED: import.meta.env.VITE_FEATURE_ANALYTICS === "true",
  OFFLINE_SYNC: import.meta.env.VITE_FEATURE_OFFLINE === "true",
  AI_FEEDBACK: import.meta.env.VITE_FEATURE_AI_FEEDBACK === "true",
  MULTI_LANGUAGE: import.meta.env.VITE_FEATURE_MULTI_LANG === "true",
  COLLABORATIVE_MODE: import.meta.env.VITE_FEATURE_COLLAB === "true",
};

// Environment Information
export const ENVIRONMENT = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  BUILD_DATE: import.meta.env.VITE_BUILD_DATE || new Date().toISOString(),
  COMMIT_HASH: import.meta.env.VITE_COMMIT_HASH || "unknown",
};
