export interface R2StorageConfig {
  bucket: R2Bucket;
  publicUrl: string;
}

export class R2MediaStorage {
  private bucket: R2Bucket;
  private publicUrl: string;

  constructor(bucket: R2Bucket, publicUrl: string = 'https://media.kabirsantsharan.com') {
    this.bucket = bucket;
    this.publicUrl = publicUrl;
  }

  async uploadFile(
    file: File | ArrayBuffer,
    key: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const buffer = file instanceof File ? await file.arrayBuffer() : file;

      const object = await this.bucket.put(key, buffer, {
        customMetadata: metadata,
        httpMetadata: {
          contentType: file instanceof File ? file.type : 'application/octet-stream',
          cacheControl: 'public, max-age=31536000', // 1 year cache
        },
      });

      if (object) {
        return {
          success: true,
          url: `${this.publicUrl}/${key}`
        };
      } else {
        return {
          success: false,
          error: 'Failed to upload file'
        };
      }
    } catch (error) {
      console.error('R2 upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.bucket.delete(key);
      return { success: true };
    } catch (error) {
      console.error('R2 delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getFileUrl(key: string): Promise<string> {
    return `${this.publicUrl}/${key}`;
  }

  async listFiles(prefix?: string, limit: number = 100): Promise<{
    files: Array<{ key: string; url: string; size: number; lastModified: Date }>;
    hasMore: boolean;
  }> {
    try {
      const objects = await this.bucket.list({
        prefix,
        limit
      });

      const files = objects.objects.map(obj => ({
        key: obj.key,
        url: `${this.publicUrl}/${obj.key}`,
        size: obj.size,
        lastModified: obj.uploaded
      }));

      return {
        files,
        hasMore: objects.truncated || false
      };
    } catch (error) {
      console.error('R2 list error:', error);
      return {
        files: [],
        hasMore: false
      };
    }
  }

  generateUploadKey(originalName: string, type: 'audio' | 'video' | 'image' | 'document'): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');

    return `${type}/${timestamp}-${randomString}-${baseName}.${extension}`;
  }
}

// Worker environment type for R2
export interface CloudflareEnv {
  MEDIA_BUCKET: R2Bucket;
  ENVIRONMENT: string;
}

export function createR2Storage(env: CloudflareEnv): R2MediaStorage {
  return new R2MediaStorage(
    env.MEDIA_BUCKET,
    env.ENVIRONMENT === 'production'
      ? 'https://media.kabirsantsharan.com'
      : 'https://dev-media.kabirsantsharan.com'
  );
}