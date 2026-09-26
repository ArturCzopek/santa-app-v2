// The gift exchange as a calendar event (.ics), so people get reminded by
// their own phone: the app has no server to send reminders itself.

export interface CalendarEvent {
  uid: string;
  // 'YYYY-MM-DD', an all-day event.
  date: string;
  title: string;
  place?: string;
  description?: string;
}

// Text values escape backslashes, commas, semicolons and line breaks.
const escapeText = (text: string) =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/[,;]/g, (char) => `\\${char}`)
    .replace(/\r?\n/g, '\\n');

const compactDate = (date: Date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate(),
  ).padStart(2, '0')}`;

export const buildIcs = (event: CalendarEvent, now = new Date()): string => {
  const [year, month, day] = event.date.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(year, month - 1, day + 1);
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Santa App//Tajemniczy Mikolaj//PL',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compactDate(start)}`,
    `DTEND;VALUE=DATE:${compactDate(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.place ? [`LOCATION:${escapeText(event.place)}`] : []),
    ...(event.description
      ? [`DESCRIPTION:${escapeText(event.description)}`]
      : []),
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
};

// Hands the file to the browser, which offers to add it to the calendar.
export const downloadIcs = (fileName: string, ics: string) => {
  const url = URL.createObjectURL(
    new Blob([ics], { type: 'text/calendar;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
