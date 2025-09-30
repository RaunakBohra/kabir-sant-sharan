import { NextRequest, NextResponse } from 'next/server';
import { generateSignedStreamingUrl, getObjectMetadata } from '@/lib/r2-streaming';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use direct SQLite connection
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'local.db');
    const db = new Database(dbPath);

    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(params.id);

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Get range header for video/audio seeking
    const range = request.headers.get('range');

    // For R2, you'd fetch the file and proxy it
    // This is a simplified example - you'd need R2 SDK integration

    if (media.r2_key.startsWith('sample/')) {
      db.close();
      // Local files - serve directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/media/${media.r2_key}`);

      if (!response.ok) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';

      // Handle range requests for media streaming
      if (range) {
        const contentLength = parseInt(response.headers.get('content-length') || '0');
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
        const chunksize = (end - start) + 1;

        return new NextResponse(response.body, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${contentLength}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize.toString(),
            'Content-Type': contentType,
          },
        });
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
        },
      });
    }

    // For R2 files, generate signed streaming URL
    try {
      const streamingUrl = await generateSignedStreamingUrl(media.r2_key);
      db.close();

      // Fetch the file from R2 using signed URL
      const response = await fetch(streamingUrl, {
        headers: range ? { Range: range } : {}
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'File not found in R2' }, { status: 404 });
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';

      // Handle range requests for media streaming
      if (range && response.status === 206) {
        return new NextResponse(response.body, {
          status: 206,
          headers: {
            'Content-Range': response.headers.get('content-range') || '',
            'Accept-Ranges': 'bytes',
            'Content-Length': response.headers.get('content-length') || '',
            'Content-Type': contentType,
          },
        });
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Content-Length': response.headers.get('content-length') || '',
        },
      });
    } catch (error) {
      console.error('R2 streaming error:', error);
      db.close();
      return NextResponse.json({ error: 'R2 streaming failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json({ error: 'Streaming failed' }, { status: 500 });
  }
}