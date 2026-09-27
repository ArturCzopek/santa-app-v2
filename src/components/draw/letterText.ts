export type LetterTextPart =
  { type: 'text'; value: string } | { type: 'link'; value: string };

export const splitWishLine = (line: string): LetterTextPart[] => {
  const parts: LetterTextPart[] = [];
  const urls = /(^|[\s([{])https?:\/\/[^\s<>"']+/gi;
  let lastIndex = 0;

  for (const match of line.matchAll(urls)) {
    const start = match.index! + match[1].length;
    // A sentence's full stop or a closing bracket is not part of the address.
    const url = match[0].slice(match[1].length).replace(/[.,;:!?)\]}]+$/, '');
    if (start > lastIndex) {
      parts.push({ type: 'text', value: line.slice(lastIndex, start) });
    }
    parts.push({ type: 'link', value: url });
    lastIndex = start + url.length;
  }

  if (lastIndex < line.length) {
    parts.push({ type: 'text', value: line.slice(lastIndex) });
  }

  return parts;
};

export const splitWishIntoLines = (wish: string): string[] =>
  wish.split(/\r?\n/).filter((line) => line.trim() !== '');

export const wishToItems = (wish: string): string[] =>
  splitWishIntoLines(wish).map((item) => item.trim());

export const itemsToWish = (items: string[]): string =>
  items
    .map((item) => item.trim())
    .filter(Boolean)
    .join('\n');
