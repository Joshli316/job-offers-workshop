import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto('file://' + resolve(ROOT, 'og-image.html'));
await page.waitForLoadState('networkidle');
await page.waitForTimeout(400);
await page.screenshot({
  path: resolve(ROOT, 'og-image.png'),
  type: 'png',
  fullPage: false,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log('wrote og-image.png');
