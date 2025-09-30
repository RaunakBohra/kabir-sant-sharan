const { chromium } = require('@playwright/test');

const pages = [
  'http://localhost:8788/',
  'http://localhost:8788/teachings',
  'http://localhost:8788/events',
  'http://localhost:8788/media',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        url: page.url(),
        message: msg.text()
      });
    }
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push({
        pageUrl: page.url(),
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  for (const url of pages) {
    console.log(`\nChecking: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`  ⚠️  Error: ${e.message}`);
    }
  }

  await browser.close();

  console.log('\n=== CONSOLE ERRORS ===\n');
  if (errors.length === 0) {
    console.log('✅ No console errors');
  } else {
    errors.forEach((err, i) => {
      console.log(`${i + 1}. [${err.url}]`);
      console.log(`   ${err.message}\n`);
    });
  }

  console.log('\n=== 404 RESOURCES ===\n');
  if (networkErrors.length === 0) {
    console.log('✅ No 404 errors');
  } else {
    networkErrors.forEach((err, i) => {
      console.log(`${i + 1}. [${err.status}] ${err.url}`);
      console.log(`   Page: ${err.pageUrl}\n`);
    });
  }

  process.exit(errors.length + networkErrors.length > 0 ? 1 : 0);
})();