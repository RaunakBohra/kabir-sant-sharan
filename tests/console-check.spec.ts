import { test, expect } from '@playwright/test';

test.describe('Console Logs Check', () => {
  let consoleMessages: Array<{ type: string; text: string }> = [];

  test.beforeEach(async ({ page }) => {
    consoleMessages = [];

    // Capture all console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
      console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
    });

    // Capture page errors
    page.on('pageerror', error => {
      console.log('[BROWSER ERROR]:', error.message);
      consoleMessages.push({
        type: 'error',
        text: error.message
      });
    });
  });

  test('Check homepage console logs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('\n=== CONSOLE MESSAGES SUMMARY ===');
    console.log('Total messages:', consoleMessages.length);

    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');

    console.log('Errors:', errors.length);
    console.log('Warnings:', warnings.length);

    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log(e.text));
    }

    if (warnings.length > 0) {
      console.log('\n=== WARNINGS ===');
      warnings.forEach(w => console.log(w.text));
    }
  });

  test('Check teachings page console logs', async ({ page }) => {
    await page.goto('/teachings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');

    console.log('\n=== TEACHINGS PAGE ===');
    console.log('Errors:', errors.length);
    console.log('Warnings:', warnings.length);

    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log(e.text));
    }
  });

  test('Check search page console logs', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const errors = consoleMessages.filter(m => m.type === 'error');

    console.log('\n=== SEARCH PAGE ===');
    console.log('Errors:', errors.length);

    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log(e.text));
    }
  });
});