// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './renderWithProviders';
import ErrorBoundary from '../../src/components/ErrorBoundary';

const Broken = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  it('shows an error page instead of a blank one when a component crashes', () => {
    // React and the boundary both log the error; keep the test output clean.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Ups!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wróć na stronę główną' })).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it('renders the page when nothing breaks', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
