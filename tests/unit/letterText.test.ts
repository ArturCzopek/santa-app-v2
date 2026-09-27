import { describe, expect, it } from 'vitest';
import {
  splitWishIntoLines,
  splitWishLine,
} from '../../src/components/draw/letterText';

describe('letter text', () => {
  it('splits wish lines and only turns explicit HTTP(S) URLs into links', () => {
    expect(
      splitWishIntoLines(
        'A book\n\nPlease see https://x.pl/a?b=1 before buying\njavascript:alert(1)\nwww.x.pl',
      ),
    ).toEqual([
      'A book',
      'Please see https://x.pl/a?b=1 before buying',
      'javascript:alert(1)',
      'www.x.pl',
    ]);
    expect(
      splitWishLine('Please see https://x.pl/a?b=1 before buying'),
    ).toEqual([
      { type: 'text', value: 'Please see ' },
      { type: 'link', value: 'https://x.pl/a?b=1' },
      { type: 'text', value: ' before buying' },
    ]);
    expect(splitWishLine('javascript:alert(1) www.x.pl')).toEqual([
      { type: 'text', value: 'javascript:alert(1) www.x.pl' },
    ]);
    expect(splitWishLine('http://x.pl')).toEqual([
      { type: 'link', value: 'http://x.pl' },
    ]);
  });

  it('leaves a closing bracket or full stop out of the link', () => {
    expect(splitWishLine('Kubek (https://x.pl/kubek).')).toEqual([
      { type: 'text', value: 'Kubek (' },
      { type: 'link', value: 'https://x.pl/kubek' },
      { type: 'text', value: ').' },
    ]);
  });
});
