import { test, expect } from '@playwright/test';

test.describe('Comprehensive Pages Console Check', () => {
  let consoleMessages: Array<{ type: string; text: string; url: string }> = [];

  test.beforeEach(async ({ page }) => {
    consoleMessages = [];

    // Capture all console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        url: page.url()
      });
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`[${page.url()}] [${msg.type().toUpperCase()}]:`, msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      console.log(`[${page.url()}] [PAGE ERROR]:`, error.message);
      consoleMessages.push({
        type: 'error',
        text: error.message,
        url: page.url()
      });
    });
  });

  function printSummary(pageName: string) {
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');

    console.log(`\n=== ${pageName.toUpperCase()} ===`);
    console.log(`Total messages: ${consoleMessages.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);

    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log(`- ${e.text.substring(0, 200)}`));
    }

    if (warnings.length > 0) {
      console.log('\n=== WARNINGS ===');
      warnings.forEach(w => console.log(`- ${w.text.substring(0, 200)}`));
    }

    return { errors: errors.length, warnings: warnings.length };
  }

  test('Homepage - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('Homepage');
    expect(summary.errors).toBe(0);
  });

  test('Teachings Page - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/teachings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('Teachings Page');
    expect(summary.errors).toBe(0);
  });

  test('Events Page - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/events', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('Events Page');
    expect(summary.errors).toBe(0);
  });

  test('Search Page - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/search', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('Search Page');
    expect(summary.errors).toBe(0);
  });

  test('Media Page - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/media', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('Media Page');
    expect(summary.errors).toBe(0);
  });

  test('Login Page - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('Login Page');
    expect(summary.errors).toBe(0);
  });

  test('API Docs Page - Check console logs', async ({ page }) => {
    consoleMessages = [];
    await page.goto('/api-docs', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const summary = printSummary('API Docs Page');
    expect(summary.errors).toBe(0);
  });

  test('Single Teaching Page - Check console logs', async ({ page }) => {
    consoleMessages = [];

    // First get a teaching ID from the API
    const response = await page.request.get('http://localhost:5002/api/teachings/?limit=1');
    const data = await response.json();

    if (data.teachings && data.teachings.length > 0) {
      const teachingId = data.teachings[0].id;
      await page.goto(`/teachings/${teachingId}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const summary = printSummary('Single Teaching Page');
      expect(summary.errors).toBe(0);
    } else {
      console.log('No teachings found, skipping single teaching test');
    }
  });

  test('Single Event Page - Check console logs', async ({ page }) => {
    consoleMessages = [];

    // First get an event slug from the API
    const response = await page.request.get('http://localhost:5002/api/events/?limit=1');
    const data = await response.json();

    if (data.events && data.events.length > 0) {
      const eventSlug = data.events[0].slug;
      await page.goto(`/events/${eventSlug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const summary = printSummary('Single Event Page');
      expect(summary.errors).toBe(0);
    } else {
      console.log('No events found, skipping single event test');
    }
  });
});