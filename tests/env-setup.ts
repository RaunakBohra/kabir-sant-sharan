/**
 * Environment setup for Jest tests
 * Sets up test environment variables before running tests
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-32-characters-long-minimum';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-32-characters-long-minimum';
process.env.DATABASE_URL = ':memory:'; // In-memory SQLite for tests
process.env.D1_DATABASE_URL = ':memory:';

// Disable logging during tests unless explicitly enabled
if (!process.env.ENABLE_TEST_LOGS) {
  process.env.LOG_LEVEL = 'silent';
}

// Test-specific configurations
process.env.RATE_LIMIT_ENABLED = 'false'; // Disable rate limiting in tests
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.API_BASE_URL = 'http://localhost:3000/api';