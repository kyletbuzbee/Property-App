import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1024, height: 768, name: 'tablet-landscape' },
    { width: 1920, height: 1080, name: 'desktop' },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:3001');
    await page.screenshot({ 
      path: `reports/screenshot-${viewport.name}-${viewport.width}x${viewport.height}.png`,
      fullPage: true 
    });
    console.log(`Screenshot taken: ${viewport.name} (${viewport.width}x${viewport.height})`);
  }

  await browser.close();
  console.log('All screenshots completed!');
})();
