/**
 * OpenAPI 3.1.0 Specification for Kabir Sant Sharan API
 * Auto-generated documentation with Swagger UI integration
 */

import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Kabir Sant Sharan API',
    version: '1.0.0',
    description: `
# Kabir Sant Sharan - Spiritual Platform API

A comprehensive API for managing spiritual content, events, and community features.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Rate Limiting**: Configurable rate limiting for all endpoints
- **Versioning**: Support for API versioning via headers or URL path
- **Validation**: Comprehensive input validation with Zod schemas
- **Error Handling**: RFC 9457 compliant error responses
- **Logging**: Structured logging with request tracing

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer your_access_token_here
\`\`\`

Tokens expire after 15 minutes and can be refreshed using the refresh endpoint.

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per 15 minutes
- Search endpoints: 50 requests per minute

Rate limit headers are included in responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Remaining requests in current window
- \`X-RateLimit-Reset\`: Time when rate limit resets

## Error Format

All errors follow RFC 9457 Problem Details format:

\`\`\`json
{
  "type": "https://kabirsantsharan.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request contains invalid data",
  "instance": "/api/auth/login",
  "timestamp": "2024-09-29T10:00:00Z",
  "traceId": "abc123"
}
\`\`\`
    `,
    contact: {
      name: 'Kabir Sant Sharan Support',
      email: 'support@kabirsantsharan.com',
      url: 'https://kabirsantsharan.com/contact'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5002/api',
      description: 'Development server'
    },
    {
      url: 'https://kabirsantsharan.com/api',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtained from login endpoint'
      }
    },
    schemas: {
      // Error Response Schema (RFC 9457)
      ProblemDetails: {
        type: 'object',
        required: ['type', 'title', 'status', 'detail', 'instance', 'timestamp', 'traceId'],
        properties: {
          type: {
            type: 'string',
            format: 'uri',
            description: 'URI reference identifying the problem type',
            example: 'https://kabirsantsharan.com/errors/validation-error'
          },
          title: {
            type: 'string',
            description: 'Human-readable summary of the problem type',
            example: 'Validation Error'
          },
          status: {
            type: 'integer',
            description: 'HTTP status code',
            example: 400
          },
          detail: {
            type: 'string',
            description: 'Human-readable explanation specific to this problem',
            example: 'Email and password are required'
          },
          instance: {
            type: 'string',
            format: 'uri',
            description: 'URI reference identifying the specific occurrence',
            example: '/api/auth/login'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the error occurred',
            example: '2024-09-29T10:00:00Z'
          },
          traceId: {
            type: 'string',
            description: 'Unique identifier for tracing/debugging',
            example: 'abc123'
          }
        },
        additionalProperties: true
      },

      // User Schema
      User: {
        type: 'object',
        required: ['id', 'email', 'name', 'role'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique user identifier',
            example: 'user_123'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'admin@kabirsantsharan.com'
          },
          name: {
            type: 'string',
            description: 'User display name',
            example: 'System Administrator'
          },
          role: {
            type: 'string',
            enum: ['admin', 'moderator', 'member'],
            description: 'User role in the system',
            example: 'admin'
          }
        }
      },

      // Authentication Schemas
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'admin@kabirsantsharan.com'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'User password',
            example: 'admin123'
          }
        }
      },

      LoginResponse: {
        type: 'object',
        required: ['accessToken', 'refreshToken', 'expiresAt', 'refreshExpiresAt', 'user', 'message'],
        properties: {
          accessToken: {
            type: 'string',
            description: 'JWT access token (expires in 15 minutes)',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          },
          refreshToken: {
            type: 'string',
            description: 'JWT refresh token (expires in 7 days)',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          },
          expiresAt: {
            type: 'integer',
            description: 'Access token expiration timestamp (milliseconds)',
            example: 1696000000000
          },
          refreshExpiresAt: {
            type: 'integer',
            description: 'Refresh token expiration timestamp (milliseconds)',
            example: 1696604800000
          },
          user: {
            $ref: '#/components/schemas/User'
          },
          message: {
            type: 'string',
            description: 'Success message',
            example: 'Login successful'
          }
        }
      },

      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Valid refresh token',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          }
        }
      },

      // Teaching Schema
      Teaching: {
        type: 'object',
        required: ['id', 'title', 'content', 'excerpt', 'category', 'author', 'language'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique teaching identifier',
            example: 'teaching_123'
          },
          title: {
            type: 'string',
            description: 'Teaching title',
            example: 'The Path of Divine Love'
          },
          content: {
            type: 'string',
            description: 'Full teaching content',
            example: 'Sant Kabir teaches us that...'
          },
          excerpt: {
            type: 'string',
            description: 'Brief summary of the teaching',
            example: 'Discover the essence of divine love...'
          },
          category: {
            type: 'string',
            enum: ['Philosophy', 'Unity', 'Spirituality', 'Meditation', 'Life', 'Devotion'],
            description: 'Teaching category',
            example: 'Philosophy'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Teaching tags for categorization',
            example: ['love', 'devotion', 'spirituality']
          },
          author: {
            type: 'string',
            description: 'Teaching author',
            example: 'Sant Kabir Das'
          },
          language: {
            type: 'string',
            enum: ['en', 'hi', 'ne'],
            description: 'Content language',
            example: 'en'
          },
          published: {
            type: 'boolean',
            description: 'Whether the teaching is published',
            example: true
          },
          featured: {
            type: 'boolean',
            description: 'Whether the teaching is featured',
            example: false
          },
          slug: {
            type: 'string',
            description: 'URL-friendly identifier',
            example: 'path-of-divine-love'
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Publication timestamp',
            example: '2024-09-29T10:00:00Z'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2024-09-29T10:00:00Z'
          }
        }
      },

      // Event Schema
      Event: {
        type: 'object',
        required: ['id', 'title', 'description', 'location', 'startDate', 'endDate', 'type'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique event identifier',
            example: 'event_123'
          },
          title: {
            type: 'string',
            description: 'Event title',
            example: 'Weekly Satsang'
          },
          description: {
            type: 'string',
            description: 'Event description',
            example: 'Join us for our weekly spiritual gathering...'
          },
          location: {
            type: 'string',
            description: 'Event location',
            example: 'Community Hall, Kabir Ashram'
          },
          virtualLink: {
            type: 'string',
            format: 'uri',
            description: 'Virtual meeting link (if applicable)',
            example: 'https://meet.example.com/kabir-satsang'
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Event start date and time',
            example: '2024-10-01T06:00:00Z'
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Event end date and time',
            example: '2024-10-01T08:00:00Z'
          },
          type: {
            type: 'string',
            enum: ['meditation', 'satsang', 'festival', 'discourse', 'music', 'workshop'],
            description: 'Event type',
            example: 'satsang'
          },
          maxAttendees: {
            type: 'integer',
            description: 'Maximum number of attendees',
            example: 100
          },
          currentAttendees: {
            type: 'integer',
            description: 'Current number of registered attendees',
            example: 45
          },
          registrationRequired: {
            type: 'boolean',
            description: 'Whether registration is required',
            example: false
          },
          featured: {
            type: 'boolean',
            description: 'Whether the event is featured',
            example: true
          }
        }
      },

      // Search Result Schema
      SearchResult: {
        type: 'object',
        required: ['results', 'total', 'query'],
        properties: {
          results: {
            type: 'array',
            items: {
              oneOf: [
                { $ref: '#/components/schemas/Teaching' },
                { $ref: '#/components/schemas/Event' }
              ]
            },
            description: 'Array of search results'
          },
          total: {
            type: 'integer',
            description: 'Total number of results',
            example: 25
          },
          query: {
            type: 'string',
            description: 'Original search query',
            example: 'divine love'
          },
          teachingsCount: {
            type: 'integer',
            description: 'Number of teaching results',
            example: 15
          },
          eventsCount: {
            type: 'integer',
            description: 'Number of event results',
            example: 10
          }
        }
      },

      // Pagination Schema
      PaginationMeta: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            minimum: 1,
            description: 'Current page number',
            example: 1
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Number of items per page',
            example: 10
          },
          total: {
            type: 'integer',
            description: 'Total number of items',
            example: 50
          },
          totalPages: {
            type: 'integer',
            description: 'Total number of pages',
            example: 5
          },
          hasNext: {
            type: 'boolean',
            description: 'Whether there are more pages',
            example: true
          },
          hasPrev: {
            type: 'boolean',
            description: 'Whether there are previous pages',
            example: false
          }
        }
      }
    },

    parameters: {
      LimitParam: {
        name: 'limit',
        in: 'query',
        description: 'Number of items to return (1-100)',
        required: false,
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10
        }
      },
      OffsetParam: {
        name: 'offset',
        in: 'query',
        description: 'Number of items to skip',
        required: false,
        schema: {
          type: 'integer',
          minimum: 0,
          default: 0
        }
      },
      ApiVersionHeader: {
        name: 'X-API-Version',
        in: 'header',
        description: 'API version to use',
        required: false,
        schema: {
          type: 'string',
          enum: ['v1', 'v2'],
          default: 'v1'
        }
      }
    },

    responses: {
      UnauthorizedError: {
        description: 'Authentication required',
        content: {
          'application/problem+json': {
            schema: {
              $ref: '#/components/schemas/ProblemDetails'
            },
            example: {
              type: 'https://kabirsantsharan.com/errors/missing-authorization',
              title: 'Missing Authorization',
              status: 401,
              detail: 'Authorization header with Bearer token is required',
              instance: '/api/protected-endpoint',
              timestamp: '2024-09-29T10:00:00Z',
              traceId: 'abc123'
            }
          }
        }
      },
      ValidationError: {
        description: 'Invalid request data',
        content: {
          'application/problem+json': {
            schema: {
              $ref: '#/components/schemas/ProblemDetails'
            },
            example: {
              type: 'https://kabirsantsharan.com/errors/validation-error',
              title: 'Validation Error',
              status: 400,
              detail: 'The request contains invalid data',
              instance: '/api/auth/login',
              timestamp: '2024-09-29T10:00:00Z',
              traceId: 'abc123',
              errors: [
                {
                  field: 'email',
                  message: 'Invalid email address',
                  code: 'invalid_email'
                }
              ]
            }
          }
        }
      },
      RateLimitError: {
        description: 'Rate limit exceeded',
        headers: {
          'X-RateLimit-Limit': {
            description: 'Request limit per time window',
            schema: { type: 'integer' }
          },
          'X-RateLimit-Remaining': {
            description: 'Remaining requests in current window',
            schema: { type: 'integer' }
          },
          'Retry-After': {
            description: 'Seconds to wait before retrying',
            schema: { type: 'integer' }
          }
        },
        content: {
          'application/problem+json': {
            schema: {
              $ref: '#/components/schemas/ProblemDetails'
            }
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and token management'
    },
    {
      name: 'Teachings',
      description: 'Spiritual teachings and content management'
    },
    {
      name: 'Events',
      description: 'Events and gatherings management'
    },
    {
      name: 'Search',
      description: 'Content search and discovery'
    },
    {
      name: 'Media',
      description: 'Media file management and streaming'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/app/api/**/*.ts',  // API route files
    './src/lib/**/*.ts'       // Library files with JSDoc
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;