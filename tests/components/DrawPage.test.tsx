// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fakeUser, renderWithProviders } from './renderWithProviders';
import { Draw, Participant } from '../../src/models/Draw';

const auth = vi.hoisted(() => ({ user: null as unknown }));

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: auth.user,
    loading: false,
    signInWithGoogle: vi.fn(),
    logOut: vi.fn(),
  }),
}));
vi.mock('../../src/services/DrawService', () => ({
  drawService: {
    getDraw: vi.fn(),
    getParticipants: vi.fn(),
    isDrawPasswordValid: vi.fn(),
    getInviteKey: vi.fn(),
    updateDrawDetails: vi.fn(),
    setDrawPassword: vi.fn(),
    deleteDraw: vi.fn(),
    getExclusions: vi.fn(),
    addExclusion: vi.fn(),
    removeExclusion: vi.fn(),
    leaveDraw: vi.fn(),
    removeParticipant: vi.fn(),
    renewInviteKey: vi.fn(),
    updateWish: vi.fn(),
    getLetter: vi.fn(),
  },
}));
vi.mock('../../src/services/DrawingService', () => ({
  drawingService: { startDraw: vi.fn(), getMyAssignment: vi.fn() },
}));
vi.mock('../../src/services/MessageService', () => ({
  messageService: { canUserSendMessageToday: vi.fn(), sendMessage: vi.fn() },
}));

import DrawPage from '../../src/pages/DrawPage';
import { drawService } from '../../src/services/DrawService';
import { drawingService } from '../../src/services/DrawingService';

// Letters live apart from participants; getLetter below serves them.
let letters: Record<string, string> = {};

const participant = (uid: string, userName: string, wish = ''): Participant => {
  letters[uid] = wish;
  return {
    userUuid: uid,
    userName,
    userPhotoUrl: '',
    entryDate: new Date(),
    hasWish: wish !== '',
  };
};

const waitingDraw: Draw = {
  id: 'd1',
  createdDate: new Date(),
  ownerUuid: 'owner',
  ownerName: 'Olga Owner',
  budget: 80,
  currency: 'PLN',
  drawName: 'Office party',
  description: 'Gifts!',
  participants: [],
  participantUuids: ['owner', 'alice'],
  status: 'WAITING_FOR_DRAW',
  drawDate: null,
};

const renderDrawPage = () =>
  renderWithProviders(<DrawPage />, {
    route: '/draw/d1',
    path: '/draw/:drawId',
  });

const openEnvelope = async (user = userEvent.setup()) =>
  user.click(
    await screen.findByRole('button', {
      name: 'Otwórz kopertę z wynikiem losowania',
    }),
  );

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(drawService.getInviteKey).mockResolvedValue('link-key');
  vi.mocked(drawService.getExclusions).mockResolvedValue([]);
  letters = {};
  vi.mocked(drawService.getLetter).mockImplementation(
    async (_, uid) => letters[uid] ?? '',
  );
  auth.user = fakeUser('owner', 'Olga Owner');
  vi.mocked(drawService.getDraw).mockResolvedValue(waitingDraw);
  vi.mocked(drawService.getParticipants).mockResolvedValue([
    participant('owner', 'Olga Owner', 'Mountain book'),
    participant('alice', 'Ania Test', 'Socks'),
  ]);
});

