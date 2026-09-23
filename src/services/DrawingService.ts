import {
  doc,
  getDoc,
  collection,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { Assignment, Draw, Pair } from '../models/Draw';
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

  private validatePairs(pairs: Pair[], participantUuids: string[]): boolean {
    if (pairs.length !== participantUuids.length) return false;

    const fromUuids = new Set(pairs.map((p) => p.fromUuid));
    const toUuids = new Set(pairs.map((p) => p.toUuid));

    return (
      fromUuids.size === participantUuids.length &&
      toUuids.size === participantUuids.length &&
      [...fromUuids].every((uuid) => participantUuids.includes(uuid)) &&
      [...toUuids].every((uuid) => participantUuids.includes(uuid)) &&
      pairs.every((pair) => pair.fromUuid !== pair.toUuid)
    );
  }

  private generatePairs(participantUuids: string[]): Pair[] {
    const MAX_ATTEMPTS = 100;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const shuffledUuids = this.shuffleArray(participantUuids);

      const pairs: Pair[] = shuffledUuids.map((uuid, index) => ({
        fromUuid: uuid,
        toUuid: shuffledUuids[(index + 1) % shuffledUuids.length],
      }));

      if (this.validatePairs(pairs, participantUuids)) {
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

    if (draw.participantUuids.length < 2) {
      throw new Error('Draw must have at least two participants');
    }

    if (draw.status !== 'WAITING_FOR_DRAW') {
      throw new Error('Draw cannot be started');
    }

    const pairs = this.generatePairs(draw.participantUuids);

    const updateData = {
      status: 'DRAWED',
      drawDate: serverTimestamp(),
    };

    // Each pair goes to its own document that only the giver can read, so the
    // full result never reaches any browser after this one.
    const batch = writeBatch(db);
    batch.update(drawRef, updateData);
    pairs.forEach((pair) => {
      const assignment: Assignment = { toUuid: pair.toUuid };
      batch.set(doc(drawRef, 'assignments', pair.fromUuid), assignment);
    });
    appDataService.addDrawStarted(batch, drawId, pairs.length);
    await batch.commit();

    return {
      ...draw,
      status: 'DRAWED',
      drawDate: new Date(),
    };
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
