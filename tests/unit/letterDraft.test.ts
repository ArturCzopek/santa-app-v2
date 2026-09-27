// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { letterDraft } from '../../src/services/letterDraft';

const draftKey = 'santa-app.letter-draft.draw-1.person-1';

beforeEach(() => localStorage.clear());

describe('letter draft', () => {
  it('reads an old plain-string draft as the wish', () => {
    localStorage.setItem(draftKey, 'A book and a map');

    expect(letterDraft('draw-1', 'person-1').read()).toEqual({
      wish: 'A book and a map',
      comment: '',
    });
  });

  it('loads an F6 JSON draft and ignores its obsolete fields', () => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        wish: 'A book\nA map',
        sizes: 'M',
        notWanted: 'Candles',
      }),
    );

    expect(letterDraft('draw-1', 'person-1').read()).toEqual({
      wish: 'A book\nA map',
      comment: '',
    });
  });

  it('stores and reads the wish and comment as JSON', () => {
    const draft = letterDraft('draw-1', 'person-1');
    const letter = {
      wish: 'A book',
      comment: 'Blue, please',
    };
    draft.write(letter);

    expect(localStorage.getItem(draftKey)).toBe(JSON.stringify(letter));
    expect(draft.read()).toEqual(letter);
  });
});
