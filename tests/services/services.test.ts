import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  terminate,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../../src/services/FirebaseConfig';
import { drawService } from '../../src/services/DrawService';
import { messageService } from '../../src/services/MessageService';
import { appDataService } from '../../src/services/AppDataService';
import { isValidDraw } from '../../src/services/pairs';
import { Letter, Pair } from '../../src/models/Draw';
import { createTestEnv, PROJECT_ID } from '../rules/setup';

// Signs in against the Auth emulator, which accepts unsigned Google tokens.
const signInAs = async (
  sub: string,
  name: string,
  email = `${sub}@example.com`,
): Promise<User> => {
  await signOut(auth);
  const credential = GoogleAuthProvider.credential(
    JSON.stringify({
      sub,
      email,
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
  ownerPlays: true,
  password: 'secret1',
};

const startDrawOnServer = httpsCallable<
  { drawId: string },
  { drawDate: string }
>(functions, 'startDraw');

const letter = (wish: string, comment = ''): Letter => ({
  wish,
  comment,
});

beforeEach(async () => {
  await clearFirestore();
});

afterAll(async () => {
  await signOut(auth);
  await terminate(db);
});

describe('DrawService against the emulator', () => {
  it('runs a whole draw: create, join, wishes, start, results', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);

    expect(await drawService.isDrawPasswordValid(drawId, 'secret1')).toBe(true);
    expect(await drawService.isDrawPasswordValid(drawId, 'wrong-1')).toBe(
      false,
    );
    const ownerLetter = letter('Mountain book', 'Blue, size M / 39');
    await drawService.updateLetter(drawId, owner.uid, ownerLetter);
    expect(await drawService.getLetter(drawId, owner.uid)).toEqual(ownerLetter);

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
    await drawService.updateLetter(drawId, alice.uid, letter('Socks'));
    expect(
      (await drawService.getDrawPreviews(alice.uid))[0].userWishProvided,
    ).toBe(true);

    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, 'secret1');

    await expect(drawService.startDraw(drawId, bob.uid)).rejects.toThrow();

    await signInAs('owner', 'Olga Owner');
    const participants = await drawService.getParticipants(drawId);
    expect(participants.map((p) => p.userName).sort()).toEqual([
      'Ania Test',
      'Bob Test',
      'Olga Owner',
    ]);
    const started = await drawService.startDraw(drawId, owner.uid);
    expect(started.status).toBe('DRAWED');
    expect(started.drawDate).toBeInstanceOf(Date);
    expect(started).not.toHaveProperty('pairs');
    await expect(drawService.startDraw(drawId, owner.uid)).rejects.toThrow();
    await expect(startDrawOnServer({ drawId })).rejects.toMatchObject({
      code: 'functions/failed-precondition',
    });

    const pairs: Pair[] = [];
    for (const [sub, name, uid] of [
      ['owner', 'Olga Owner', owner.uid],
      ['alice', 'Ania Test', alice.uid],
      ['bob', 'Bob Test', bob.uid],
    ]) {
      await signInAs(sub, name);
      const assignment = await drawService.getMyAssignment(drawId, uid);
      expect(assignment).not.toBeNull();
      pairs.push({ fromUuid: uid, toUuid: assignment!.toUuid });
    }
    expect(isValidDraw(pairs, [owner.uid, alice.uid, bob.uid])).toBe(true);

    await drawService.updateGiftBought(drawId, bob.uid, true);
    expect(
      (await drawService.getParticipants(drawId)).find(
        (participant) => participant.userUuid === bob.uid,
      )?.giftBought,
    ).toBe(true);
    expect(await drawService.getThanks(drawId, bob.uid)).toBe('');
    await drawService.saveThanks(drawId, bob.uid, 'Thank you!');
    expect(await drawService.getThanks(drawId, bob.uid)).toBe('Thank you!');

    expect(await appDataService.getAppData()).toEqual({
      drawsCount: 1,
      winnersCount: 3,
    });
  });

  it('draws on the server with a valid bijection that respects exclusions', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const alice = await signInAs('alice', 'Ania Test');
    await drawService.joinToDraw(drawId, alice, 'secret1');
    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, 'secret1');
    const charlie = await signInAs('charlie', 'Charlie Test');
    await drawService.joinToDraw(drawId, charlie, 'secret1');

    await signInAs('owner', 'Olga Owner');
    const exclusions: [string, string][] = [[owner.uid, alice.uid]];
    await drawService.addExclusion(drawId, exclusions[0]);
    const started = await drawService.startDraw(drawId, owner.uid);

    const players = [owner.uid, alice.uid, bob.uid, charlie.uid];
    const pairs: Pair[] = [];
    for (const [sub, name, uid] of [
      ['owner', 'Olga Owner', owner.uid],
      ['alice', 'Ania Test', alice.uid],
      ['bob', 'Bob Test', bob.uid],
      ['charlie', 'Charlie Test', charlie.uid],
    ]) {
      await signInAs(sub, name);
      const assignment = await drawService.getMyAssignment(drawId, uid);
      expect(assignment).not.toBeNull();
      pairs.push({ fromUuid: uid, toUuid: assignment!.toUuid });
    }

    expect(started.status).toBe('DRAWED');
    expect(isValidDraw(pairs, players, exclusions)).toBe(true);
    expect(await drawService.getDraw(drawId)).toMatchObject({
      status: 'DRAWED',
    });
    expect(await appDataService.getAppData()).toMatchObject({
      drawsCount: 1,
      winnersCount: 4,
    });
  });

  it('the callable rejects non-owners and draws with fewer than two players', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);

    await signInAs('alice', 'Ania Test');
    await expect(startDrawOnServer({ drawId })).rejects.toMatchObject({
      code: 'functions/permission-denied',
    });

    await signInAs('owner', 'Olga Owner');
    await expect(startDrawOnServer({ drawId })).rejects.toMatchObject({
      code: 'functions/failed-precondition',
    });
  });

  it('lets the owner organize without playing or receiving an assignment', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(
      { ...newDrawForm, ownerPlays: false },
      owner,
    );
    const alice = await signInAs('alice', 'Ania Test');
    await drawService.joinToDraw(drawId, alice, 'secret1');
    await signInAs('owner', 'Olga Owner');
    await expect(drawService.startDraw(drawId, owner.uid)).rejects.toThrow(
      'at least two players',
    );

    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, 'secret1');
    await signInAs('owner', 'Olga Owner');
    await drawService.startDraw(drawId, owner.uid);

    expect(await drawService.getMyAssignment(drawId, owner.uid)).toBeNull();
    const pairs: Pair[] = [];
    for (const [sub, name, uid] of [
      ['alice', 'Ania Test', alice.uid],
      ['bob', 'Bob Test', bob.uid],
    ]) {
      await signInAs(sub, name);
      const assignment = await drawService.getMyAssignment(drawId, uid);
      expect(assignment).not.toBeNull();
      pairs.push({ fromUuid: uid, toUuid: assignment!.toUuid });
    }
    expect(isValidDraw(pairs, [alice.uid, bob.uid])).toBe(true);
    expect(await appDataService.getAppData()).toMatchObject({
      winnersCount: 2,
    });
  });

  it('lets the owner set a new password; the invite link keeps working', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const linkKey = await drawService.getInviteKey(drawId);

    await drawService.setDrawPassword(drawId, 'nowe-haslo');
    expect(await drawService.isDrawPasswordValid(drawId, 'secret1')).toBe(
      false,
    );
    expect(await drawService.isDrawPasswordValid(drawId, 'nowe-haslo')).toBe(
      true,
    );
    // Setting the same password again changes nothing.
    await drawService.setDrawPassword(drawId, 'nowe-haslo');
    expect(await drawService.isDrawPasswordValid(drawId, 'nowe-haslo')).toBe(
      true,
    );

    const alice = await signInAs('alice', 'Ania Test');
    await expect(
      drawService.joinToDraw(drawId, alice, 'secret1'),
    ).rejects.toThrow('Invalid password');
    await drawService.joinToDraw(drawId, alice, 'nowe-haslo');
    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, linkKey!);

    // Only the owner can change it.
    await expect(
      drawService.setDrawPassword(drawId, 'przejete'),
    ).rejects.toThrow();
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
    await drawService.updateLetter(drawId, alice.uid, letter('Socks'));

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

  it('deletes exclusions in chunks before deleting the rest of a waiting draw', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const alice = await signInAs('alice', 'Ania Test');
    await drawService.joinToDraw(drawId, alice, 'secret1');
    await drawService.updateLetter(drawId, alice.uid, letter('Socks'));
    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, 'secret1');
    await drawService.updateLetter(drawId, bob.uid, letter('Book'));
    const celina = await signInAs('celina', 'Celina Test');
    await drawService.joinToDraw(drawId, celina, 'secret1');
    await drawService.updateLetter(drawId, celina.uid, letter('Mug'));

    await signInAs('owner', 'Olga Owner');
    await drawService.updateLetter(drawId, owner.uid, letter('Tea'));
    const exclusions = [
      [owner.uid, alice.uid],
      [owner.uid, bob.uid],
      [owner.uid, celina.uid],
      [alice.uid, bob.uid],
      [alice.uid, celina.uid],
    ] as const;
    for (const exclusion of exclusions) {
      await drawService.addExclusion(drawId, [...exclusion]);
    }
    expect(await drawService.getExclusions(drawId)).toHaveLength(5);
    expect(await drawService.getInviteKey(drawId)).not.toBeNull();

    await drawService.deleteDraw(drawId, 2);

    const env = await createTestEnv();
    try {
      await env.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        for (const subcollection of [
          'participants',
          'letters',
          'exclusions',
          'joinKeys',
        ]) {
          expect(
            (
              await getDocs(
                collection(adminDb, `draws/${drawId}/${subcollection}`),
              )
            ).size,
          ).toBe(0);
        }
        expect(
          (await getDoc(doc(adminDb, `draws/${drawId}/invite/link`))).exists(),
        ).toBe(false);
        expect((await getDoc(doc(adminDb, `draws/${drawId}`))).exists()).toBe(
          false,
        );
      });
    } finally {
      await env.cleanup();
    }
  });

  it('lets the owner take someone out, with their letter and pairs', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const alice = await signInAs('alice', 'Ania Test');
    await drawService.joinToDraw(drawId, alice, 'secret1');
    await drawService.updateLetter(drawId, alice.uid, letter('Socks'));
    const bob = await signInAs('bob', 'Bob Test');
    await drawService.joinToDraw(drawId, bob, 'secret1');

    await signInAs('owner', 'Olga Owner');
    await drawService.addExclusion(drawId, [alice.uid, bob.uid]);
    await drawService.removeParticipant(drawId, alice.uid);
    expect((await drawService.getDraw(drawId)).participantUuids).toEqual([
      owner.uid,
      bob.uid,
    ]);
    expect(await drawService.getExclusions(drawId)).toEqual([]);

    // Joining again starts with an empty letter.
    await signInAs('alice', 'Ania Test');
    expect(await drawService.getDrawPreviews(alice.uid)).toEqual([]);
    await drawService.joinToDraw(drawId, alice, 'secret1');
    expect(await drawService.getLetter(drawId, alice.uid)).toEqual(letter(''));
  });

  it('draws around the exclusions', async () => {
    const owner = await signInAs('owner', 'Olga Owner');
    const drawId = await drawService.createDraw(newDrawForm, owner);
    const people = [owner];
    for (const [sub, name] of [
      ['alice', 'Ania Test'],
      ['bob', 'Bob Test'],
      ['celina', 'Celina Test'],
    ]) {
      const person = await signInAs(sub, name);
      await drawService.joinToDraw(drawId, person, 'secret1');
      people.push(person);
    }
    const [, alice, bob, celina] = people;

    await signInAs('owner', 'Olga Owner');
    await drawService.addExclusion(drawId, [alice.uid, bob.uid]);
    await drawService.addExclusion(drawId, [owner.uid, celina.uid]);
    await drawService.addExclusion(drawId, [celina.uid, bob.uid]);
    await drawService.removeExclusion(drawId, [bob.uid, celina.uid]);
    expect(await drawService.getExclusions(drawId)).toHaveLength(2);

    await drawService.startDraw(drawId, owner.uid);

    const pairs: Pair[] = [];
    for (const [sub, name, person] of [
      ['owner', 'Olga Owner', owner],
      ['alice', 'Ania Test', alice],
      ['bob', 'Bob Test', bob],
      ['celina', 'Celina Test', celina],
    ] as const) {
      await signInAs(sub, name);
      const assignment = await drawService.getMyAssignment(drawId, person.uid);
      pairs.push({ fromUuid: person.uid, toUuid: assignment!.toUuid });
    }
    expect(
      isValidDraw(
        pairs,
        people.map((p) => p.uid),
        [
          [alice.uid, bob.uid],
          [owner.uid, celina.uid],
        ],
      ),
    ).toBe(true);
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
      drawService.getMyAssignment(drawId, owner.uid),
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
      userEmail: user.email ?? '',
      message: 'Great app',
    });

    expect(await messageService.canUserSendMessageToday(user.uid)).toBe(false);
    await expect(
      messageService.sendMessage({
        userUid: user.uid,
        userName: 'Writer',
        userEmail: user.email ?? '',
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
        userEmail: user.email ?? '',
        message: 'Sent at 23:59:59',
      });
    } finally {
      clock.mockRestore();
    }

    // Stored under the server's today, so the daily limit still holds.
    expect(await messageService.canUserSendMessageToday(user.uid)).toBe(false);
  });

  it('pages messages newest first for the verified admin', async () => {
    const older = await signInAs('older-writer', 'Older Writer');
    await messageService.sendMessage({
      userUid: older.uid,
      userName: 'Older Writer',
      userEmail: older.email ?? '',
      message: 'Older message',
    });

    await new Promise((resolve) => setTimeout(resolve, 10));
    const newer = await signInAs('newer-writer', 'Newer Writer');
    await messageService.sendMessage({
      userUid: newer.uid,
      userName: 'Newer Writer',
      userEmail: newer.email ?? '',
      message: 'Newer message',
    });

    await signInAs('admin', 'Artur', 'arturcz32@gmail.com');
    const firstPage = await messageService.getMessages(1);
    expect(firstPage.messages.map((message) => message.userName)).toEqual([
      'Newer Writer',
    ]);
    expect(firstPage.messages[0].userEmail).toBe(newer.email);
    expect(firstPage.hasMore).toBe(true);

    const secondPage = await messageService.getMessages(
      1,
      firstPage.lastDocument,
    );
    expect(secondPage.messages.map((message) => message.userName)).toEqual([
      'Older Writer',
    ]);
    // Other tests in this file leave messages too, so whether more pages
    // follow is not asserted here (AdminMessagesPage.test covers the end).
  });
});
