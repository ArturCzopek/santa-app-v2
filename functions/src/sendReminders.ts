import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret, defineString } from 'firebase-functions/params';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { createGmailMailer } from './mailer';
import { sendDueReminders } from './reminders';

const mailUser = defineSecret('MAIL_USER');
const mailPassword = defineSecret('MAIL_APP_PASSWORD');
const appUrl = defineString('APP_URL', {
  default: 'https://arturczopek.github.io/santa-app-v2',
});

// Every morning in Poland: the reminders 7 days and 1 day before the exchange.
export const sendExchangeReminders = onSchedule(
  {
    schedule: 'every day 08:00',
    timeZone: 'Europe/Warsaw',
    region: 'europe-central2',
    maxInstances: 1,
    timeoutSeconds: 540,
    secrets: [mailUser, mailPassword],
  },
  async () => {
    const result = await sendDueReminders(
      getFirestore(),
      getAuth(),
      createGmailMailer({
        user: mailUser.value(),
        appPassword: mailPassword.value(),
        senderName: 'Santa App',
      }),
      new Date(),
      appUrl.value(),
    );
    console.log(`Reminders: ${result.sent} sent, ${result.failed} failed.`);
  },
);
