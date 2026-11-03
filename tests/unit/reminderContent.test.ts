import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildReminderEmail,
  dueEventDates,
  warsawDay,
} from '../../functions/src/reminderContent';

describe('reminder days', () => {
  it('uses the calendar day in Poland, not UTC', () => {
    // 23:30 UTC on 30 Nov is already 1 Dec in Warsaw (UTC+1).
    expect(warsawDay(new Date('2026-11-30T23:30:00Z'))).toBe('2026-12-01');
    expect(warsawDay(new Date('2026-11-30T12:00:00Z'))).toBe('2026-11-30');
  });

  it('adds days across month and year ends', () => {
    expect(addDays('2026-12-30', 7)).toBe('2027-01-06');
    expect(addDays('2026-02-27', 1)).toBe('2026-02-28');
  });

  it('is due 7 and 1 days before the exchange', () => {
    expect(dueEventDates(new Date('2026-12-17T07:00:00Z'))).toEqual([
      { offset: 7, eventDate: '2026-12-24' },
      { offset: 1, eventDate: '2026-12-18' },
    ]);
  });
});

describe('reminder email', () => {
  const draw = {
    drawName: 'Rodzina <Kowalskich>',
    eventDate: '2026-12-24',
    eventPlace: 'u babci',
    budget: 100,
    currency: 'PLN',
  };
  const link = 'https://example.com/#/draw/abc';

  it('says when, where and how much, and links to the draw', () => {
    const mail = buildReminderEmail(draw, 7, 'pl', link);
    expect(mail.subject).toContain('za tydzień');
    expect(mail.text).toContain('24 grudnia 2026');
    expect(mail.text).toContain('u babci');
    expect(mail.text).toContain('100 PLN');
    expect(mail.text).toContain(link);
    expect(mail.html).toContain(`<a href="${link}">`);
  });

  it('writes the last-day mail in English', () => {
    const mail = buildReminderEmail(draw, 1, 'en', link);
    expect(mail.subject).toContain('tomorrow');
    expect(mail.text).toContain('24 December 2026');
  });

  it('escapes the draw name in HTML', () => {
    const mail = buildReminderEmail(draw, 1, 'pl', link);
    expect(mail.html).toContain('Rodzina &lt;Kowalskich&gt;');
    expect(mail.html).not.toContain('<Kowalskich>');
  });
});
