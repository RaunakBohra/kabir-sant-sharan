import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export interface R2UploadConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

export class R2UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(config: R2UploadConfig) {
    this.bucketName = config.bucketName;
    this.publicUrl = config.publicUrl;

    // Configure S3 client for Cloudflare R2
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Generate a unique storage key for the file
   */
  generateKey(
    originalName: string,
    type: 'audio' | 'video' | 'image' | 'document'
  ): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const baseName = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 50); // Limit basename length

    return `${type}/${timestamp}-${randomString}-${baseName}.${extension}`;
  }

  /**
   * Upload a file to R2
   */
  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: metadata,
        CacheControl: 'public, max-age=31536000', // 1 year cache
      });

      await this.s3Client.send(command);

      return {
        success: true,
        url: `${this.publicUrl}/${key}`,
        key: key,
      };
    } catch (error) {
      console.error('R2 upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);

      return { success: true };
    } catch (error) {
      console.error('R2 delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  /**
   * Get public URL for a file
   */
  getFileUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}

/**
 * Create R2 upload service instance from environment variables
 */
export function createR2UploadService(): R2UploadService {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'kabir-media';
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.kabirsantsharan.com';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing R2 configuration. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables.'
    );
  }

  return new R2UploadService({
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
  });
}