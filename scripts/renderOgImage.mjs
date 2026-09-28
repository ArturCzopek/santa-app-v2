import { statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(projectRoot, 'scripts/og-image.html');
const output = resolve(projectRoot, 'public/og-image.png');
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(source).href, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: output, type: 'png' });

  const size = statSync(output).size;
  if (size >= 300 * 1024) {
    throw new Error(
      'OG image is too large: ' +
        Math.round(size / 1024) +
        ' kB (limit: 300 kB)',
    );
  }
  console.log('Rendered public/og-image.png (' + Math.round(size / 1024) + ' kB)');
} finally {
  await browser.close();
}
