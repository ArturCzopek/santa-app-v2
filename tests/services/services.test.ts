import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  User,
} from 'firebase/auth';
import { terminate } from 'firebase/firestore';
import { auth, db } from '../../src/services/FirebaseConfig';
import { drawService } from '../../src/services/DrawService';
import { drawingService } from '../../src/services/DrawingService';
import { messageService } from '../../src/services/MessageService';
import { appDataService } from '../../src/services/AppDataService';
import { isValidDraw } from '../../src/services/pairs';
import { Pair } from '../../src/models/Draw';
import { PROJECT_ID } from '../rules/setup';

// Signs in against the Auth emulator, which accepts unsigned Google tokens.
const signInAs = async (sub: string, name: string): Promise<User> => {
  await signOut(auth);
  const credential = GoogleAuthProvider.credential(
    JSON.stringify({
      sub,
      email: `${sub}@example.com`,
      email_verified: true,
      name,
    }),
  );
  return (await signInWithCredential(auth, credential)).user;
};

const clearFirestore = () =>
  fetch(
    `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' },
  );

const newDrawForm = {
  drawName: 'Office party',
  description: 'Gifts!',
  budget: 80,
  currency: 'PLN',
  eventDate: '2026-12-24',
  eventPlace: 'At grandma’s',
  password: 'secret1',
};

beforeEach(async () => {
  await clearFirestore();
});

afterAll(async () => {
  await signOut(auth);
  await terminate(db);
});

describe('DrawService + DrawingService against the emulator', () => {
  it('runs a whole draw: create, join, wishes, start, results', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);

    expect(await drawService.isDrawPasswordValid(drawId, 'secret1')).toBe(true);
    expect(await drawService.isDrawPasswordValid(drawId, 'wrong-1')).toBe(
      false,
    );
    await drawService.updateWish(drawId, owner.uid, 'Mountain book');

    const alice = await signInAs('alice', 'Ania Test');
    await expect(
      drawService.joinToDraw(drawId, alice, 'wrong-1'),
    ).rejects.toThrow('Invalid password');
    await drawService.joinToDraw(drawId, alice, 'secret1');
    await expect(
      drawService.joinToDraw(drawId, alice, 'secret1'),
    ).rejects.toThrow('already a participant');

    const [preview] = await drawService.getDrawPreviews(alice.uid);
    expect(preview).toMatchObject({
      id: drawId,
      drawName: 'Office party',
      eventDate: '2026-12-24',
      eventPlace: 'At grandma’s',
      participantsCount: 2,
      userWishProvided: false,
    });
    await drawService.updateWish(drawId, alice.uid, 'Socks');
    expect(
      (await drawService.getDrawPreviews(alice.uid))[0].userWishProvided,
    ).toBe(true);

    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, 'secret1');

    await expect(drawingService.startDraw(drawId, bob.uid)).rejects.toThrow();

    await signInAs('owner', 'Olga Owner');
    const participants = await drawService.getParticipants(drawId);
    expect(participants.map((p) => p.userName).sort()).toEqual([
      'Ania Test',
      'Bob Test',
      'Olga Owner',
    ]);
    const started = await drawingService.startDraw(drawId, owner.uid);
    expect(started.status).toBe('DRAWED');
    await expect(drawingService.startDraw(drawId, owner.uid)).rejects.toThrow();

    const pairs: Pair[] = [];
    for (const [sub, name, uid] of [
      ['owner', 'Olga Owner', owner.uid],
      ['alice', 'Ania Test', alice.uid],
      ['bob', 'Bob Test', bob.uid],
    ]) {
      await signInAs(sub, name);
      const assignment = await drawingService.getMyAssignment(drawId, uid);
      expect(assignment).not.toBeNull();
      pairs.push({ fromUuid: uid, toUuid: assignment!.toUuid });
    }
    expect(isValidDraw(pairs, [owner.uid, alice.uid, bob.uid])).toBe(true);

    expect(await appDataService.getAppData()).toEqual({
      drawsCount: 1,
      winnersCount: 3,
    });
  });

  it('lets people join with the invite link, until the owner makes a new one', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const firstKey = await drawService.getInviteKey(drawId);
    expect(firstKey).toMatch(/^[\w-]{22}$/);
    // The link key does not pass as the password for starting the draw.
    expect(await drawService.isDrawPasswordValid(drawId, firstKey!)).toBe(
      false,
    );

    const alice = await signInAs('alice', 'Ania Test');
    await drawService.joinToDraw(drawId, alice, firstKey!);
    expect(await drawService.getInviteKey(drawId)).toBe(firstKey);

    await signInAs('owner', 'Olga Owner');
    const secondKey = await drawService.renewInviteKey(drawId);
    expect(secondKey).not.toBe(firstKey);

    const bob = await signInAs('bob', 'Bob Test');
    await expect(
      drawService.joinToDraw(drawId, bob, firstKey!),
    ).rejects.toThrow('Invalid password');
    await drawService.joinToDraw(drawId, bob, secondKey);
  });

  it('lets a participant leave and the owner delete the draw', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const alice = await signInAs('alice', 'Ania Test');
    await drawService.joinToDraw(drawId, alice, 'secret1');
    await drawService.updateWish(drawId, alice.uid, 'Socks');

    await drawService.leaveDraw(drawId, alice.uid);
    expect(await drawService.getDrawPreviews(alice.uid)).toEqual([]);

    await signInAs('owner', 'Olga Owner');
    expect((await drawService.getDraw(drawId)).participantUuids).toEqual([
      owner.uid,
    ]);
    await drawService.deleteDraw(drawId);
    await expect(drawService.getDraw(drawId)).rejects.toThrow('Draw not found');
    expect(await drawService.getDrawPreviews(owner.uid)).toEqual([]);
  });

  it('keeps outsiders out of participants and results', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);

    const mallory = await signInAs('mallory', 'Mallory');
    const draw = await drawService.getDraw(drawId);
    expect(draw).not.toHaveProperty('password');
    await expect(drawService.getParticipants(drawId)).rejects.toThrow();
    await expect(
      drawService.isDrawPasswordValid(drawId, 'secret1'),
    ).rejects.toThrow();
    await expect(
      drawingService.getMyAssignment(drawId, owner.uid),
    ).rejects.toThrow();
    expect(await drawService.getDrawPreviews(mallory.uid)).toEqual([]);
  });
});

describe('MessageService against the emulator', () => {
  it('allows one message per day', async () => {
    const user = await signInAs('writer', 'Writer');
    expect(await messageService.canUserSendMessageToday(user.uid)).toBe(true);

    await messageService.sendMessage({
      userUid: user.uid,
      userName: 'Writer',
      message: 'Great app',
    });

    expect(await messageService.canUserSendMessageToday(user.uid)).toBe(false);
    await expect(
      messageService.sendMessage({
        userUid: user.uid,
        userName: 'Writer',
        message: 'Spam',
      }),
    ).rejects.toThrow();
  });

  it('sends when the device clock is on the other side of midnight', async () => {
    const user = await signInAs('late-writer', 'Late Writer');
    const realNow = Date.now();
    // A device a day behind computes yesterday's document id.
    const clock = vi
      .spyOn(Date, 'now')
      .mockReturnValue(realNow - 24 * 60 * 60 * 1000);
    try {
      await messageService.sendMessage({
        userUid: user.uid,
        userName: 'Late Writer',
        message: 'Sent at 23:59:59',
      });
    } finally {
      clock.mockRestore();
    }

    // Stored under the server's today, so the daily limit still holds.
    expect(await messageService.canUserSendMessageToday(user.uid)).toBe(false);
  });
});
