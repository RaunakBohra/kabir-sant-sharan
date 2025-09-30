const { chromium } = require('@playwright/test');

const pages = [
  'http://localhost:8788/',
  'http://localhost:8788/teachings',
  'http://localhost:8788/events',
  'http://localhost:8788/media',
  'http://localhost:8788/about',
  'http://localhost:8788/contact',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        url: page.url(),
        message: msg.text()
      });
    }
  });

  page.on('pageerror', err => {
    errors.push({
      url: page.url(),
      message: `Uncaught exception: ${err.message}`
    });
  });

  for (const url of pages) {
    console.log(`\nChecking: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`  ⚠️  Error loading page: ${e.message}`);
    }
  }

  await browser.close();

  console.log('\n=== CONSOLE ERRORS SUMMARY ===\n');
  if (errors.length === 0) {
    console.log('✅ No console errors found!');
  } else {
    errors.forEach((err, i) => {
      console.log(`${i + 1}. [${err.url}]`);
      console.log(`   ${err.message}\n`);
    });
  }

  process.exit(errors.length > 0 ? 1 : 0);
})();