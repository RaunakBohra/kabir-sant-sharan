import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import Database from 'better-sqlite3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'local.db');
    const db = new Database(dbPath);

    try {
      const selectStmt = db.prepare(`SELECT * FROM media WHERE id = ? AND deleted_at IS NULL`);
      const media = selectStmt.get(id);

      if (!media) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }

      return NextResponse.json(media);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Simple auth check - in production you'd want proper JWT verification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json() as {
      title?: string;
      description?: string;
      author?: string;
      category?: string;
      tags?: string;
      language?: string;
      featured?: boolean;
      published?: boolean;
    };
    const { title, description, author, category, tags, language, featured, published } = body;

    // Use direct SQLite connection (not Drizzle ORM)
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'local.db');
    const db = new Database(dbPath);

    try {
      // Update media record using raw SQL
      const updateStmt = db.prepare(`
        UPDATE media
        SET title = ?, description = ?, author = ?, category = ?, tags = ?,
            language = ?, featured = ?, published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const result = updateStmt.run(
        title,
        description,
        author,
        category,
        tags || '',
        language || 'en',
        featured ? 1 : 0,
        published ? 1 : 0,
        id
      );

      if (result.changes === 0) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }

      // Get updated media record
      const selectStmt = db.prepare(`SELECT * FROM media WHERE id = ?`);
      const updatedMedia = selectStmt.get(id);

      return NextResponse.json(updatedMedia);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Use direct SQLite connection
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'local.db');
    const db = new Database(dbPath);

    try {
      // Soft delete by setting deleted_at timestamp
      const deleteStmt = db.prepare(`
        UPDATE media
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `);

      const result = deleteStmt.run(id);

      if (result.changes === 0) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }

      db.close();
      return NextResponse.json({ message: 'Media deleted successfully' });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}