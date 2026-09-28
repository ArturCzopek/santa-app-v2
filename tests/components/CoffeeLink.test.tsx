// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from '../../src/components/layout/Footer';
import type { Draw, Participant } from '../../src/models/Draw';
import { fakeUser, renderWithProviders } from './renderWithProviders';

const auth = vi.hoisted(() => ({ user: null as unknown }));

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: auth.user, loading: false }),
}));
vi.mock('../../src/services/DrawService', () => ({
  drawService: {
    getDraw: vi.fn(),
    getParticipants: vi.fn(),
    getInviteKey: vi.fn(),
    getExclusions: vi.fn(),
    getLetter: vi.fn(),
    getThanks: vi.fn(),
    getMyAssignment: vi.fn(),
    updateGiftBought: vi.fn(),
    saveThanks: vi.fn(),
    isDrawPasswordValid: vi.fn(),
    updateDrawDetails: vi.fn(),
    setDrawPassword: vi.fn(),
    deleteDraw: vi.fn(),
    addExclusion: vi.fn(),
    removeExclusion: vi.fn(),
    leaveDraw: vi.fn(),
    removeParticipant: vi.fn(),
    renewInviteKey: vi.fn(),
    updateLetter: vi.fn(),
    startDraw: vi.fn(),
  },
}));
vi.mock('../../src/services/MessageService', () => ({
  messageService: { canUserSendMessageToday: vi.fn(), sendMessage: vi.fn() },
}));

import DrawPage from '../../src/pages/DrawPage';
import { drawService } from '../../src/services/DrawService';
import i18n from '../../src/i18n';

const makeDraw = (status: Draw['status']): Draw => ({
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
  status,
  drawDate: status === 'DRAWED' ? new Date() : null,
});

const participants: Participant[] = [
  {
    userUuid: 'owner',
    userName: 'Olga Owner',
    userPhotoUrl: '',
    entryDate: new Date(),
    hasWish: true,
  },
  {
    userUuid: 'alice',
    userName: 'Ania Test',
    userPhotoUrl: '',
    entryDate: new Date(),
    hasWish: true,
  },
];

let activeDraw = makeDraw('WAITING_FOR_DRAW');

const renderDrawPage = () =>
  renderWithProviders(<DrawPage />, {
    route: '/draw/d1',
    path: '/draw/:drawId',
  });

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  void i18n.changeLanguage('pl');
  auth.user = fakeUser('alice', 'Ania Test');
  activeDraw = makeDraw('WAITING_FOR_DRAW');
  vi.mocked(drawService.getDraw).mockImplementation(async () => activeDraw);
  vi.mocked(drawService.getParticipants).mockResolvedValue(participants);
  vi.mocked(drawService.getInviteKey).mockResolvedValue('link-key');
  vi.mocked(drawService.getExclusions).mockResolvedValue([]);
  vi.mocked(drawService.getLetter).mockResolvedValue({
    wish: 'A good book',
    comment: '',
  });
  vi.mocked(drawService.getThanks).mockResolvedValue('');
  vi.mocked(drawService.getMyAssignment).mockResolvedValue({ toUuid: 'owner' });
  vi.mocked(drawService.updateGiftBought).mockResolvedValue();
  vi.mocked(drawService.saveThanks).mockResolvedValue();
});

it('keeps the coffee support link in the footer', () => {
  renderWithProviders(<Footer />);
  const link = screen.getByRole('link', { name: 'Postaw kawę' });
  expect(link).toHaveAttribute('href', 'https://buycoffee.to/czopo');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

it('shows the coffee support card to a participant after the draw', async () => {
  activeDraw = makeDraw('DRAWED');
  renderDrawPage();

  expect(
    await screen.findByRole('heading', {
      name: /Dziękuję, że korzystasz z Santa App!/,
    }),
  ).toBeInTheDocument();
  const link = screen.getByRole('link', { name: 'Postaw mi kawę' });
  expect(link).toHaveAttribute('href', 'https://buycoffee.to/czopo');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

it('does not show the coffee support card while the draw is waiting', async () => {
  renderDrawPage();

  expect(await screen.findByText('Office party')).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', {
      name: /Dziękuję, że korzystasz z Santa App!/,
    }),
  ).not.toBeInTheDocument();
});
