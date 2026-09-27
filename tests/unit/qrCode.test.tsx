// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import QrCode, { qrCodeSvg } from '../../src/components/common/QrCode';

describe('QrCode', () => {
  it('renders a labelled square QR matrix with all three finder patterns', () => {
    render(
      <QrCode
        text="https://example.test/#/join/d1?k=secret"
        label="Invite QR"
      />,
    );

    const svg = screen.getByRole('img', { name: 'Invite QR' });
    expect(svg.tagName.toLowerCase()).toBe('svg');
    const viewBox = svg.getAttribute('viewBox')!.split(' ').map(Number);
    expect(viewBox[2]).toBe(viewBox[3]);
    const moduleCount = viewBox[2] - 8;
    expect((moduleCount - 21) % 4).toBe(0);

    const d = svg.querySelector('path')!.getAttribute('d')!;
    const dark = new Set(
      Array.from(
        d.matchAll(/M(\d+) (\d+)h1v1h-1z/g),
        ([, x, y]) => x + ',' + y,
      ),
    );
    const isDark = (x: number, y: number) => dark.has(x + 4 + ',' + (y + 4));

    for (const [left, top] of [
      [0, 0],
      [moduleCount - 7, 0],
      [0, moduleCount - 7],
    ]) {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const finderDark =
            x === 0 ||
            x === 6 ||
            y === 0 ||
            y === 6 ||
            (x >= 2 && x <= 4 && y >= 2 && y <= 4);
          expect(isDark(left + x, top + y)).toBe(finderDark);
        }
      }
    }
  });

  it('exports the code as accessible SVG markup for download', () => {
    const svg = qrCodeSvg('https://example.test/join', 'Downloaded QR');

    expect(svg).toContain('aria-label="Downloaded QR"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).toMatch(/<path d="M\d+ \d+h1v1h-1z[^"]*" fill="#000000"\/>/);
  });
});
