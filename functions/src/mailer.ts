import { createTransport } from 'nodemailer';

// The one place the app sends email from (reminders now, the sign-in mail in
// F18 later). The provider is hidden behind `SendMail`, so changing it (for
// example to Resend after buying a domain) touches only this file. Credentials
// are secrets of the function, never in the repository.
export type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type SendMail = (mail: Mail) => Promise<void>;

export type MailConfig = {
  // Any mailbox that allows SMTP with a password: the server, and an account
  // used only for sending (for Gmail the password is an app password).
  host: string;
  port: number;
  user: string;
  password: string;
  senderName: string;
};

export const createSmtpMailer = (config: MailConfig): SendMail => {
  const transport = createTransport({
    host: config.host,
    port: config.port,
    // 465 speaks TLS from the start; other ports (587) upgrade with STARTTLS,
    // which is then required so the password never travels in the clear.
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.password },
  });
  return async (mail) => {
    await transport.sendMail({
      from: { name: config.senderName, address: config.user },
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  };
};
