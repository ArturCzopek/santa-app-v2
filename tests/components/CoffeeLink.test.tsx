// @vitest-environment jsdom
import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from '../../src/components/layout/Footer';
import DrawDoneModal from '../../src/components/draw/DrawDoneModal';
import type { Draw } from '../../src/models/Draw';
import { renderWithProviders } from './renderWithProviders';

it('links to the configured coffee profile from the footer and draw-done dialog', () => {
  const { unmount } = renderWithProviders(<Footer />);
  const footerLink = screen.getByRole('link', { name: 'Postaw kawę' });
  expect(footerLink).toHaveAttribute('href', 'https://buycoffee.to/czopo');
  expect(footerLink).toHaveAttribute('target', '_blank');
  expect(footerLink).toHaveAttribute('rel', 'noopener noreferrer');
  unmount();

  const draw = {
    id: 'test',
    drawName: 'Test',
    budget: 80,
    currency: 'PLN',
  } as Draw;
  renderWithProviders(<DrawDoneModal open onClose={() => {}} draw={draw} />);
  const dialogLink = screen.getByRole('link', { name: 'Postaw kawę' });
  expect(dialogLink).toHaveAttribute('href', 'https://buycoffee.to/czopo');
  expect(dialogLink).toHaveAttribute('target', '_blank');
  expect(dialogLink).toHaveAttribute('rel', 'noopener noreferrer');
});
