import { defineSecret } from 'firebase-functions/params';
import { createSmtpMailer, SendMail } from './mailer';

// The sending mailbox: a free Interia account used only for this. The login
// and password are secrets; the server is not, and `functions/.env` can
// override it (MAIL_SMTP_HOST, MAIL_SMTP_PORT) for another mailbox.
export const mailUser = defineSecret('MAIL_USER');
export const mailPassword = defineSecret('MAIL_APP_PASSWORD');
// Read from the environment, not `defineString`: a non-interactive deploy
// refuses parameters without a value in a dotenv file, even with a default.
const mailHost = () => process.env.MAIL_SMTP_HOST || 'poczta.interia.pl';
const mailPort = () => Number(process.env.MAIL_SMTP_PORT) || 465;

export const mailSecrets = [mailUser, mailPassword];

// Call inside a function that lists `mailSecrets`.
export const createConfiguredMailer = (): SendMail =>
  createSmtpMailer({
    host: mailHost(),
    port: mailPort(),
    user: mailUser.value(),
    password: mailPassword.value(),
    senderName: 'Santa App',
  });
