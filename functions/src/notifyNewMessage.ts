import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { createConfiguredMailer, mailSecrets } from './mailParams';
import { buildMessageNotification } from './messageNotification';

const appUrl = () =>
  process.env.APP_URL || 'https://arturczopek.github.io/santa-app-v2';

export const notifyNewMessage = onDocumentCreated(
  {
    document: 'messages/{messageId}',
    region: 'europe-central2',
    maxInstances: 1,
    secrets: mailSecrets,
    retry: false,
  },
  async (event) => {
    if (!event.data) return;
    const messageId = event.params.messageId;
    try {
      await createConfiguredMailer()(
        buildMessageNotification(
          event.data.data(),
          appUrl(),
          process.env.ADMIN_EMAIL || 'arturcz32@gmail.com',
        ),
      );
    } catch (error) {
      // The SMTP error says why (e.g. a refused login), never the message.
      console.error(
        `Sending the message notification failed for ${messageId}:`,
        error,
      );
    }
  },
);
