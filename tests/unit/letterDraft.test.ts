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
      sizes: '',
      notWanted: '',
    });
  });

  it('stores and reads all three letter fields as JSON', () => {
    const draft = letterDraft('draw-1', 'person-1');
    const letter = {
      wish: 'A book',
      sizes: 'M',
      notWanted: 'Candles',
    };
    draft.write(letter);

    expect(localStorage.getItem(draftKey)).toBe(JSON.stringify(letter));
    expect(draft.read()).toEqual(letter);
  });
});
