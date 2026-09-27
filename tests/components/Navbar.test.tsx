// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './renderWithProviders';
import i18n from '../../src/i18n';

const useAuthMock = vi.hoisted(() => vi.fn());
vi.mock('../../src/hooks/useAuth', () => ({ useAuth: useAuthMock }));

import Navbar from '../../src/components/navbar/Navbar';

const signedInUser = (email: string, emailVerified = true) => ({
  uid: 'user',
  displayName: 'Artur',
  email,
  emailVerified,
  photoURL: null,
});

describe('Navbar admin messages link', () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage('pl');
  });

  const openAccountMenu = async () =>
    userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Menu konta: Artur' }));

  it('shows Wiadomości only for the verified admin email', async () => {
    useAuthMock.mockReturnValue({
      user: signedInUser('arturcz32@gmail.com'),
      logOut: vi.fn(),
    });
    const admin = renderWithProviders(<Navbar />);
    await openAccountMenu();
    expect(
      await screen.findByRole('menuitem', { name: 'Wiadomości' }),
    ).toBeInTheDocument();
    admin.unmount();

    useAuthMock.mockReturnValue({
      user: signedInUser('other@example.com'),
      logOut: vi.fn(),
    });
    renderWithProviders(<Navbar />);
    await openAccountMenu();
    expect(
      screen.queryByRole('menuitem', { name: 'Wiadomości' }),
    ).not.toBeInTheDocument();
  });

  it('hides Wiadomości when the admin email is not verified', async () => {
    useAuthMock.mockReturnValue({
      user: signedInUser('arturcz32@gmail.com', false),
      logOut: vi.fn(),
    });
    renderWithProviders(<Navbar />);
    await openAccountMenu();

    expect(
      screen.queryByRole('menuitem', { name: 'Wiadomości' }),
    ).not.toBeInTheDocument();
  });
});
