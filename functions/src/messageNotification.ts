import { escapeHtml } from './html';
import { isValidEmail } from './loginMail';
import { Mail } from './mailer';

export const buildMessageNotification = (
  message: { userName?: string; userEmail?: string; message?: string },
  appUrl: string,
  to: string,
): Mail => {
  const name = message.userName ?? '';
  const email = message.userEmail || 'brak adresu';
  const body = message.message ?? '';
  const link = `${appUrl.replace(/\/+$/, '')}/#/admin/messages`;
  const subjectName = name.replace(/[\r\n]/g, '').trim();
  const subject = subjectName
    ? `Nowa wiadomość od ${subjectName}`
    : 'Nowa wiadomość';
  const text = `Autor: ${name}\nAdres e-mail: ${email}\n\nWiadomość:\n${body}\n\nOtwórz wiadomości w aplikacji: ${link}`;
  const messageHtml = escapeHtml(body).replace(/\r\n?|\n/g, '<br>');
  const html = `<!doctype html>
<html lang="pl">
  <body>
    <p><strong>Autor:</strong> ${escapeHtml(name)}</p>
    <p><strong>Adres e-mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Wiadomość:</strong><br>${messageHtml}</p>
    <p><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>
  </body>
</html>`;

  return {
    to,
    subject,
    text,
    html,
    ...(isValidEmail(message.userEmail) ? { replyTo: message.userEmail } : {}),
  };
};
