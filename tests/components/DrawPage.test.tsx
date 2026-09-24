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

const participant = (uid: string, userName: string, wish = ''): Participant => ({
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
  renderWithProviders(<DrawPage />, { route: '/draw/d1', path: '/draw/:drawId' });

beforeEach(() => {
  vi.clearAllMocks();
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
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({ toUuid: 'alice' });
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(await screen.findByRole('button', { name: 'Rozpocznij Losowanie' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/Hasło/), 'secret1');
    await user.click(within(dialog).getByRole('button', { name: 'Losuj' }));

    expect(await screen.findByText('Twój Los')).toBeInTheDocument();
    expect(drawingService.startDraw).toHaveBeenCalledWith('d1', 'owner');
    // Regression: the page used to go blank because participants were lost.
    await waitFor(() => expect(screen.getAllByText('Ania Test').length).toBe(2));
    expect(screen.getByText('Socks')).toBeInTheDocument();
  });

  it('still shows your own wish, editable, after the draw', async () => {
    vi.mocked(drawService.getDraw).mockResolvedValue({
      ...waitingDraw,
      status: 'DRAWED',
      drawDate: new Date(),
    });
    vi.mocked(drawingService.getMyAssignment).mockResolvedValue({ toUuid: 'alice' });
    renderDrawPage();

    expect(await screen.findByText('Twój Los')).toBeInTheDocument();
    expect(screen.getByText('Socks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Wpisz swoje życzenie/)).toHaveValue('Mountain book');
    expect(screen.getByRole('button', { name: 'Edytuj życzenie' })).toBeEnabled();
  });

  it('does not start the draw with a wrong password', async () => {
    vi.mocked(drawService.isDrawPasswordValid).mockResolvedValue(false);
    const user = userEvent.setup();
    renderDrawPage();

    await user.click(await screen.findByRole('button', { name: 'Rozpocznij Losowanie' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/Hasło/), 'wrong-1');
    await user.click(within(dialog).getByRole('button', { name: 'Losuj' }));

    expect(await within(dialog).findByText('Nieprawidłowe hasło')).toBeInTheDocument();
    expect(drawingService.startDraw).not.toHaveBeenCalled();
  });

  it('only the owner sees the start button', async () => {
    auth.user = fakeUser('alice', 'Ania Test');
    renderDrawPage();

    expect(await screen.findByText('Office party')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Rozpocznij Losowanie' })).toBeNull();
  });

  it('denies access to users outside the draw', async () => {
    auth.user = fakeUser('mallory', 'Mallory');
    renderDrawPage();

    expect(await screen.findByText(/Powrót do Losowań/)).toBeInTheDocument();
    expect(screen.queryByText('Office party')).toBeNull();
    expect(drawService.getParticipants).not.toHaveBeenCalled();
  });

  it('lets a participant edit, cancel and save their wish', async () => {
    vi.mocked(drawService.updateWish).mockResolvedValue();
    const user = userEvent.setup();
    renderDrawPage();

    const wishField = await screen.findByPlaceholderText(/Wpisz swoje życzenie/);
    expect(wishField).toHaveValue('Mountain book');
    expect(wishField).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Edytuj życzenie' }));
    await user.clear(wishField);
    await user.type(wishField, 'Coffee');
    await user.click(screen.getByRole('button', { name: 'Anuluj' }));
    expect(wishField).toHaveValue('Mountain book');

    await user.click(screen.getByRole('button', { name: 'Edytuj życzenie' }));
    await user.clear(wishField);
    await user.type(wishField, 'Coffee');
    await user.click(screen.getByRole('button', { name: 'Zapisz życzenie' }));

    expect(await screen.findByText(/zostało zapisane pomyślnie/)).toBeInTheDocument();
    expect(drawService.updateWish).toHaveBeenCalledWith('d1', 'owner', 'Coffee');
    expect(wishField).toHaveValue('Coffee');
  });
});
