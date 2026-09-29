// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './renderWithProviders';
import i18n from '../../src/i18n';

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, logOut: vi.fn() }),
}));

import PrivacyPage from '../../src/pages/PrivacyPage';

describe('PrivacyPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage('pl');
  });

  it('describes browser storage in Polish and English', async () => {
    renderWithProviders(<PrivacyPage />);

    expect(
      screen.getByText(
        /Szkic listu do Mikołaja.*wybrany język.*nie są do nas wysyłane/,
        { selector: 'li' },
      ),
    ).toBeInTheDocument();
    // S3: how a deletion request after the draw is handled.
    expect(
      screen.getByText(
        /zastąpimy Twoje imię i zdjęcie napisem „Usunięta osoba”/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Podziękowanie widzisz tylko Ty i Twój Mikołaj\. Nikt inny, także organizator, nie ma do niego dostępu\. Uczestnicy widzą, czy kupiono już prezent – nie widzą, dla kogo\./,
        { selector: 'li' },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Losowanie przeprowadza serwer Santa App \(Google Cloud Functions w Warszawie\)\. Pełnego wyniku nie widzi nikt, także organizator/,
        { selector: 'li' },
      ),
    ).toBeInTheDocument();

    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'English' }));

    expect(
      await screen.findByText(
        /draft of your letter to Santa.*chosen language.*are not sent to us/,
        { selector: 'li' },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Santa App’s server \(Google Cloud Functions in Warsaw\) runs the draw\. Nobody, including the organizer, can see the full result/,
        { selector: 'li' },
      ),
    ).toBeInTheDocument();
  });
});
