// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './renderWithProviders';
import i18n from '../../src/i18n';

const send = vi.fn().mockResolvedValue(undefined);
let emit: (messages: unknown[]) => void = () => {};

vi.mock('../../src/services/ChatService', () => ({
  chatService: {
    subscribe: (_d: string, _r: string, onMessages: (m: unknown[]) => void) => {
      emit = onMessages;
      onMessages([]);
      return () => {};
    },
    send: (...args: unknown[]) => send(...args),
  },
}));

import ChatSection from '../../src/components/draw/ChatSection';

describe('ChatSection', () => {
  beforeEach(async () => {
    send.mockClear();
    await i18n.changeLanguage('en');
  });

  it('sends as santa and labels messages without revealing the Santa', async () => {
    renderWithProviders(
      <ChatSection
        drawId="d1"
        recipientUid="bob"
        role="santa"
        otherName="Bob"
      />,
    );
    expect(screen.getByText('No messages yet.')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Your message'), '  Size?  ');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() =>
      expect(send).toHaveBeenCalledWith('d1', 'bob', 'santa', 'Size?'),
    );

    emit([
      { id: '1', from: 'santa', text: 'Size?', createdDate: null },
      { id: '2', from: 'recipient', text: 'M', createdDate: null },
    ]);
    expect(await screen.findByText('M')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows the recipient only "Your Santa" and disables an empty send', async () => {
    renderWithProviders(
      <ChatSection drawId="d1" recipientUid="bob" role="recipient" />,
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    emit([{ id: '1', from: 'santa', text: 'Hi', createdDate: null }]);
    expect(await screen.findByText('Your Santa')).toBeInTheDocument();
  });
});
