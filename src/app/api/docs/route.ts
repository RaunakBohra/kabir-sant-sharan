/**
 * OpenAPI Documentation Endpoint
 * Serves interactive Swagger UI for API documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import swaggerSpec from '@/lib/openapi-spec';

export const runtime = 'nodejs';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the complete OpenAPI 3.1.0 specification for the API
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: OpenAPI specification in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI 3.1.0 specification
 */
export async function GET(request: NextRequest) {
  try {
    // Add CORS headers for documentation access
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    };

    return NextResponse.json(swaggerSpec, { headers });

  } catch (error) {
    console.error('Error serving API documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}