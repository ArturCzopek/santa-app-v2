import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy } from '../../vite.config';

const policyFor = (...args: Parameters<typeof contentSecurityPolicy>) => {
  const [tag] = contentSecurityPolicy(...args).transformIndexHtml.handler();
  return tag.attrs.content;
};

describe('production content security policy', () => {
  it('allows the draw function of this project', () => {
    expect(policyFor('santa-app-v2', 'santa-app-v2.firebaseapp.com')).toContain(
      'https://europe-central2-santa-app-v2.cloudfunctions.net',
    );
  });

  // A `*` anywhere but as a whole leftmost label matches nothing and
  // silently blocks the request (it broke every draw in production).
  it('uses wildcards only as a whole leftmost label', () => {
    const wildcards = policyFor('p', 'p.firebaseapp.com', true)
      .split(/[\s;]+/)
      .filter((source) => source.includes('*'));
    expect(wildcards).toContain('https://*.googleusercontent.com');
    for (const source of wildcards) {
      expect(source).toMatch(/^https:\/\/\*\.[^*]+$/);
    }
  });
});
