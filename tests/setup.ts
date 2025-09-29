/**
 * Jest setup file
 * Global test configuration and utilities
 */

import '@testing-library/jest-dom';

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJWT(): R;
      toHaveValidProblemDetails(): R;
    }
  }
}

// Custom JWT matcher
expect.extend({
  toBeValidJWT(received: string) {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    const pass = typeof received === 'string' && jwtRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT`,
        pass: false,
      };
    }
  },

  toHaveValidProblemDetails(received: any) {
    const requiredFields = ['type', 'title', 'status', 'detail', 'instance', 'timestamp', 'traceId'];
    const missingFields = requiredFields.filter(field => !(field in received));

    const pass = missingFields.length === 0 &&
                 typeof received.status === 'number' &&
                 received.status >= 400 &&
                 received.status < 600;

    if (pass) {
      return {
        message: () => `expected object not to have valid RFC 9457 Problem Details format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected object to have valid RFC 9457 Problem Details format. Missing fields: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
  }
});

// Suppress console.log during tests unless explicitly enabled
if (!process.env.ENABLE_TEST_LOGS) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Global test timeout
jest.setTimeout(30000);