// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fakeUser, renderWithProviders } from './renderWithProviders';
import { Draw } from '../../src/models/Draw';

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
  drawService: { getDraw: vi.fn(), joinToDraw: vi.fn() },
}));
vi.mock('../../src/services/MessageService', () => ({
  messageService: { canUserSendMessageToday: vi.fn(), sendMessage: vi.fn() },
}));

import JoinToDrawPage from '../../src/pages/JoinToDrawPage';
import LoginPage from '../../src/pages/LoginPage';
import { drawService } from '../../src/services/DrawService';

const draw: Draw = {
  id: 'd1',
  createdDate: new Date(),
  ownerUuid: 'owner',
  ownerName: 'Olga Owner',
  ownerPhotoUrl: '',
  budget: 80,
  currency: 'PLN',
  drawName: 'Office party',
  description: 'Gifts!',
  participants: [],
  participantUuids: ['owner'],
  status: 'WAITING_FOR_DRAW',
  drawDate: null,
};

const renderJoinPage = () =>
  renderWithProviders(<JoinToDrawPage />, {
    route: '/join/d1',
    path: '/join/:drawId',
  });

beforeEach(() => {
  vi.clearAllMocks();
  auth.user = fakeUser('alice', 'Ania Test');
  vi.mocked(drawService.getDraw).mockResolvedValue(draw);
});

describe('JoinToDrawPage', () => {
  it('asks guests to sign in first', () => {
    auth.user = null;
    renderJoinPage();

    expect(screen.getByText(/Musisz się zalogować/)).toBeInTheDocument();
    expect(drawService.getDraw).not.toHaveBeenCalled();
    // Messages need an account; the modal used to spin forever for guests.
    expect(screen.queryByText(/Zostaw wiadomość/)).toBeNull();
  });

  it('shows the draw and its owner', async () => {
    renderJoinPage();

    expect(await screen.findByText('Office party')).toBeInTheDocument();
    expect(screen.getByText('Od: Olga Owner')).toBeInTheDocument();
    expect(screen.getByText(/Zostaw wiadomość/)).toBeInTheDocument();
  });

  it('shows an error for a wrong password', async () => {
    vi.mocked(drawService.joinToDraw).mockRejectedValue(
      new Error('Invalid password'),
    );
    const user = userEvent.setup();
    renderJoinPage();

    await user.type(await screen.findByLabelText(/Hasło/), 'wrong-1');
    await user.click(
      screen.getByRole('button', { name: 'Dołącz do losowania' }),
    );

    expect(await screen.findByText(/Nieprawidłowe hasło/)).toBeInTheDocument();
    expect(drawService.joinToDraw).toHaveBeenCalledWith(
      'd1',
      auth.user,
      'wrong-1',
    );
  });

  it('confirms joining with the right password', async () => {
    vi.mocked(drawService.joinToDraw).mockResolvedValue();
    const user = userEvent.setup();
    renderJoinPage();

    await user.type(await screen.findByLabelText(/Hasło/), 'secret1');
    await user.click(
      screen.getByRole('button', { name: 'Dołącz do losowania' }),
    );

    expect(await screen.findByText(/Jesteś w losowaniu/)).toBeInTheDocument();
  });

  it('does not offer joining a draw that already took place', async () => {
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...draw,
      status: 'DRAWED',
    });
    renderJoinPage();

    expect(await screen.findByText(/już się rozpoczęło/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Dołącz do losowania' }),
    ).toBeNull();
  });
});

describe('LoginPage', () => {
  it('sends signed-in users to their draws', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Draws list page')).toBeInTheDocument();
  });

  it('shows the Google sign-in button to guests', () => {
    auth.user = null;
    renderWithProviders(<LoginPage />);

    expect(
      screen.getByRole('button', { name: /Zaloguj przez Google/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/otwarta w innej aplikacji/)).toBeNull();
  });

  it('tells people inside Messenger & co. to open the page in their browser', () => {
    auth.user = null;
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/470.0.0.37.109]',
    );
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/otwarta w innej aplikacji/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Skopiuj link' }),
    ).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
