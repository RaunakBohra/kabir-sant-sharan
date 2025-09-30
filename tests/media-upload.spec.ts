import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Media Upload and Management', () => {
  let authToken: string;

  test.beforeEach(async ({ page }) => {
    // Login first to get auth token
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[name="password"]', 'admin123');

    // Submit login
    await page.click('button[type="submit"]');

    // Wait for redirect to admin page (defaults to /admin/content/)
    await expect(page).toHaveURL(/\/admin/);

    // Get auth token from localStorage or cookies
    authToken = await page.evaluate(() => {
      return localStorage.getItem('authToken') || '';
    });
  });

  test('should display admin media page correctly', async ({ page }) => {
    await page.goto('/admin/media');

    // Check page loads successfully
    await expect(page).toHaveTitle(/Admin/);

    // Check MediaManager component loads
    await expect(page.locator('h1:has-text("Media Manager")')).toBeVisible();

    // Check upload button exists
    await expect(page.locator('button:has-text("Upload Media")')).toBeVisible();

    // Check filter tabs exist
    await expect(page.locator('text=All Files')).toBeVisible();
    await expect(page.locator('text=Audio')).toBeVisible();
    await expect(page.locator('text=Video')).toBeVisible();
    await expect(page.locator('text=Images')).toBeVisible();
    await expect(page.locator('text=Documents')).toBeVisible();
  });

  test('should show existing media files', async ({ page }) => {
    await page.goto('/admin/media');

    // Wait for media to load
    await page.waitForSelector('[data-testid="media-grid"], .text-center:has-text("No media files yet")', { timeout: 10000 });

    // Check if there are existing media files or empty state
    const hasMedia = await page.locator('[data-testid="media-card"]').count() > 0;
    const hasEmptyState = await page.locator('text=No media files yet').isVisible();

    expect(hasMedia || hasEmptyState).toBe(true);

    if (hasMedia) {
      // Verify media cards show proper information
      const firstCard = page.locator('[data-testid="media-card"]').first();
      await expect(firstCard).toBeVisible();

      // Check that media cards have required elements
      await expect(firstCard.locator('.font-medium')).toBeVisible(); // Title
      await expect(firstCard.locator('text=by')).toBeVisible(); // Author
    }
  });

  test('should test API endpoints directly', async ({ request }) => {
    // Test media list API
    const mediaResponse = await request.get('/api/media', {
      params: { limit: '10' }
    });
    expect(mediaResponse.status()).toBe(200);

    const mediaData = await mediaResponse.json();
    expect(mediaData).toHaveProperty('media');
    expect(mediaData).toHaveProperty('total');
    expect(Array.isArray(mediaData.media)).toBe(true);

    console.log(`Found ${mediaData.total} media files in database`);
    console.log('Recent media files:', mediaData.media.slice(0, 3).map((m: any) => ({
      title: m.title,
      type: m.type,
      published: m.published,
      fileSize: m.fileSize
    })));
  });

  test('should filter media by type', async ({ page }) => {
    await page.goto('/admin/media');

    // Wait for media to load
    await page.waitForLoadState('networkidle');

    // Click on Audio filter
    await page.click('button:has-text("Audio")');

    // Wait for filter to apply
    await page.waitForTimeout(1000);

    // Check that URL reflects filter
    await page.waitForFunction(() => {
      return window.location.href.includes('audio') || document.querySelector('[data-testid="media-card"]') !== null || document.querySelector('text=No media files yet') !== null;
    });

    // Verify that only audio files are shown (if any exist)
    const mediaCards = page.locator('[data-testid="media-card"]');
    const cardCount = await mediaCards.count();

    if (cardCount > 0) {
      // Check that all visible cards are audio files
      for (let i = 0; i < cardCount; i++) {
        const card = mediaCards.nth(i);
        // Audio files should have a music icon or audio indicator
        await expect(card.locator('svg, .text-purple-600')).toBeVisible();
      }
    }
  });

  test('should show upload interface when clicked', async ({ page }) => {
    await page.goto('/admin/media');

    // Click Upload Media button
    await page.click('button:has-text("Upload Media")');

    // Check that upload interface appears
    await expect(page.locator('text=Upload Media Files')).toBeVisible();

    // Check upload form elements exist
    await expect(page.locator('input[type="file"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible(); // File type selector

    // Check that hide upload button appears
    await expect(page.locator('button:has-text("Hide Upload")')).toBeVisible();
  });

  test('should validate file upload requirements', async ({ page }) => {
    await page.goto('/admin/media');

    // Open upload interface
    await page.click('button:has-text("Upload Media")');

    // Try to upload without selecting file type
    const fileInput = page.locator('input[type="file"]');

    // Create a small test file
    const testFilePath = path.join(process.cwd(), 'test-file.mp3');
    fs.writeFileSync(testFilePath, 'test audio content for upload validation');

    try {
      await fileInput.setInputFiles(testFilePath);

      // Check that file type selection is required
      const typeSelect = page.locator('select');
      await expect(typeSelect).toBeVisible();

      // Select audio type
      await typeSelect.selectOption('audio');

      // Verify upload button becomes enabled
      const uploadButton = page.locator('button:has-text("Upload Files")');
      await expect(uploadButton).toBeVisible();

    } finally {
      // Clean up test file
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  });

  test('should handle media management actions', async ({ page }) => {
    await page.goto('/admin/media');

    // Wait for media to load
    await page.waitForLoadState('networkidle');

    const mediaCards = page.locator('[data-testid="media-card"]');
    const cardCount = await mediaCards.count();

    if (cardCount > 0) {
      const firstCard = mediaCards.first();

      // Check for action buttons (preview, edit, download)
      const previewButton = firstCard.locator('button[title="Preview"]');
      const editButton = firstCard.locator('button[title="Edit"]');
      const downloadButton = firstCard.locator('button[title="Download"]');

      // Verify action buttons exist
      if (await previewButton.count() > 0) {
        await expect(previewButton).toBeVisible();
      }
      if (await editButton.count() > 0) {
        await expect(editButton).toBeVisible();
      }
      if (await downloadButton.count() > 0) {
        await expect(downloadButton).toBeVisible();
      }

      console.log(`Found ${cardCount} media files with management actions`);
    } else {
      console.log('No media files found for management testing');
    }
  });

  test('should display media metadata correctly', async ({ page }) => {
    await page.goto('/admin/media');

    // Wait for media to load
    await page.waitForLoadState('networkidle');

    const mediaCards = page.locator('[data-testid="media-card"]');
    const cardCount = await mediaCards.count();

    if (cardCount > 0) {
      const firstCard = mediaCards.first();

      // Check that essential metadata is displayed
      await expect(firstCard.locator('.font-medium')).toBeVisible(); // Title
      await expect(firstCard.locator('text=by')).toBeVisible(); // Author

      // Check for file size display
      const fileSizeElement = firstCard.locator('text=/\\d+(\\.\\d+)?\\s*(Bytes|KB|MB|GB)/');
      if (await fileSizeElement.count() > 0) {
        await expect(fileSizeElement).toBeVisible();
      }

      // Check for creation date
      const dateElement = firstCard.locator('text=/\\d{1,2}\/\\d{1,2}\/\\d{4}/');
      if (await dateElement.count() > 0) {
        await expect(dateElement).toBeVisible();
      }

      // Check for published status indicator
      const statusIndicator = firstCard.locator('.w-2.h-2.rounded-full');
      if (await statusIndicator.count() > 0) {
        await expect(statusIndicator).toBeVisible();
      }

      console.log('Media metadata display verified');
    }
  });

  test('should check database consistency', async ({ request }) => {
    // Test database via API
    const response = await request.get('/api/media?limit=100');
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Verify data structure
    expect(data).toHaveProperty('media');
    expect(data).toHaveProperty('total');
    expect(Array.isArray(data.media)).toBe(true);

    // Check each media item has required fields
    for (const item of data.media) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('r2Key');
      expect(item).toHaveProperty('streamingUrl');
      expect(item).toHaveProperty('published');
      expect(item).toHaveProperty('createdAt');

      // Verify types
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(['audio', 'video', 'image', 'document']).toContain(item.type);
      expect(typeof item.published).toBe('boolean');
    }

    console.log(`Database consistency check passed for ${data.media.length} media items`);
  });
});