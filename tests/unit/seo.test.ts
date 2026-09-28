import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('provides crawlable SEO metadata and FAQ structured data', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  expect(html).toContain(
    '<link rel="canonical" href="https://arturczopek.github.io/santa-app-v2/" />',
  );

  const imageUrl = html.match(
    /<meta\s+property="og:image"\s+content="([^"]+)"/u,
  )?.[1];
  expect(imageUrl).toBeDefined();
  const parsedImageUrl = new URL(imageUrl!);
  expect(parsedImageUrl.protocol).toBe('https:');
  expect(parsedImageUrl.pathname).toBe('/santa-app-v2/og-image.png');
  expect(existsSync(resolve(process.cwd(), 'public/og-image.png'))).toBe(true);

  const root = html.match(/<div id="root">([\s\S]*?)<\/div>/u)?.[1] ?? '';
  const staticFaqCount = root.match(/<details class="faq-item">/gu)?.length ?? 0;
  const jsonLdText = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/u,
  )?.[1];
  const jsonLd = JSON.parse(jsonLdText ?? '') as {
    '@graph': Array<{
      '@type'?: string;
      mainEntity?: Array<{
        name: string;
        acceptedAnswer: { text: string };
      }>;
    }>;
  };
  const faqPage = jsonLd['@graph'].find((entry) => entry['@type'] === 'FAQPage');

  expect(faqPage?.mainEntity).toHaveLength(staticFaqCount);
});
