import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { defineString } from 'firebase-functions/params';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { createConfiguredMailer, mailSecrets } from './mailParams';
import { sendDueReminders } from './reminders';

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
    secrets: mailSecrets,
  },
  async () => {
    const result = await sendDueReminders(
      getFirestore(),
      getAuth(),
      createConfiguredMailer(),
      new Date(),
      appUrl.value(),
    );
    console.log(`Reminders: ${result.sent} sent, ${result.failed} failed.`);
  },
);
