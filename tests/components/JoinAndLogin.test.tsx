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
import PrivacyPage from '../../src/pages/PrivacyPage';
import HelpPage from '../../src/pages/HelpPage';
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

    expect(
      screen.getByText(/Zaloguj się, żeby zobaczyć, kto zaprasza/),
    ).toBeInTheDocument();
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

  it('joins with the key from the invite link, without the password', async () => {
    vi.mocked(drawService.joinToDraw).mockResolvedValue();
    const user = userEvent.setup();
    renderWithProviders(<JoinToDrawPage />, {
      route: '/join/d1?k=link-key-1234567890abcd',
      path: '/join/:drawId',
    });

    await user.click(
      await screen.findByRole('button', { name: 'Dołącz do losowania' }),
    );

    expect(screen.queryByLabelText(/Hasło/)).not.toBeInTheDocument();
    expect(drawService.joinToDraw).toHaveBeenCalledWith(
      'd1',
      auth.user,
      'link-key-1234567890abcd',
    );
    expect(await screen.findByText(/Jesteś w losowaniu/)).toBeInTheDocument();
  });

  it('asks for the password when the link was replaced', async () => {
    vi.mocked(drawService.joinToDraw).mockRejectedValueOnce(
      new Error('Invalid password'),
    );
    const user = userEvent.setup();
    renderWithProviders(<JoinToDrawPage />, {
      route: '/join/d1?k=old-key-1234567890abcdef',
      path: '/join/:drawId',
    });

    await user.click(
      await screen.findByRole('button', { name: 'Dołącz do losowania' }),
    );

    expect(
      await screen.findByText(/Ten link już nie działa/),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Hasło/), 'secret1');
    await user.click(
      screen.getByRole('button', { name: 'Dołącz do losowania' }),
    );
    expect(drawService.joinToDraw).toHaveBeenLastCalledWith(
      'd1',
      auth.user,
      'secret1',
    );
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
    expect(
      screen.queryByRole('heading', {
        name: 'Otwórz tę stronę w przeglądarce',
      }),
    ).toBeNull();
  });

  it('inside Messenger & co. puts opening the page in a browser first', () => {
    auth.user = null;
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/470.0.0.37.109]',
    );
    renderWithProviders(<LoginPage />);

    const heading = screen.getByRole('heading', {
      name: 'Otwórz tę stronę w przeglądarce',
    });
    const copy = screen.getByRole('button', { name: 'Kopiuj link' });
    const google = screen.getByRole('button', { name: /Zaloguj przez Google/ });
    // Copying the link is the main action; Google comes after, as a fallback.
    expect(heading.compareDocumentPosition(google)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(copy).toHaveClass('MuiButton-contained');
    expect(google).toHaveClass('MuiButton-outlined');
    // The address stays on screen, in case copying is not allowed.
    expect(screen.getByLabelText('Adres tej strony')).toHaveValue(
      window.location.href,
    );
    vi.restoreAllMocks();
  });
});

describe('PrivacyPage', () => {
  it('is linked next to the sign-in button and open to guests', () => {
    auth.user = null;
    renderWithProviders(<LoginPage />);
    expect(
      screen.getByRole('link', { name: 'Jak używamy danych.' }),
    ).toHaveAttribute('href', '/privacy');

    renderWithProviders(<PrivacyPage />);
    expect(
      screen.getByRole('heading', { name: 'Polityka prywatności' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Kto odpowiada za dane' }),
    ).toBeInTheDocument();
  });
});

describe('HelpPage', () => {
  it('opens the answer a screen links to', () => {
    auth.user = null;
    renderWithProviders(<HelpPage />, { route: '/help?q=password' });

    expect(
      screen.getByRole('button', {
        name: 'Nie pamiętam hasła do losowania. Co teraz?',
      }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('button', { name: 'Czy to coś kosztuje?' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(/Ustaw nowe hasło/)).toBeVisible();
  });
});
