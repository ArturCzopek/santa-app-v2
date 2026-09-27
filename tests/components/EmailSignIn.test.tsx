// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './renderWithProviders';

const auth = vi.hoisted(() => ({
  user: null as unknown,
  setDisplayName: vi.fn(),
  logOut: vi.fn(),
}));

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: auth.user,
    loading: false,
    signInWithGoogle: vi.fn(),
    setDisplayName: auth.setDisplayName,
    logOut: auth.logOut,
  }),
}));
vi.mock('../../src/services/emailLink', () => ({
  sendLoginLink: vi.fn(),
  isLoginLink: vi.fn(() => false),
  pendingLoginEmail: vi.fn(() => ''),
  finishLoginLink: vi.fn(),
}));

import LoginPage from '../../src/pages/LoginPage';
import NamePage from '../../src/pages/NamePage';
import JoinToDrawPage from '../../src/pages/JoinToDrawPage';
import {
  finishLoginLink,
  isLoginLink,
  pendingLoginEmail,
  sendLoginLink,
} from '../../src/services/emailLink';

beforeEach(() => {
  vi.clearAllMocks();
  auth.user = null;
  vi.mocked(isLoginLink).mockReturnValue(false);
  vi.mocked(pendingLoginEmail).mockReturnValue('');
});

describe('Sign-in by email link', () => {
  it('sends the link and says where it went', async () => {
    vi.mocked(sendLoginLink).mockResolvedValue();
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(
      screen.getByRole('button', {
        name: 'Nie masz konta Google? Zaloguj się e-mailem',
      }),
    );
    const field = screen.getByLabelText('Adres e-mail');
    await user.type(field, 'not-an-address');
    await user.click(
      screen.getByRole('button', { name: 'Wyślij link do logowania' }),
    );
    expect(
      screen.getByText('Wpisz poprawny adres e-mail.'),
    ).toBeInTheDocument();
    expect(sendLoginLink).not.toHaveBeenCalled();

    await user.clear(field);
    await user.type(field, ' ania@example.com ');
    await user.click(
      screen.getByRole('button', { name: 'Wyślij link do logowania' }),
    );

    // From the plain login page the person goes on to their draws.
    expect(sendLoginLink).toHaveBeenCalledWith('ania@example.com', '/draws');
    expect(
      await screen.findByText(
        /Wysłaliśmy link do logowania na ania@example\.com/,
      ),
    ).toBeInTheDocument();
  });

  it('comes back to the invite it was asked from', async () => {
    vi.mocked(sendLoginLink).mockResolvedValue();
    const user = userEvent.setup();
    renderWithProviders(<JoinToDrawPage />, {
      route: '/join/d1?k=secret',
      path: '/join/:drawId',
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Nie masz konta Google? Zaloguj się e-mailem',
      }),
    );
    await user.type(screen.getByLabelText('Adres e-mail'), 'ania@example.com');
    await user.click(
      screen.getByRole('button', { name: 'Wyślij link do logowania' }),
    );

    expect(sendLoginLink).toHaveBeenCalledWith(
      'ania@example.com',
      '/join/d1?k=secret',
    );
  });

  it('finishes signing in from the link and goes on', async () => {
    vi.mocked(isLoginLink).mockReturnValue(true);
    vi.mocked(pendingLoginEmail).mockReturnValue('ania@example.com');
    vi.mocked(finishLoginLink).mockResolvedValue('/draws');
    renderWithProviders(<LoginPage />);

    expect(await screen.findByText('Draws list page')).toBeInTheDocument();
    expect(finishLoginLink).toHaveBeenCalledWith('ania@example.com');
  });

  it('asks for the address when the link opens in another browser', async () => {
    vi.mocked(isLoginLink).mockReturnValue(true);
    vi.mocked(finishLoginLink).mockResolvedValue('/draws');
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    expect(
      screen.getByText(/Link otwarto w innej przeglądarce/),
    ).toBeInTheDocument();
    expect(finishLoginLink).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('Adres e-mail'), 'ania@example.com');
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    expect(await screen.findByText('Draws list page')).toBeInTheDocument();
    expect(finishLoginLink).toHaveBeenCalledWith('ania@example.com');
  });

  it('says so when the link is used up', async () => {
    vi.mocked(isLoginLink).mockReturnValue(true);
    vi.mocked(pendingLoginEmail).mockReturnValue('ania@example.com');
    vi.mocked(finishLoginLink).mockRejectedValue({
      code: 'auth/invalid-action-code',
    });
    renderWithProviders(<LoginPage />);

    expect(
      await screen.findByText(/Ten link wygasł albo został już użyty/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Wróć do logowania' }),
    ).toBeInTheDocument();
  });

  it('asks a new email account for a name', async () => {
    auth.setDisplayName.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithProviders(<NamePage />);

    await user.click(screen.getByRole('button', { name: 'Zapisz' }));
    expect(screen.getByText('Wpisz swoje imię.')).toBeInTheDocument();
    expect(auth.setDisplayName).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Twoje imię'), '  Ania  ');
    await user.click(screen.getByRole('button', { name: 'Zapisz' }));
    expect(auth.setDisplayName).toHaveBeenCalledWith('Ania');
  });
});
