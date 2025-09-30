const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Go to login page
    console.log('1. Going to login page...');
    await page.goto('http://localhost:5002/login');
    await page.waitForLoadState('networkidle');

    // Login
    console.log('2. Logging in...');
    await page.fill('input[name="email"]', 'admin@kabirsantsharan.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForTimeout(3000);
    console.log('3. Current URL after login:', page.url());

    // Go to admin media page
    console.log('4. Going to admin/media page...');
    await page.goto('http://localhost:5002/admin/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('5. Current URL:', page.url());

    // Check if Media Manager is visible
    const mediaManagerTitle = await page.locator('h1:has-text("Media Manager")');
    const isVisible = await mediaManagerTitle.isVisible();
    console.log('6. Media Manager title visible:', isVisible);

    // Check for media cards
    const mediaCards = await page.locator('[data-testid="media-card"]').count();
    console.log('7. Number of media cards found:', mediaCards);

    // Check for "No media files yet" message
    const noMediaMessage = await page.locator('text=No media files yet').isVisible();
    console.log('8. "No media files yet" message visible:', noMediaMessage);

    // Check network requests
    const mediaGridElement = await page.locator('[data-testid="media-grid"]').isVisible();
    console.log('9. Media grid element visible:', mediaGridElement);

    // Take a screenshot
    await page.screenshot({ path: 'admin-media-debug.png' });
    console.log('10. Screenshot saved as admin-media-debug.png');

    // Check console logs for errors
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  } catch (error) {
    console.error('Error during test:', error);
  }

  await page.waitForTimeout(5000); // Keep open for 5 seconds to see the page
  await browser.close();
})();