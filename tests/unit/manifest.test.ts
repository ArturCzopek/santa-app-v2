import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));
const manifest = JSON.parse(
  readFileSync(new URL('../../public/manifest.webmanifest', import.meta.url), 'utf8'),
);

describe('PWA manifest', () => {
  it('has the required app metadata and relative install URLs', () => {
    expect(manifest).toMatchObject({
      name: 'Santa App – Tajemniczy Mikołaj',
      short_name: 'Santa App',
      description:
        'Losowanie Tajemniczego Mikołaja bez karteczek w czapce: jeden link dla całej grupy, listy do Mikołaja i tajne pary.',
      lang: 'pl',
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#0E2A1E',
      theme_color: '#0E2A1E',
    });

    for (const url of [manifest.start_url, manifest.scope]) {
      expect(url).not.toMatch(/^\/|^[a-z][a-z\d+.-]*:/i);
    }
  });

  it('references existing relative icons, including 192, 512 and maskable icons', () => {
    for (const icon of manifest.icons) {
      expect(icon.src).not.toMatch(/^\/|^[a-z][a-z\d+.-]*:/i);
      expect(existsSync(resolve(publicDir, icon.src))).toBe(true);
    }

    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: 'icons/icon-192.png',
          sizes: '192x192',
          purpose: 'any',
        }),
        expect.objectContaining({ src: 'icons/icon-512.png', sizes: '512x512', purpose: 'any' }),
        expect.objectContaining({ src: 'icons/icon-512.png', sizes: '512x512', purpose: 'maskable' }),
        expect.objectContaining({ src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }),
      ]),
    );
  });
});
