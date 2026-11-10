import {
  defineInt,
  defineSecret,
  defineString,
} from 'firebase-functions/params';
import { createSmtpMailer, SendMail } from './mailer';

// The sending mailbox: a free Interia account used only for this. The login
// and password are secrets; the server is not, and `functions/.env` can
// override it (MAIL_SMTP_HOST, MAIL_SMTP_PORT) for another mailbox.
export const mailUser = defineSecret('MAIL_USER');
export const mailPassword = defineSecret('MAIL_APP_PASSWORD');
const mailHost = defineString('MAIL_SMTP_HOST', {
  default: 'poczta.interia.pl',
});
const mailPort = defineInt('MAIL_SMTP_PORT', { default: 465 });

export const mailSecrets = [mailUser, mailPassword];

// Call inside a function that lists `mailSecrets`.
export const createConfiguredMailer = (): SendMail =>
  createSmtpMailer({
    host: mailHost.value(),
    port: mailPort.value(),
    user: mailUser.value(),
    password: mailPassword.value(),
    senderName: 'Santa App',
  });
