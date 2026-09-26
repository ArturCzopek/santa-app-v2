import { describe, expect, it } from 'vitest';
import { buildIcs } from '../../src/services/calendar';

describe('buildIcs', () => {
  it('makes an all-day event on the gift exchange date', () => {
    const ics = buildIcs(
      {
        uid: 'd1@santa-app',
        date: '2026-12-24',
        title: 'Tajemniczy Mikołaj: Wigilia',
        place: 'U babci, godz. 18:00',
        description: 'Budżet: 100 PLN; link\ndruga linia',
      },
      new Date('2026-09-26T10:00:00Z'),
    );
    const lines = ics.split('\r\n');

    expect(lines).toContain('DTSTART;VALUE=DATE:20261224');
    expect(lines).toContain('DTEND;VALUE=DATE:20261225');
    expect(lines).toContain('DTSTAMP:20260926T100000Z');
    expect(lines).toContain('SUMMARY:Tajemniczy Mikołaj: Wigilia');
    // Commas, semicolons and line breaks are escaped.
    expect(lines).toContain('LOCATION:U babci\\, godz. 18:00');
    expect(lines).toContain('DESCRIPTION:Budżet: 100 PLN\\; link\\ndruga linia');
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
  });

  it('rolls the end over into the next month and year', () => {
    expect(buildIcs({ uid: 'x', date: '2026-12-31', title: 'T' })).toContain(
      'DTEND;VALUE=DATE:20270101',
    );
  });
});
