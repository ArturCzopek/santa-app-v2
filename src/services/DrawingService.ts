import { doc, updateDoc, getDoc, collection } from 'firebase/firestore';
import { Draw, Pair, Participant } from '../models/Draw';
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

  // Validate pairs ensure each participant is unique in pairs
  private validatePairs(pairs: Pair[], participants: Participant[]): boolean {
    const participantUuids = participants.map((p) => p.userUuid);

    // Check if number of pairs matches participants
    if (pairs.length !== participants.length) return false;

    // Ensure each participant appears exactly once as fromUuid and toUuid
    const fromUuids = new Set(pairs.map((p) => p.fromUuid));
    const toUuids = new Set(pairs.map((p) => p.toUuid));

    return (
      fromUuids.size === participants.length &&
      toUuids.size === participants.length &&
      [...fromUuids].every((uuid) => participantUuids.includes(uuid)) &&
      [...toUuids].every((uuid) => participantUuids.includes(uuid)) &&
      // Ensure no one buys a gift for themselves
      pairs.every((pair) => pair.fromUuid !== pair.toUuid)
    );
  }

  // Generate pairs ensuring each participant is in a unique pair
  private generatePairs(participants: Participant[]): Pair[] {
    const MAX_ATTEMPTS = 100;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // Shuffle participants to randomize drawing
      const shuffledParticipants = this.shuffleArray(participants);

      // Create pairs by rotating the array
      const pairs: Pair[] = shuffledParticipants.map((participant, index) => ({
        fromUuid: participant.userUuid,
        toUuid:
          shuffledParticipants[(index + 1) % shuffledParticipants.length]
            .userUuid,
      }));

      // Validate pairs meet our criteria
      if (this.validatePairs(pairs, participants)) {
        return pairs;
      }
    }

    // If unable to generate valid pairs after max attempts
    throw new Error('Unable to generate valid draw pairs');
  }

  async startDraw(drawId: string, userId: string): Promise<Draw> {
    // Fetch the most recent draw data
    const drawRef = doc(this.drawsCollection, drawId);
    const drawSnapshot = await getDoc(drawRef);

    if (!drawSnapshot.exists()) {
      throw new Error('Draw not found');
    }

    const draw = { id: drawSnapshot.id, ...drawSnapshot.data() } as Draw;

    // Verify user is the draw owner
    if (draw.ownerUuid !== userId) {
      throw new Error('Only draw owner can start the draw');
    }

    // Verify user is the draw owner
    if (draw.participants.length < 2) {
      throw new Error('Draw must have at least two participants');
    }

    // Verify draw is in WAITING_FOR_DRAW status
    if (draw.status !== 'WAITING_FOR_DRAW') {
      throw new Error('Draw cannot be started');
    }

    // Generate pairs
    const pairs = this.generatePairs(draw.participants);

    // Prepare update object
    const updateData = {
      status: 'DRAWED',
      drawDate: new Date(),
      pairs: pairs,
    };

    // Update Firestore document
    await updateDoc(drawRef, updateData);
    await appDataService.addWinnersCount(pairs.length);

    // Return updated draw
    return {
      ...draw,
      ...updateData,
    } as Draw;
  }
}

export const drawingService = new DrawingService();
