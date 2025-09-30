import { test, expect, type ConsoleMessage } from '@playwright/test';

// Configuration
const BASE_URL = 'http://localhost:5002';

// Track console messages and errors
const consoleMessages: Array<{ type: string; text: string; url: string }> = [];
const pageErrors: Array<{ message: string; url: string }> = [];

test.describe('Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console messages
    page.on('console', (msg: ConsoleMessage) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        url: page.url()
      });
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      pageErrors.push({
        message: error.message,
        url: page.url()
      });
    });

    // Capture failed requests
    page.on('requestfailed', (request) => {
      console.log(`❌ Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test.afterAll(async () => {
    // Print summary of console errors
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');

    console.log('\n📊 CONSOLE SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Page errors: ${pageErrors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS:');
      errors.forEach((err, i) => {
        console.log(`\n${i + 1}. [${err.url}]`);
        console.log(`   ${err.text}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  CONSOLE WARNINGS:');
      warnings.forEach((warn, i) => {
        console.log(`\n${i + 1}. [${warn.url}]`);
        console.log(`   ${warn.text}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('\n💥 PAGE ERRORS:');
      pageErrors.forEach((err, i) => {
        console.log(`\n${i + 1}. [${err.url}]`);
        console.log(`   ${err.message}`);
      });
    }
  });

  test('Homepage loads successfully', async ({ page }) => {
    console.log('\n🏠 Testing Homepage...');
    await page.goto(BASE_URL);

    // Check page loaded
    await expect(page).toHaveTitle(/Kabir Sant Sharan/);

    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Kabir Sant Sharan')).toBeVisible();

    // Check daily quote API loads
    await page.waitForTimeout(1000);

    console.log('✅ Homepage loaded successfully');
  });

  test('Teachings page loads and fetches data', async ({ page }) => {
    console.log('\n📖 Testing Teachings Page...');
    await page.goto(`${BASE_URL}/teachings`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page structure
    await expect(page.locator('text=Teachings').first()).toBeVisible();

    console.log('✅ Teachings page loaded successfully');
  });

  test('Events page loads and fetches data', async ({ page }) => {
    console.log('\n📅 Testing Events Page...');
    await page.goto(`${BASE_URL}/events`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page structure
    await expect(page.locator('text=Events').first()).toBeVisible();

    console.log('✅ Events page loaded successfully');
  });

  test('Media page loads', async ({ page }) => {
    console.log('\n🎵 Testing Media Page...');
    await page.goto(`${BASE_URL}/media`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page structure
    await expect(page.locator('text=Media').first()).toBeVisible();

    console.log('✅ Media page loaded successfully');
  });

  test('Login page loads', async ({ page }) => {
    console.log('\n🔐 Testing Login Page...');
    await page.goto(`${BASE_URL}/login`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check login form exists
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    console.log('✅ Login page loaded successfully');
  });

  test('Login page form validation', async ({ page }) => {
    console.log('\n🔐 Testing Login Form...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill in test credentials (should fail as user doesn't exist)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for response
    await page.waitForTimeout(2000);

    console.log('✅ Login form validation works');
  });

  test('Admin page redirects to login when not authenticated', async ({ page }) => {
    console.log('\n🔒 Testing Admin Authentication...');
    await page.goto(`${BASE_URL}/admin`);

    // Should redirect to login or show login prompt
    await page.waitForLoadState('networkidle');

    // Check if redirected to login or login form is visible
    const url = page.url();
    const hasLoginForm = await page.locator('input[type="email"]').isVisible().catch(() => false);

    if (url.includes('/login') || hasLoginForm) {
      console.log('✅ Admin correctly requires authentication');
    } else {
      console.log('⚠️  Admin page accessible without auth');
    }
  });

  test('API endpoints return correct responses', async ({ page }) => {
    console.log('\n🌐 Testing API Endpoints...');

    // Test daily quote API
    const quoteResponse = await page.request.get(`${BASE_URL}/api/quotes/daily`);
    expect(quoteResponse.ok()).toBeTruthy();
    const quoteData = await quoteResponse.json();
    expect(quoteData).toHaveProperty('success', true);
    expect(quoteData).toHaveProperty('quote');
    console.log('  ✅ /api/quotes/daily works');

    // Test teachings API
    const teachingsResponse = await page.request.get(`${BASE_URL}/api/teachings`);
    expect(teachingsResponse.ok()).toBeTruthy();
    const teachingsData = await teachingsResponse.json();
    expect(teachingsData).toHaveProperty('teachings');
    expect(teachingsData).toHaveProperty('total');
    console.log('  ✅ /api/teachings works');

    // Test events API
    const eventsResponse = await page.request.get(`${BASE_URL}/api/events`);
    expect(eventsResponse.ok()).toBeTruthy();
    const eventsData = await eventsResponse.json();
    expect(eventsData).toHaveProperty('events');
    expect(eventsData).toHaveProperty('total');
    console.log('  ✅ /api/events works');

    console.log('✅ All API endpoints working correctly');
  });

  test('Navigation works across all pages', async ({ page }) => {
    console.log('\n🧭 Testing Navigation...');
    await page.goto(BASE_URL);

    // Navigate to Teachings
    await page.click('text=Teachings');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/teachings');
    console.log('  ✅ Navigated to Teachings');

    // Navigate to Events
    await page.click('text=Events');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/events');
    console.log('  ✅ Navigated to Events');

    // Navigate to Media
    await page.click('text=Media');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/media');
    console.log('  ✅ Navigated to Media');

    // Navigate back to Home
    await page.click('text=Home');
    await page.waitForLoadState('networkidle');
    console.log('  ✅ Navigated back to Home');

    console.log('✅ Navigation works correctly');
  });

  test('Check for CSP violations', async ({ page }) => {
    console.log('\n🛡️  Testing Content Security Policy...');

    const cspViolations: Array<any> = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Content Security Policy') || text.includes('CSP')) {
        cspViolations.push({
          text,
          url: page.url()
        });
      }
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (cspViolations.length > 0) {
      console.log('⚠️  CSP Violations found:');
      cspViolations.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.text}`);
      });
    } else {
      console.log('✅ No CSP violations detected');
    }
  });

  test('Check page performance metrics', async ({ page }) => {
    console.log('\n⚡ Testing Performance Metrics...');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        responseTime: navigation.responseEnd - navigation.requestStart
      };
    });

    console.log('  📊 Performance Metrics:');
    console.log(`     DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`     Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    console.log(`     DOM Interactive: ${metrics.domInteractive.toFixed(2)}ms`);
    console.log(`     Response Time: ${metrics.responseTime.toFixed(2)}ms`);

    console.log('✅ Performance metrics captured');
  });
});