describe('DrawPage', () => {
  it('shows the draw and its participants', async () => {
    renderDrawPage();

    expect(await screen.findByText('Office party')).toBeInTheDocument();
    expect(screen.getByText('Ania Test')).toBeInTheDocument();
    // Once in the navbar (signed-in user) and once in the participant list.
    expect(screen.getAllByText('Olga Owner')).toHaveLength(2);
  });

  it('keeps participants and shows the result after the owner starts the draw', async () => {
    vi.mocked(drawService.isDrawPasswordValid).mockResolvedValue(true);
    vi.mocked(drawingService.startDraw).mockResolvedValue({
      ...waitingDraw,
      status: 'DRAWED',
      drawDate: new Date(),
    });
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({
      toUuid: 'alice',
    });
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Rozpocznij losowanie' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/Hasło/), 'secret1');
    await user.click(within(dialog).getByRole('button', { name: 'Losuj pary' }));

    // The owner gets a ready message telling everyone the envelopes are here.
    const done = await screen.findByRole('dialog', {
      name: 'Gotowe! Pary wylosowane',
    });
    expect(drawingService.startDraw).toHaveBeenCalledWith('d1', 'owner');
    expect(within(done).getByText(/Koperty już czekają!/)).toBeInTheDocument();
    expect(
      within(done).getByText(/Otwórz swoją kopertę.*#\/draw\/d1/),
    ).toBeInTheDocument();
    await user.click(within(done).getByRole('button', { name: 'Zamknij' }));
    expect(
      await screen.findByRole('heading', { name: 'Twój wynik losowania' }),
    ).toBeInTheDocument();
    await openEnvelope(user);
    // Regression: the page used to go blank because participants were lost.
    await waitFor(() =>
      expect(screen.getAllByText('Ania Test').length).toBe(2),
    );
    expect(screen.getByText('Socks')).toBeInTheDocument();
    // The list folds away once the draw is done, also without a reload.
    expect(
      screen.getByRole('button', { name: 'Uczestnicy (2)' }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('says what the draw is waiting for and who acts next', async () => {
    renderDrawPage();
    // Both people in the default draw have written their letter.
    expect(
      await screen.findByText(
        'Wszystkie listy gotowe – możesz rozpocząć losowanie.',
      ),
    ).toBeInTheDocument();
  });

  describe('the one red action follows the next step', () => {
    const containedButtons = () =>
      screen
        .getAllByRole('button')
        .filter((button) => button.classList.contains('MuiButton-contained'))
        .map((button) => button.textContent);

    it('is "Napisz list" while your letter is missing, and opens the editor', async () => {
      vi.mocked(drawService.getParticipants).mockResolvedValue([
        participant('owner', 'Olga Owner'),
        participant('alice', 'Ania Test', 'Socks'),
      ]);
      const user = userEvent.setup();
      renderDrawPage();

      await screen.findByText('Office party');
      expect(containedButtons()).toEqual(['Napisz list']);
      await user.click(screen.getByRole('button', { name: 'Napisz list' }));
      expect(await screen.findByLabelText('Co chcesz dostać?')).toHaveFocus();
      expect(containedButtons()).toEqual(['Zapisz list']);
    });

    it('is "Rozpocznij losowanie" for the owner once every letter is in', async () => {
      renderDrawPage();
      await screen.findByText('Office party');
      expect(containedButtons()).toEqual(['Rozpocznij losowanie']);
    });

    it('is the invite while letters are still missing', async () => {
      vi.mocked(drawService.getParticipants).mockResolvedValue([
        participant('owner', 'Olga Owner', 'Mountain book'),
        participant('alice', 'Ania Test'),
      ]);
      renderDrawPage();
      await screen.findByText('Office party');
      expect(containedButtons()).toEqual(['Zaproś do losowania']);
    });
  });

  it('tells a participant that the organizer starts the draw', async () => {
    auth.user = fakeUser('alice', 'Ania Test');
    renderDrawPage();
    expect(
      await screen.findByText(/Olga Owner rozpocznie losowanie/),
    ).toBeInTheDocument();
  });

  it('still shows your own wish, editable, after the draw', async () => {
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...waitingDraw,
      status: 'DRAWED',
      drawDate: new Date(),
    });
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({
      toUuid: 'alice',
    });
    renderDrawPage();

    expect(
      await screen.findByRole('heading', { name: 'Twój wynik losowania' }),
    ).toBeInTheDocument();
    await openEnvelope();
    expect(await screen.findByText('Socks')).toBeInTheDocument();
    expect(screen.getByText('Mountain book')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edytuj list' })).toBeEnabled();
    // Only the user's own letter and the one of their recipient are fetched.
    expect(
      vi
        .mocked(drawService.getLetter)
        .mock.calls.map(([, uid]) => uid)
        .sort(),
    ).toEqual(['alice', 'owner']);
  });

  it('does not start the draw with a wrong password', async () => {
    vi.mocked(drawService.isDrawPasswordValid).mockResolvedValue(false);
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Rozpocznij losowanie' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/Hasło/), 'wrong-1');
    await user.click(within(dialog).getByRole('button', { name: 'Losuj pary' }));

    expect(
      await within(dialog).findByText('Nieprawidłowe hasło'),
    ).toBeInTheDocument();
    expect(drawingService.startDraw).not.toHaveBeenCalled();
  });

  it('explains in Polish when starting the draw fails', async () => {
    vi.mocked(drawService.isDrawPasswordValid).mockResolvedValue(true);
    vi.mocked(drawingService.startDraw).mockRejectedValue(
      new Error('Draw cannot be started'),
    );
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Rozpocznij losowanie' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/Hasło/), 'secret1');
    await user.click(within(dialog).getByRole('button', { name: 'Losuj pary' }));

    expect(
      await screen.findByText(/Nie udało się przeprowadzić losowania/),
    ).toBeInTheDocument();
    expect(screen.queryByText('Draw cannot be started')).toBeNull();
  });

  it('only the owner sees the start button', async () => {
    auth.user = fakeUser('alice', 'Ania Test');
    renderDrawPage();

    expect(await screen.findByText('Office party')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Rozpocznij losowanie' }),
    ).toBeNull();
  });

  it('denies access to users outside the draw', async () => {
    auth.user = fakeUser('mallory', 'Mallory');
    renderDrawPage();

    expect(await screen.findByText(/Powrót do losowań/)).toBeInTheDocument();
    expect(screen.queryByText('Office party')).toBeNull();
    expect(drawService.getParticipants).not.toHaveBeenCalled();
  });

  it('lets a participant edit, cancel and save their wish', async () => {
    vi.mocked(drawService.updateWish).mockResolvedValue();
    const user = userEvent.setup();
    renderDrawPage();

    expect(await screen.findByText('Mountain book')).toBeInTheDocument();
    expect(screen.queryByLabelText('Co chcesz dostać?')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Edytuj list' }));
    let wishField = screen.getByLabelText('Co chcesz dostać?');
    expect(wishField).toHaveValue('Mountain book');
    // Same limit as the rules, so a long wish cannot fail on save.
    expect(wishField).toHaveAttribute('maxLength', '2000');
    expect(screen.getByText('13 / 2000')).toBeInTheDocument();
    await user.clear(wishField);
    await user.type(wishField, 'Coffee');
    // Unsaved changes are not thrown away without asking.
    await user.click(screen.getByRole('button', { name: 'Anuluj' }));
    const discard = await screen.findByRole('dialog', {
      name: 'Odrzucić zmiany?',
    });
    await user.click(within(discard).getByRole('button', { name: 'Anuluj' }));
    expect(screen.getByLabelText('Co chcesz dostać?')).toHaveValue('Coffee');
    await user.click(screen.getByRole('button', { name: 'Anuluj' }));
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Odrzucić zmiany?' }),
      ).getByRole('button', { name: 'Odrzuć' }),
    );
    expect(screen.queryByLabelText('Co chcesz dostać?')).toBeNull();
    expect(screen.getByText('Mountain book')).toBeInTheDocument();

    await user.click(
      await screen.findByRole('button', { name: 'Edytuj list' }),
    );
    wishField = screen.getByLabelText('Co chcesz dostać?');
    // The discarded draft does not come back.
    expect(wishField).toHaveValue('Mountain book');
    await user.clear(wishField);
    await user.type(wishField, 'Coffee');
    await user.click(screen.getByRole('button', { name: 'Zapisz list' }));

    expect(await screen.findByText(/List zapisany/)).toBeInTheDocument();
    expect(drawService.updateWish).toHaveBeenCalledWith(
      'd1',
      'owner',
      'Coffee',
    );
    expect(screen.getByText('Coffee')).toBeInTheDocument();
  });

  it('brings back an unsaved letter after a reload', async () => {
    localStorage.setItem(
      'santa-app.letter-draft.d1.owner',
      'Mountain book and a map',
    );
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Edytuj list' }),
    );
    expect(screen.getByLabelText('Co chcesz dostać?')).toHaveValue(
      'Mountain book and a map',
    );
    expect(
      screen.getByText(/Przywrócono niezapisany szkic/),
    ).toBeInTheDocument();
  });

  it('keeps the draft and says so when saving the wish fails', async () => {
    vi.mocked(drawService.updateWish).mockRejectedValue(new Error('offline'));
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Edytuj list' }),
    );
    const wishField = screen.getByLabelText('Co chcesz dostać?');
    await user.clear(wishField);
    await user.type(wishField, 'Coffee');
    await user.click(screen.getByRole('button', { name: 'Zapisz list' }));

    expect(
      await screen.findByText(/Nie udało się zapisać listu/),
    ).toBeInTheDocument();
    expect(wishField).toHaveValue('Coffee');
  });
  it('keeps the result sealed until you open the envelope, then remembers it', async () => {
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...waitingDraw,
      status: 'DRAWED',
      drawDate: new Date(),
    });
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({
      toUuid: 'alice',
    });
    const { unmount } = renderDrawPage();

    await screen.findByRole('button', {
      name: 'Otwórz kopertę z wynikiem losowania',
    });
    expect(screen.queryByText('Socks')).not.toBeInTheDocument();

    await openEnvelope();
    expect(await screen.findByText('Kupujesz prezent dla')).toBeInTheDocument();

    unmount();
    renderDrawPage();
    expect(await screen.findByText('Kupujesz prezent dla')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Otwórz kopertę z wynikiem losowania',
      }),
    ).not.toBeInTheDocument();
  });

  it('folds the participant list away after the draw', async () => {
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...waitingDraw,
      status: 'DRAWED',
      drawDate: new Date(),
    });
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({
      toUuid: 'alice',
    });
    const user = userEvent.setup();
    renderDrawPage();

    const toggle = await screen.findByRole('button', {
      name: 'Uczestnicy (2)',
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the owner how many letters are written before the draw', async () => {
    vi.mocked(drawService.getParticipants).mockResolvedValue([
      participant('owner', 'Olga Owner', 'Mountain book'),
      participant('alice', 'Ania Test'),
    ]);
    renderDrawPage();

    expect(
      await screen.findByText('Napisane listy: 1 z 2'),
    ).toBeInTheDocument();
  });

  it('does not show the letter count to other participants', async () => {
    auth.user = fakeUser('alice', 'Ania Test');
    renderDrawPage();

    await screen.findByText('Office party');
    expect(screen.queryByText(/Napisane listy/)).not.toBeInTheDocument();
  });
  it('opens the invite with the key link right after creating the draw', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DrawPage />, {
      route: {
        pathname: '/draw/d1',
        state: { justJoined: true, justCreated: true },
      },
      path: '/draw/:drawId',
    });

    const dialog = await screen.findByRole('dialog', {
      name: 'Wyślij zaproszenie',
    });
    expect(
      await within(dialog).findByText(/#\/join\/d1\?k=link-key/),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Budżet na prezent: 80 PLN/),
    ).toBeInTheDocument();
    expect(within(dialog).queryByText(/Hasło/)).not.toBeInTheDocument();

    await user.click(
      within(dialog).getByRole('button', { name: 'Kopiuj zaproszenie' }),
    );
    // user-event provides the clipboard.
    expect(await navigator.clipboard.readText()).toMatch(
      /#\/join\/d1\?k=link-key/,
    );
  });

  it('gives an old draw its link the first time the owner invites', async () => {
    vi.mocked(drawService.getInviteKey).mockResolvedValue(null);
    vi.mocked(drawService.renewInviteKey).mockResolvedValue('fresh-key');
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Zaproś do losowania' }),
    );
    const dialog = await screen.findByRole('dialog');
    expect(
      await within(dialog).findByText(/#\/join\/d1\?k=fresh-key/),
    ).toBeInTheDocument();
  });

  it('lets the owner replace a link that got out', async () => {
    vi.mocked(drawService.renewInviteKey).mockResolvedValue('new-key');
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Zaproś do losowania' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(
      await within(dialog).findByRole('button', { name: /Utwórz nowy/ }),
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Tak, utwórz nowy link' }),
    );
    expect(
      await within(dialog).findByText(/#\/join\/d1\?k=new-key/),
    ).toBeInTheDocument();
    expect(drawService.renewInviteKey).toHaveBeenCalledWith('d1');
  });

  it('shares the invite with the phone share sheet', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
    });
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Zaproś do losowania' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: 'Udostępnij' }),
    );

    expect(share).toHaveBeenCalledWith({
      title: 'Office party',
      text: expect.stringContaining('?k=link-key'),
    });
    expect(share.mock.calls[0][0].text).toContain('#/join/d1');
    Reflect.deleteProperty(navigator, 'share');
  });
  it('shows when and where the gifts are exchanged, also in the invite', async () => {
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...waitingDraw,
      eventDate: '2026-12-24',
      eventPlace: 'U babci',
    });
    const user = userEvent.setup();
    renderDrawPage();

    expect(await screen.findByText('24 grudnia 2026')).toBeInTheDocument();
    expect(screen.getByText('U babci')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Zaproś do losowania' }),
    );
    const dialog = await screen.findByRole('dialog');
    expect(
      await within(dialog).findByText(
        /Wręczenie prezentów: 24 grudnia 2026, U babci\./,
      ),
    ).toBeInTheDocument();
  });
  it('lets the owner edit the draw before it takes place', async () => {
    vi.mocked(drawService.updateDrawDetails).mockResolvedValue();
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(await screen.findByRole('button', { name: 'Więcej' }));
    await user.click(
      screen.getByRole('menuitem', { name: 'Edytuj losowanie' }),
    );
    const dialog = await screen.findByRole('dialog');
    const name = within(dialog).getByLabelText('Nazwa losowania');
    await user.clear(name);
    await user.type(name, 'Wigilia');
    await user.click(
      within(dialog).getByRole('button', { name: 'Zapisz zmiany' }),
    );

    expect(drawService.updateDrawDetails).toHaveBeenCalledWith(
      'd1',
      expect.objectContaining({ drawName: 'Wigilia', budget: 80 }),
    );
    expect(
      await screen.findByRole('heading', { name: 'Wigilia' }),
    ).toBeInTheDocument();
  });

  it('lets the owner set a new password, also from the start dialog', async () => {
    vi.mocked(drawService.setDrawPassword).mockResolvedValue();
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(
      await screen.findByRole('button', { name: 'Rozpocznij losowanie' }),
    );
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', {
        name: 'Nie pamiętasz hasła? Ustaw nowe',
      }),
    );
    const dialog = await screen.findByRole('dialog', {
      name: 'Ustaw nowe hasło',
    });
    await user.type(within(dialog).getByLabelText(/Nowe hasło/), 'abc');
    await user.click(
      within(dialog).getByRole('button', { name: 'Zapisz hasło' }),
    );
    expect(
      await within(dialog).findByText(/przynajmniej 6 znaków/),
    ).toBeInTheDocument();
    expect(drawService.setDrawPassword).not.toHaveBeenCalled();

    await user.type(within(dialog).getByLabelText(/Nowe hasło/), '123');
    await user.click(
      within(dialog).getByRole('button', { name: 'Zapisz hasło' }),
    );
    expect(drawService.setDrawPassword).toHaveBeenCalledWith('d1', 'abc123');
    expect(await screen.findByText('Nowe hasło zapisane.')).toBeInTheDocument();
  });

  describe('gift exchange date', () => {
    const openEdit = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(await screen.findByRole('button', { name: 'Więcej' }));
      await user.click(
        screen.getByRole('menuitem', { name: 'Edytuj losowanie' }),
      );
      return screen.findByRole('dialog');
    };

    it('refuses a date that has passed', async () => {
      const user = userEvent.setup();
      renderDrawPage();

      const dialog = await openEdit(user);
      fireEvent.change(
        within(dialog).getByLabelText(/Data wręczenia prezentów/),
        { target: { value: '2020-01-01' } },
      );
      await user.click(
        within(dialog).getByRole('button', { name: 'Zapisz zmiany' }),
      );

      expect(
        await within(dialog).findByText(
          'Wybierz dzisiejszą albo późniejszą datę',
        ),
      ).toBeInTheDocument();
      expect(drawService.updateDrawDetails).not.toHaveBeenCalled();
    });

    it('keeps a stored date that has passed when other fields change', async () => {
      vi.mocked(drawService.getDraw).mockResolvedValue({
        ...waitingDraw,
        eventDate: '2020-12-24',
      });
      vi.mocked(drawService.updateDrawDetails).mockResolvedValue();
      const user = userEvent.setup();
      renderDrawPage();

      const dialog = await openEdit(user);
      const name = within(dialog).getByLabelText('Nazwa losowania');
      await user.clear(name);
      await user.type(name, 'Wigilia');
      await user.click(
        within(dialog).getByRole('button', { name: 'Zapisz zmiany' }),
      );

      expect(drawService.updateDrawDetails).toHaveBeenCalledWith(
        'd1',
        expect.objectContaining({ eventDate: '2020-12-24' }),
      );
    });
  });

  it('lets a participant leave, but not edit, before the draw', async () => {
    vi.mocked(drawService.leaveDraw).mockResolvedValue();
    auth.user = fakeUser('alice', 'Ania Test');
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(await screen.findByRole('button', { name: 'Więcej' }));
    expect(
      screen.queryByRole('menuitem', { name: 'Edytuj losowanie' }),
    ).toBeNull();
    await user.click(screen.getByRole('menuitem', { name: 'Opuść losowanie' }));
    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText(/Twój list do Mikołaja zostanie usunięty/),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Opuść' }));

    expect(drawService.leaveDraw).toHaveBeenCalledWith('d1', 'alice');
    expect(await screen.findByText('Draws list page')).toBeInTheDocument();
  });

  it('lets the owner delete the draw after confirming', async () => {
    vi.mocked(drawService.deleteDraw).mockResolvedValue();
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(await screen.findByRole('button', { name: 'Więcej' }));
    await user.click(screen.getByRole('menuitem', { name: 'Usuń losowanie' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Anuluj' }));
    expect(drawService.deleteDraw).not.toHaveBeenCalled();

    // Waits for the dialog to close and give the page back.
    await user.click(await screen.findByRole('button', { name: 'Więcej' }));
    await user.click(screen.getByRole('menuitem', { name: 'Usuń losowanie' }));
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', {
        name: 'Usuń',
      }),
    );
    expect(drawService.deleteDraw).toHaveBeenCalledWith('d1');
    expect(await screen.findByText('Draws list page')).toBeInTheDocument();
  });

  it('lets the owner take someone else out before the draw', async () => {
    vi.mocked(drawService.removeParticipant).mockResolvedValue();
    const user = userEvent.setup();
    renderDrawPage();

    await screen.findByText('Office party');
    // Not the owner themselves.
    expect(
      screen.queryByRole('button', {
        name: 'Usuń z losowania: Olga Owner',
      }),
    ).toBeNull();
    await user.click(
      screen.getByRole('button', { name: 'Usuń z losowania: Ania Test' }),
    );
    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText(/Ania Test przestanie brać udział/),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Usuń' }));

    expect(drawService.removeParticipant).toHaveBeenCalledWith('d1', 'alice');
    expect(
      await screen.findByText('Ania Test nie bierze już udziału w losowaniu.'),
    ).toBeInTheDocument();
    // Waits for the dialog to close and give the page back.
    expect(
      await screen.findByRole('heading', { name: 'Uczestnicy (1)' }),
    ).toBeInTheDocument();
  });

  it('does not let participants take anyone out', async () => {
    auth.user = fakeUser('alice', 'Ania Test');
    renderDrawPage();
    await screen.findByText('Office party');
    expect(
      screen.queryByRole('button', { name: /Usuń z losowania/ }),
    ).toBeNull();
  });

  it('offers no options after the draw', async () => {
    auth.user = fakeUser('owner', 'Olga Owner');
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...waitingDraw,
      status: 'DRAWED',
      drawDate: new Date(),
    });
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({
      toUuid: 'alice',
    });
    renderDrawPage();
    await screen.findByText('Office party');
    expect(screen.queryByRole('button', { name: 'Więcej' })).toBeNull();
  });
  describe('exclusions', () => {
    const pick = async (
      user: ReturnType<typeof userEvent.setup>,
      label: string,
      name: string,
    ) => {
      await user.click(screen.getByRole('combobox', { name: label }));
      await user.click(await screen.findByRole('option', { name }));
    };

    it('refuses a pair that would make the draw impossible (two people)', async () => {
      const user = userEvent.setup();
      renderDrawPage();

      await screen.findByRole('heading', { name: 'Pary, które się nie wylosują (0)' });
      await pick(user, 'Pierwsza osoba', 'Olga Owner');
      await pick(user, 'Druga osoba', 'Ania Test');
      await user.click(screen.getByRole('button', { name: 'Dodaj parę' }));

      expect(
        await screen.findByText(/losowanie byłoby niemożliwe/),
      ).toBeInTheDocument();
      expect(drawService.addExclusion).not.toHaveBeenCalled();
    });

    it('adds and removes a pair', async () => {
      vi.mocked(drawService.getDraw).mockResolvedValue({
        ...waitingDraw,
        participantUuids: ['owner', 'alice', 'bob', 'celina'],
      });
      vi.mocked(drawService.getParticipants).mockResolvedValue([
        participant('owner', 'Olga Owner'),
        participant('alice', 'Ania Test'),
        participant('bob', 'Bartek Test'),
        participant('celina', 'Celina Test'),
      ]);
      vi.mocked(drawService.addExclusion).mockResolvedValue();
      vi.mocked(drawService.removeExclusion).mockResolvedValue();
      const user = userEvent.setup();
      renderDrawPage();

      await screen.findByRole('heading', { name: 'Pary, które się nie wylosują (0)' });
      await pick(user, 'Pierwsza osoba', 'Ania Test');
      await pick(user, 'Druga osoba', 'Bartek Test');
      await user.click(screen.getByRole('button', { name: 'Dodaj parę' }));

      expect(drawService.addExclusion).toHaveBeenCalledWith('d1', [
        'alice',
        'bob',
      ]);
      expect(
        await screen.findByText('Ania Test ↔ Bartek Test'),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Usuń parę Ania Test ↔ Bartek Test',
        }),
      );
      expect(drawService.removeExclusion).toHaveBeenCalledWith('d1', [
        'alice',
        'bob',
      ]);
      expect(
        await screen.findByRole('heading', { name: 'Pary, które się nie wylosują (0)' }),
      ).toBeInTheDocument();
    });

    it('offers neither the same person nor an existing pair', async () => {
      vi.mocked(drawService.getDraw).mockResolvedValue({
        ...waitingDraw,
        participantUuids: ['owner', 'alice', 'bob', 'celina'],
      });
      vi.mocked(drawService.getParticipants).mockResolvedValue([
        participant('owner', 'Olga Owner'),
        participant('alice', 'Ania Test'),
        participant('bob', 'Bartek Test'),
        participant('celina', 'Celina Test'),
      ]);
      vi.mocked(drawService.getExclusions).mockResolvedValue([
        ['alice', 'bob'],
      ]);
      const user = userEvent.setup();
      renderDrawPage();

      await screen.findByRole('heading', { name: 'Pary, które się nie wylosują (1)' });
      await pick(user, 'Pierwsza osoba', 'Ania Test');
      await user.click(screen.getByRole('combobox', { name: 'Druga osoba' }));
      const options = (await screen.findAllByRole('option')).map(
        (option) => option.textContent,
      );
      expect(options).toEqual(['Celina Test', 'Olga Owner']);
    });

    it('treats a pair the same either way round', async () => {
      vi.mocked(drawService.getDraw).mockResolvedValue({
        ...waitingDraw,
        participantUuids: ['owner', 'alice', 'bob', 'celina'],
      });
      vi.mocked(drawService.getParticipants).mockResolvedValue([
        participant('owner', 'Olga Owner'),
        participant('alice', 'Ania Test'),
        participant('bob', 'Bartek Test'),
        participant('celina', 'Celina Test'),
      ]);
      // Stored as Ania-Bartek; picking from Bartek's side must see it too.
      vi.mocked(drawService.getExclusions).mockResolvedValue([
        ['alice', 'bob'],
      ]);
      const user = userEvent.setup();
      renderDrawPage();
      const optionsOf = async (label: string) => {
        await user.click(screen.getByRole('combobox', { name: label }));
        const names = (await screen.findAllByRole('option')).map(
          (option) => option.textContent,
        );
        await user.keyboard('{Escape}');
        return names;
      };

      await screen.findByRole('heading', { name: 'Pary, które się nie wylosują (1)' });
      await pick(user, 'Pierwsza osoba', 'Bartek Test');
      expect(await optionsOf('Druga osoba')).toEqual([
        'Celina Test',
        'Olga Owner',
      ]);

      // The same from the second field: either person hides the other.
      await pick(user, 'Pierwsza osoba', 'Celina Test');
      await pick(user, 'Druga osoba', 'Bartek Test');
      expect(await optionsOf('Pierwsza osoba')).toEqual([
        'Celina Test',
        'Olga Owner',
      ]);
      await pick(user, 'Druga osoba', 'Ania Test');
      expect(await optionsOf('Pierwsza osoba')).toEqual([
        'Celina Test',
        'Olga Owner',
      ]);
    });

    it('asks before the draw whether all exclusions are set', async () => {
      const user = userEvent.setup();
      renderDrawPage();

      await user.click(
        await screen.findByRole('button', { name: 'Rozpocznij losowanie' }),
      );
      const dialog = await screen.findByRole('dialog');
      expect(
        within(dialog).getByText(
          'Każdy może wylosować każdego.',
        ),
      ).toBeInTheDocument();
      expect(
        within(dialog).getByText(/Czy to wszystkie pary/),
      ).toBeInTheDocument();
      expect(
        within(dialog).getByRole('button', { name: 'Losuj pary' }),
      ).toBeEnabled();
    });

    it('blocks the draw and names the pair to remove when it is impossible', async () => {
      // Bartek left, so Olga and Ania are alone and excluded from each other.
      vi.mocked(drawService.getExclusions).mockResolvedValue([
        ['alice', 'owner'],
      ]);
      const user = userEvent.setup();
      renderDrawPage();

      await user.click(
        await screen.findByRole('button', { name: 'Rozpocznij losowanie' }),
      );
      const dialog = await screen.findByRole('dialog');
      expect(
        within(dialog).getByText(
          /Usuń jedną z nich: Ania Test ↔ Olga Owner/,
        ),
      ).toBeInTheDocument();
      expect(
        within(dialog).getByRole('button', { name: 'Losuj pary' }),
      ).toBeDisabled();
    });
  });
});
