// R2 Streaming utility functions
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.NODE_ENV === 'production' ? process.env.R2_BUCKET_NAME! : process.env.R2_BUCKET_DEV!;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

/**
 * Generate signed URL for R2 object with streaming support
 */
export async function generateSignedStreamingUrl(
  objectKey: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate streaming URL');
  }
}

/**
 * Check if object exists in R2
 */
export async function checkObjectExists(objectKey: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });

    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get object metadata from R2
 */
export async function getObjectMetadata(objectKey: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });

    const response = await s3Client.send(command);
    return {
      contentLength: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
      etag: response.ETag,
    };
  } catch (error) {
    console.error('Error getting object metadata:', error);
    return null;
  }
}