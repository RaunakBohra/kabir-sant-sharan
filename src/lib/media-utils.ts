/**
 * Extract product name from R2 key filename
 * @param r2Key - The R2 storage key (e.g., "audio/1759209326306-02hkyq-Sati-Pathan-Din-4.mp3")
 * @returns The extracted product name (e.g., "Sati Pathan Din 4")
 */
export function extractProductNameFromR2Key(r2Key: string): string {
  // Extract filename from path
  const filename = r2Key.split('/').pop() || '';

  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  // Extract product name after timestamp and random ID
  // Pattern: timestamp-randomId-productName
  const parts = nameWithoutExt.split('-');

  if (parts.length >= 3) {
    // Join all parts after the first two (timestamp and random ID)
    const productName = parts.slice(2).join('-');

    // Replace hyphens with spaces and capitalize words
    return productName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  // Fallback: return the original filename without extension
  return nameWithoutExt.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration for display
 */
export function formatDuration(duration?: string): string {
  if (!duration) return '';

  // If already formatted, return as is
  if (duration.includes(':')) return duration;

  // If it's seconds, format to MM:SS
  const seconds = parseInt(duration);
  if (!isNaN(seconds)) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return duration;
}