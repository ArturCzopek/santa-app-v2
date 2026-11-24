import { describe, expect, it } from 'vitest';
import { buildMessageNotification } from '../../functions/src/messageNotification';

const APP_URL = 'https://arturczopek.github.io/santa-app-v2';
const TO = 'admin@example.com';

describe('buildMessageNotification', () => {
  it('builds a Polish subject from the author name', () => {
    expect(
      buildMessageNotification({ userName: 'Anna' }, APP_URL, TO).subject,
    ).toBe('Nowa wiadomość od Anna');
    expect(buildMessageNotification({}, APP_URL, TO).subject).toBe(
      'Nowa wiadomość',
    );
  });

  it('strips line breaks from the subject', () => {
    const mail = buildMessageNotification(
      { userName: 'Anna\r\nBcc: victim@example.com' },
      APP_URL,
      TO,
    );
    expect(mail.subject).toBe(
      'Nowa wiadomość od AnnaBcc: victim@example.com',
    );
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });

  it('escapes author and message HTML and keeps message line breaks', () => {
    const mail = buildMessageNotification(
      {
        userName: '<script>&',
        userEmail: 'anna@example.com',
        message: '<script>alert("x")</script> &\nDrugi wiersz',
      },
      APP_URL,
      TO,
    );
    expect(mail.html).toContain('&lt;script&gt;&amp;');
    expect(mail.html).toContain(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp;<br>Drugi wiersz',
    );
    expect(mail.html).not.toContain('<script>');
    expect(mail.text).toContain('<script>alert("x")</script> &\nDrugi wiersz');
  });

  it.each([
    ['with trailing slash', `${APP_URL}/`],
    ['without trailing slash', APP_URL],
  ])('links to the admin messages page %s', (_label, appUrl) => {
    const link = `${APP_URL}/#/admin/messages`;
    const mail = buildMessageNotification({}, appUrl, TO);
    expect(mail.text).toContain(link);
    expect(mail.html).toContain(`<a href="${link}">${link}</a>`);
  });

  it('sets replyTo only for a valid author email', () => {
    expect(
      buildMessageNotification({ userEmail: 'anna@example.com' }, APP_URL, TO)
        .replyTo,
    ).toBe('anna@example.com');
    for (const userEmail of ['', undefined, 'not-an-email']) {
      expect(
        buildMessageNotification({ userEmail }, APP_URL, TO),
      ).not.toHaveProperty('replyTo');
    }
  });
});
