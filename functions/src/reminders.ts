import { Auth } from 'firebase-admin/auth';
import { FieldValue, Firestore } from 'firebase-admin/firestore';
import { SendMail } from './mailer';
import {
  buildReminderEmail,
  dueEventDates,
  ReminderDraw,
  ReminderLanguage,
} from './reminderContent';

export type ReminderResult = { sent: number; failed: number };

// Sends the reminders due on `now` to everyone who turned them on. A draw's
// reminder is marked as sent before the emails go out, so a rerun never sends
// the same one twice (at most once beats a double email on a busy day).
export const sendDueReminders = async (
  db: Firestore,
  auth: Auth,
  sendMail: SendMail,
  now: Date,
  appUrl: string,
): Promise<ReminderResult> => {
  const result: ReminderResult = { sent: 0, failed: 0 };

  for (const { offset, eventDate } of dueEventDates(now)) {
    const draws = await db
      .collection('draws')
      .where('status', '==', 'DRAWED')
      .where('eventDate', '==', eventDate)
      .get();

    for (const drawDoc of draws.docs) {
      const draw = drawDoc.data();
      const sentKey = `${offset}d`;
      if ((draw.remindersSent ?? []).includes(sentKey)) continue;

      const participants = await drawDoc.ref
        .collection('participants')
        .where('remindByEmail', '==', true)
        .get();
      await drawDoc.ref.update({
        remindersSent: FieldValue.arrayUnion(sentKey),
      });
      if (participants.empty) continue;

      const lookup = await auth.getUsers(
        participants.docs.map((p) => ({ uid: p.id })),
      );
      const emails = new Map(
        lookup.users.map((user) => [user.uid, user.email] as const),
      );
      const reminderDraw: ReminderDraw = {
        drawName: draw.drawName,
        eventDate: draw.eventDate,
        eventPlace: draw.eventPlace || undefined,
        budget: draw.budget,
        currency: draw.currency,
      };
      const link = `${appUrl}/#/draw/${drawDoc.id}`;

      for (const participant of participants.docs) {
        const to = emails.get(participant.id);
        if (!to) continue;
        const language: ReminderLanguage =
          participant.data().remindLang === 'en' ? 'en' : 'pl';
        try {
          await sendMail({
            to,
            ...buildReminderEmail(reminderDraw, offset, language, link),
          });
          result.sent += 1;
        } catch (error) {
          result.failed += 1;
          console.error(
            `Reminder ${sentKey} for draw ${drawDoc.id} failed:`,
            error instanceof Error ? error.message : error,
          );
        }
      }
    }
  }

  return result;
};
