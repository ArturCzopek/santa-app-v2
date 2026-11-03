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
  // Gmail account used only for sending, with an app password.
  user: string;
  appPassword: string;
  senderName: string;
};

export const createGmailMailer = (config: MailConfig): SendMail => {
  const transport = createTransport({
    service: 'gmail',
    auth: { user: config.user, pass: config.appPassword },
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
