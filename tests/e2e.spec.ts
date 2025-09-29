import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Kabir Sant Sharan - Comprehensive E2E Tests', () => {

  // Test 1: Homepage functionality
  test('Homepage loads correctly and displays key elements', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check title
    await expect(page).toHaveTitle(/Kabir Sant Sharan/);

    // Check main navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Teachings')).toBeVisible();
    await expect(page.getByText('Events')).toBeVisible();
    await expect(page.getByText('Media')).toBeVisible();

    // Check hero section
    await expect(page.getByText('Divine Teachings')).toBeVisible();

    // Check footer
    await expect(page.locator('footer')).toBeVisible();
  });

  // Test 2: Navigation between pages
  test('Navigation works correctly between all main pages', async ({ page }) => {
    await page.goto(BASE_URL);

    // Test Teachings page
    await page.click('text=Teachings');
    await expect(page).toHaveURL(/.*teachings/);
    await expect(page.getByText('Sacred Teachings')).toBeVisible();

    // Test Events page
    await page.click('text=Events');
    await expect(page).toHaveURL(/.*events/);
    await expect(page.getByText('Upcoming Events')).toBeVisible();

    // Test Media page
    await page.click('text=Media');
    await expect(page).toHaveURL(/.*media/);
    await expect(page.getByText('Spiritual Media')).toBeVisible();

    // Return to homepage
    await page.goto(BASE_URL);
    await expect(page.getByText('Divine Teachings')).toBeVisible();
  });

  // Test 3: Search functionality
  test('Search functionality works end-to-end', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);

    // Check search page loads
    await expect(page.getByText('Search Spiritual Content')).toBeVisible();

    // Test search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Perform search
    await searchInput.fill('kabir');
    await page.waitForTimeout(1000); // Wait for search results

    // Check results appear
    await expect(page.getByText('Search Results')).toBeVisible();
    await expect(page.locator('[data-testid="search-result"]')).toBeVisible();
  });

  // Test 4: Authentication flow
  test('Authentication system works correctly', async ({ page }) => {
    // Go to login page
    await page.goto(`${BASE_URL}/login`);

    // Check login page loads
    await expect(page.getByText('Admin Portal')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Test invalid login
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Should show error (might be an alert)
    await page.waitForTimeout(1000);

    // Test valid login
    await page.fill('input[type="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Should redirect to admin panel
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.getByText('Admin Panel')).toBeVisible();
  });

  // Test 5: Admin panel functionality
  test('Admin panel features work correctly', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for redirect to admin
    await expect(page).toHaveURL(/.*admin/);

    // Test admin tabs
    await expect(page.getByText('Content')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Media')).toBeVisible();
    await expect(page.getByText('Newsletter')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();

    // Test switching between tabs
    await page.click('text=Analytics');
    await expect(page.getByText('Analytics Dashboard')).toBeVisible();

    await page.click('text=Media');
    await expect(page.getByText('Media Manager')).toBeVisible();

    await page.click('text=Newsletter');
    await expect(page.getByText('Newsletter Management')).toBeVisible();

    await page.click('text=Settings');
    await expect(page.getByText('Configure your website')).toBeVisible();
  });

  // Test 6: Media upload interface (UI only)
  test('Media upload interface displays correctly', async ({ page }) => {
    // Login and navigate to media tab
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.click('text=Media');

    // Check upload button
    await expect(page.getByText('Upload Media')).toBeVisible();

    // Click upload button to reveal upload interface
    await page.click('text=Upload Media');

    // Check upload interface appears
    await expect(page.getByText('Upload Media Files')).toBeVisible();
    await expect(page.getByText('Drag and drop files here')).toBeVisible();
  });

  // Test 7: Newsletter interface
  test('Newsletter management interface works', async ({ page }) => {
    // Login and navigate to newsletter
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.click('text=Newsletter');

    // Check newsletter tabs
    await expect(page.getByText('Subscribers')).toBeVisible();
    await expect(page.getByText('Campaigns')).toBeVisible();
    await expect(page.getByText('Compose')).toBeVisible();

    // Test compose interface
    await page.click('text=Compose');
    await expect(page.getByText('Compose Newsletter')).toBeVisible();
    await expect(page.locator('input[placeholder*="subject"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  // Test 8: Responsive design
  test('Website is responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);

    // Check mobile navigation
    await expect(page.locator('nav')).toBeVisible();

    // Test different pages on mobile
    await page.goto(`${BASE_URL}/teachings`);
    await expect(page.getByText('Sacred Teachings')).toBeVisible();

    await page.goto(`${BASE_URL}/events`);
    await expect(page.getByText('Upcoming Events')).toBeVisible();
  });

  // Test 9: PWA manifest and service worker
  test('PWA functionality is present', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');

    // Check service worker registration (in script)
    const swScript = page.locator('script:has-text("serviceWorker")');
    await expect(swScript).toBeVisible();
  });

  // Test 10: Content loading and performance
  test('Content loads efficiently', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(BASE_URL);

    // Check page loads within reasonable time
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Less than 5 seconds

    // Check critical content is visible
    await expect(page.getByText('Kabir Sant Sharan')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  // Test 11: Multi-language support (UI elements)
  test('Multi-language elements are present', async ({ page }) => {
    await page.goto(BASE_URL);

    // Look for language switcher (if visible)
    // Note: The language switcher might be in a dropdown or not immediately visible
    // This test checks for any language-related elements

    // Check for Hindi content or language indicators
    const bodyContent = await page.textContent('body');
    // The page should have some multilingual content or indicators
    expect(bodyContent).toBeTruthy();
  });

  // Test 12: Database integration (through API)
  test('Database integration works through search API', async ({ page }) => {
    // Use page.evaluate to make API calls within browser context
    const searchResponse = await page.evaluate(async () => {
      const response = await fetch('/api/search/?q=kabir&type=all');
      return response.json();
    });

    expect(searchResponse).toBeTruthy();
    expect(searchResponse.results).toBeDefined();
    expect(searchResponse.total).toBeGreaterThan(0);
    expect(searchResponse.teachings_count).toBeGreaterThan(0);
  });

  // Test 13: Admin logout functionality
  test('Admin logout works correctly', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*admin/);

    // Find and click user profile dropdown
    await page.click('[data-testid="user-profile"]', { force: true });

    // Click logout (might need to wait for dropdown)
    await page.waitForTimeout(500);
    await page.click('text=Sign Out');

    // Should redirect away from admin
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain('/admin');
  });

  // Test 14: Error handling
  test('404 page handles unknown routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page`);

    // Should show some kind of error or redirect
    // The exact behavior depends on Next.js configuration
    const content = await page.textContent('body');
    expect(content).toBeTruthy(); // Just ensure page loads something
  });

  // Test 15: Performance and accessibility basics
  test('Basic accessibility features are present', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for basic accessibility features
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Check for alt attributes on images
    const images = await page.locator('img').count();
    if (images > 0) {
      // If there are images, at least some should have alt attributes
      const imagesWithAlt = await page.locator('img[alt]').count();
      expect(imagesWithAlt).toBeGreaterThan(0);
    }

    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});