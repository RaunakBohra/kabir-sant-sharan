/**
 * API Versioning Strategy
 * Implements semantic versioning for API endpoints
 * Supports multiple versioning strategies: URL path, headers, query parameters
 */

import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from './error-handler';

export type ApiVersion = 'v1' | 'v2';

export interface VersionConfig {
  version: ApiVersion;
  isDefault: boolean;
  isDeprecated: boolean;
  deprecationDate?: string;
  sunsetDate?: string;
  migrationGuide?: string;
}

/**
 * Supported API versions configuration
 */
export const API_VERSIONS: Record<ApiVersion, VersionConfig> = {
  v1: {
    version: 'v1',
    isDefault: true,
    isDeprecated: false
  },
  v2: {
    version: 'v2',
    isDefault: false,
    isDeprecated: false
  }
};

/**
 * Extract API version from request
 * Supports multiple versioning strategies:
 * 1. URL path: /api/v1/endpoint
 * 2. Accept header: application/vnd.kabirsantsharan.v1+json
 * 3. Custom header: X-API-Version: v1
 * 4. Query parameter: ?version=v1
 */
export function extractApiVersion(request: NextRequest): {
  version: ApiVersion;
  source: 'path' | 'header' | 'query' | 'default';
} {
  const url = new URL(request.url);

  // 1. Check URL path (/api/v1/...)
  const pathMatch = url.pathname.match(/^\/api\/(v\d+)\//);
  if (pathMatch) {
    const version = pathMatch[1] as ApiVersion;
    if (version in API_VERSIONS) {
      return { version, source: 'path' };
    }
  }

  // 2. Check Accept header (application/vnd.kabirsantsharan.v1+json)
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader) {
    const versionMatch = acceptHeader.match(/application\/vnd\.kabirsantsharan\.(v\d+)\+json/);
    if (versionMatch) {
      const version = versionMatch[1] as ApiVersion;
      if (version in API_VERSIONS) {
        return { version, source: 'header' };
      }
    }
  }

  // 3. Check X-API-Version header
  const versionHeader = request.headers.get('x-api-version');
  if (versionHeader && versionHeader in API_VERSIONS) {
    return { version: versionHeader as ApiVersion, source: 'header' };
  }

  // 4. Check query parameter
  const versionQuery = url.searchParams.get('version');
  if (versionQuery && versionQuery in API_VERSIONS) {
    return { version: versionQuery as ApiVersion, source: 'query' };
  }

  // 5. Return default version
  const defaultVersion = Object.values(API_VERSIONS).find(v => v.isDefault)?.version || 'v1';
  return { version: defaultVersion, source: 'default' };
}

/**
 * Add versioning headers to response
 */
export function addVersioningHeaders(
  response: NextResponse,
  version: ApiVersion,
  request: NextRequest
): NextResponse {
  const config = API_VERSIONS[version];

  // Add version information headers
  response.headers.set('X-API-Version', version);
  response.headers.set('X-API-Supported-Versions', Object.keys(API_VERSIONS).join(', '));

  // Add deprecation warnings
  if (config.isDeprecated) {
    response.headers.set('Deprecation', config.deprecationDate || 'true');

    if (config.sunsetDate) {
      response.headers.set('Sunset', config.sunsetDate);
    }

    if (config.migrationGuide) {
      response.headers.set('Link', `<${config.migrationGuide}>; rel="migration-guide"`);
    }

    // Add warning header (RFC 7234)
    response.headers.set(
      'Warning',
      `299 - "API version ${version} is deprecated. Please upgrade to the latest version."`
    );
  }

  return response;
}

/**
 * Create versioned API route handler
 */
export function createVersionedHandler<T = any>(handlers: {
  [K in ApiVersion]?: (request: NextRequest, ...args: any[]) => Promise<NextResponse | T>;
}) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const { version, source } = extractApiVersion(request);
    const handler = handlers[version];

    if (!handler) {
      return createErrorResponse('VALIDATION_ERROR', {
        instance: new URL(request.url).pathname,
        detail: `API version ${version} is not supported for this endpoint`,
        metadata: {
          requestedVersion: version,
          supportedVersions: Object.keys(handlers),
          versionSource: source
        }
      });
    }

    try {
      const result = await handler(request, ...args);

      // If result is already a NextResponse, add versioning headers
      if (result instanceof NextResponse) {
        return addVersioningHeaders(result, version, request);
      }

      // Otherwise, wrap result in NextResponse with versioning headers
      const response = NextResponse.json(result);
      return addVersioningHeaders(response, version, request);

    } catch (error) {
      console.error(`Error in API ${version} handler:`, error);
      return createErrorResponse('INTERNAL_SERVER_ERROR', {
        instance: new URL(request.url).pathname,
        metadata: { version, source }
      });
    }
  };
}

/**
 * Version-specific response transformers
 */
export const responseTransformers = {
  /**
   * Transform v1 response format
   */
  v1: <T>(data: T, meta?: any): any => ({
    data,
    meta: {
      version: 'v1',
      timestamp: new Date().toISOString(),
      ...meta
    }
  }),

  /**
   * Transform v2 response format (enhanced with pagination, etc.)
   */
  v2: <T>(data: T, meta?: any): any => ({
    result: data,
    metadata: {
      version: 'v2',
      requestId: meta?.traceId,
      timestamp: new Date().toISOString(),
      pagination: meta?.pagination,
      ...meta
    },
    links: meta?.links || {}
  })
};

/**
 * Common API response interface for consistency
 */
export interface ApiResponse<T = any> {
  data?: T;
  result?: T;
  meta?: {
    version: string;
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    [key: string]: any;
  };
  metadata?: any;
  links?: {
    self?: string;
    next?: string;
    prev?: string;
    [key: string]: string | undefined;
  };
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

/**
 * Create paginated response with version-specific format
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  version: ApiVersion,
  baseUrl: string
): ApiResponse<T[]> {
  const hasNext = (page * limit) < total;
  const hasPrev = page > 1;

  const pagination = {
    page,
    limit,
    total,
    hasNext,
    hasPrev,
    totalPages: Math.ceil(total / limit)
  };

  const links: Record<string, string> = {
    self: `${baseUrl}?page=${page}&limit=${limit}`
  };

  if (hasNext) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }

  if (hasPrev) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }

  return responseTransformers[version](items, { pagination, links });
}

/**
 * Middleware for API versioning
 */
export function withVersioning(
  handler: (request: NextRequest, version: ApiVersion) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { version } = extractApiVersion(request);

    try {
      const response = await handler(request, version);
      return addVersioningHeaders(response, version, request);
    } catch (error) {
      console.error('Versioning middleware error:', error);
      return createErrorResponse('INTERNAL_SERVER_ERROR', {
        instance: new URL(request.url).pathname,
        metadata: { version }
      });
    }
  };
}

/**
 * Error types for API versioning
 */
export const VERSIONING_ERRORS = {
  UNSUPPORTED_API_VERSION: {
    type: 'https://kabirsantsharan.com/errors/unsupported-api-version',
    title: 'Unsupported API Version',
    status: 400
  }
} as const;