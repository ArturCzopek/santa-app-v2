import {
  defineInt,
  defineSecret,
  defineString,
} from 'firebase-functions/params';
import { createSmtpMailer, SendMail } from './mailer';

// The sending mailbox. The login and password are secrets; the server is not,
// so it can be set in `functions/.env` (MAIL_SMTP_HOST, MAIL_SMTP_PORT) when
// the mailbox is not Gmail.
export const mailUser = defineSecret('MAIL_USER');
export const mailPassword = defineSecret('MAIL_APP_PASSWORD');
const mailHost = defineString('MAIL_SMTP_HOST', { default: 'smtp.gmail.com' });
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
