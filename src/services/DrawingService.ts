import { doc, getDoc, collection, writeBatch } from 'firebase/firestore';
import { Assignment, Draw, Pair, Participant } from '../models/Draw';
import { db } from './FirebaseConfig';
import { appDataService } from './AppDataService';

export class DrawingService {
  private drawsCollection = collection(db, 'draws');

  // Fisher-Yates shuffle algorithm
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private validatePairs(pairs: Pair[], participants: Participant[]): boolean {
    const participantUuids = participants.map((p) => p.userUuid);

    if (pairs.length !== participants.length) return false;

    const fromUuids = new Set(pairs.map((p) => p.fromUuid));
    const toUuids = new Set(pairs.map((p) => p.toUuid));

    return (
      fromUuids.size === participants.length &&
      toUuids.size === participants.length &&
      [...fromUuids].every((uuid) => participantUuids.includes(uuid)) &&
      [...toUuids].every((uuid) => participantUuids.includes(uuid)) &&
      pairs.every((pair) => pair.fromUuid !== pair.toUuid)
    );
  }

  private generatePairs(participants: Participant[]): Pair[] {
    const MAX_ATTEMPTS = 100;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const shuffledParticipants = this.shuffleArray(participants);

      const pairs: Pair[] = shuffledParticipants.map((participant, index) => ({
        fromUuid: participant.userUuid,
        toUuid:
          shuffledParticipants[(index + 1) % shuffledParticipants.length]
            .userUuid,
      }));

      if (this.validatePairs(pairs, participants)) {
        return pairs;
      }
    }

    throw new Error('Unable to generate valid draw pairs');
  }

  async startDraw(drawId: string, userId: string): Promise<Draw> {
    const drawRef = doc(this.drawsCollection, drawId);
    const drawSnapshot = await getDoc(drawRef);

    if (!drawSnapshot.exists()) {
      throw new Error('Draw not found');
    }

    const draw = { id: drawSnapshot.id, ...drawSnapshot.data() } as Draw;

    if (draw.ownerUuid !== userId) {
      throw new Error('Only draw owner can start the draw');
    }

    if (draw.participants.length < 2) {
      throw new Error('Draw must have at least two participants');
    }

    if (draw.status !== 'WAITING_FOR_DRAW') {
      throw new Error('Draw cannot be started');
    }

    const pairs = this.generatePairs(draw.participants);

    const updateData = {
      status: 'DRAWED',
      drawDate: new Date(),
    };

    // Each pair goes to its own document that only the giver can read, so the
    // full result never reaches any browser after this one.
    const batch = writeBatch(db);
    batch.update(drawRef, updateData);
    pairs.forEach((pair) => {
      const assignment: Assignment = { toUuid: pair.toUuid };
      batch.set(doc(drawRef, 'assignments', pair.fromUuid), assignment);
    });
    await batch.commit();

    await appDataService.addWinnersCount(pairs.length);

    return {
      ...draw,
      ...updateData,
    } as Draw;
  }

  async getMyAssignment(
    drawId: string,
    userId: string,
  ): Promise<Assignment | null> {
    const assignmentRef = doc(this.drawsCollection, drawId, 'assignments', userId);
    const assignmentSnapshot = await getDoc(assignmentRef);

    return assignmentSnapshot.exists()
      ? (assignmentSnapshot.data() as Assignment)
      : null;
  }
}

export const drawingService = new DrawingService();
