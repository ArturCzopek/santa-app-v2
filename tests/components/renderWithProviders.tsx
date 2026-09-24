import '@testing-library/jest-dom/vitest';
import React from 'react';
import { afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n';
import theme from '../../src/styles/theme';
import { NotifyProvider } from '../../src/hooks/useNotify';

// Vitest runs without globals, so Testing Library cannot register this itself.
afterEach(cleanup);

// Renders a page or component the way App does (theme, i18n in Polish,
// router), optionally at a route so useParams works.
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    route = '/',
    path = '*',
  }: {
    // A path, or a path with navigation state (as navigate(path, { state })).
    route?: string | { pathname: string; state?: unknown };
    path?: string;
  } = {},
) =>
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <NotifyProvider>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={ui} />
              <Route path="/draws" element={<div>Draws list page</div>} />
            </Routes>
          </MemoryRouter>
        </NotifyProvider>
      </ThemeProvider>
    </I18nextProvider>,
  );

export const fakeUser = (uid: string, displayName: string) =>
  ({
    uid,
    displayName,
    photoURL: null,
  }) as unknown as import('firebase/auth').User;
