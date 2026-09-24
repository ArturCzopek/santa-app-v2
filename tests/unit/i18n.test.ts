import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import i18n from '../../src/i18n';

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sourceFiles(join(dir, entry.name))
      : /\.tsx?$/.test(entry.name)
        ? [join(dir, entry.name)]
        : [],
  );

// Every t('some.key') in the app, so a missing text shows up here rather
// than as a raw key on the screen.
const usedKeys = [
  ...new Set(
    sourceFiles('src').flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/\bt\('([\w.]+)'/g)].map((m) => m[1]),
    ),
  ),
];

describe('translations', () => {
  it('finds the keys used in the app', () => {
    expect(usedKeys.length).toBeGreaterThan(50);
  });

  it.each(['pl', 'en'])('has every used key in %s', (lng) => {
    expect(usedKeys.filter((key) => !i18n.exists(key, { lng }))).toEqual([]);
  });
});
