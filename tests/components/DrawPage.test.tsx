// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
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
    deleteDraw: vi.fn(),
    getExclusions: vi.fn(),
    addExclusion: vi.fn(),
    removeExclusion: vi.fn(),
    leaveDraw: vi.fn(),
    renewInviteKey: vi.fn(),
    updateWish: vi.fn(),
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

const participant = (
  uid: string,
  userName: string,
  wish = '',
): Participant => ({
  userUuid: uid,
  userName,
  userPhotoUrl: '',
  entryDate: new Date(),
  wish,
});

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
    await user.click(within(dialog).getByRole('button', { name: 'Losuj' }));

    expect(
      await screen.findByRole('heading', { name: 'Twój wynik losowania' }),
    ).toBeInTheDocument();
    expect(drawingService.startDraw).toHaveBeenCalledWith('d1', 'owner');
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
    await user.click(within(dialog).getByRole('button', { name: 'Losuj' }));

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
    await user.click(within(dialog).getByRole('button', { name: 'Losuj' }));

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
    await user.click(screen.getByRole('button', { name: 'Anuluj' }));
    expect(screen.queryByLabelText('Co chcesz dostać?')).toBeNull();
    expect(screen.getByText('Mountain book')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edytuj list' }));
    wishField = screen.getByLabelText('Co chcesz dostać?');
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

      await screen.findByRole('heading', { name: 'Wykluczenia (0)' });
      await pick(user, 'Osoba', 'Olga Owner');
      await pick(user, 'Nie losuje z', 'Ania Test');
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

      await screen.findByRole('heading', { name: 'Wykluczenia (0)' });
      await pick(user, 'Osoba', 'Ania Test');
      await pick(user, 'Nie losuje z', 'Bartek Test');
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
        await screen.findByRole('heading', { name: 'Wykluczenia (0)' }),
      ).toBeInTheDocument();
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
          'Brak wykluczeń – losujemy spośród wszystkich.',
        ),
      ).toBeInTheDocument();
      expect(
        within(dialog).getByText(/Czy to wszystkie pary/),
      ).toBeInTheDocument();
      expect(
        within(dialog).getByRole('button', { name: 'Losuj' }),
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
          /Usuń jedną z tych par: Ania Test ↔ Olga Owner/,
        ),
      ).toBeInTheDocument();
      expect(
        within(dialog).getByRole('button', { name: 'Losuj' }),
      ).toBeDisabled();
    });
  });
});
