// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { MessageDocument } from '../../src/models/Message';
import { renderWithProviders } from './renderWithProviders';
import i18n from '../../src/i18n';

const { getMessagesMock, useAuthMock } = vi.hoisted(() => ({
  getMessagesMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock('../../src/services/MessageService', () => ({
  messageService: { getMessages: getMessagesMock },
}));
vi.mock('../../src/hooks/useAuth', () => ({ useAuth: useAuthMock }));

import AdminMessagesPage from '../../src/pages/AdminMessagesPage';

const record = (
  id: string,
  userName: string,
  message: string,
  userEmail?: string,
): MessageDocument => ({
  id,
  userUid: id,
  userName,
  ...(userEmail === undefined ? {} : { userEmail }),
  message,
  date: Timestamp.fromDate(new Date('2026-09-27T10:00:00Z')),
});

describe('AdminMessagesPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage('pl');
    getMessagesMock.mockReset();
    useAuthMock.mockReturnValue({
      user: {
        uid: 'admin',
        displayName: 'Artur',
        email: 'arturcz32@gmail.com',
        emailVerified: true,
        photoURL: null,
      },
      logOut: vi.fn(),
    });
  });

  it('loads older messages and hides the button when there are no more', async () => {
    const cursor = {} as QueryDocumentSnapshot;
    getMessagesMock
      .mockResolvedValueOnce({
        messages: [record('new', 'Ania', 'Najnowsza wiadomość')],
        lastDocument: cursor,
        hasMore: true,
      })
      .mockResolvedValueOnce({
        messages: [record('old', 'Jan', 'Starsza wiadomość')],
        lastDocument: undefined,
        hasMore: false,
      });

    renderWithProviders(<AdminMessagesPage />);

    expect(await screen.findByText('Najnowsza wiadomość')).toBeInTheDocument();
    const showOlder = screen.getByRole('button', { name: 'Pokaż starsze' });
    await userEvent.setup().click(showOlder);

    expect(await screen.findByText('Starsza wiadomość')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Pokaż starsze' }),
      ).not.toBeInTheDocument(),
    );
    expect(getMessagesMock).toHaveBeenNthCalledWith(2, 20, cursor);
  });

  it('shows the empty state', async () => {
    getMessagesMock.mockResolvedValue({
      messages: [],
      lastDocument: undefined,
      hasMore: false,
    });

    renderWithProviders(<AdminMessagesPage />);

    expect(
      await screen.findByText('Nie ma jeszcze wiadomości.'),
    ).toBeInTheDocument();
  });

  it('shows the account email and a reply link', async () => {
    getMessagesMock.mockResolvedValue({
      messages: [record('mail', 'Ania', 'Wiadomość', 'ania@example.com')],
      lastDocument: undefined,
      hasMore: false,
    });

    renderWithProviders(<AdminMessagesPage />);

    expect(await screen.findByText('ania@example.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Odpisz' })).toHaveAttribute(
      'href',
      `mailto:ania@example.com?subject=${encodeURIComponent('Santa App – odpowiedź na Twoją wiadomość')}`,
    );
  });

  it('does not show reply details for a legacy message without an email', async () => {
    getMessagesMock.mockResolvedValue({
      messages: [record('legacy', 'Ania', 'Wiadomość')],
      lastDocument: undefined,
      hasMore: false,
    });

    renderWithProviders(<AdminMessagesPage />);

    expect(await screen.findByText('Wiadomość')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Odpisz' })).not.toBeInTheDocument();
  });
});
