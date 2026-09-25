import { SxProps, Theme } from '@mui/material';
import { tokens } from './theme';

export const CONTENT_MAX_WIDTH = 640;

export const mainContainerStyles: SxProps<Theme> = {
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  color: tokens.snow,
};

// One column with one left edge for every page.
export const mainContentStyles: SxProps<Theme> = {
  flexGrow: 1,
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  mx: 'auto',
  px: { xs: 2, sm: 3 },
  pt: { xs: 4, sm: 6 },
  pb: 6,
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 1,
  // Focused only by the skip link; no ring around the whole page.
  outline: 'none',
};

export const pageTitleStyles: SxProps<Theme> = {
  mb: 3,
  color: tokens.snow,
  overflowWrap: 'anywhere',
};

export const footerStyles: SxProps<Theme> = {
  py: 2,
  px: 2,
  textAlign: 'center',
  color: tokens.snowMuted,
  fontSize: '0.875rem',
  position: 'relative',
  zIndex: 1,
};

// Tall enough to tap on a phone, though the text stays small.
export const footerLinkStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
};

// Hidden until it gets keyboard focus, then shown over the navbar.
export const skipLinkStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  left: 8,
  zIndex: 1200,
  px: 2,
  py: 1.25,
  borderRadius: 1,
  backgroundColor: tokens.paper,
  color: tokens.ink,
  fontWeight: 700,
  transform: 'translateY(-200%)',
  '&:focus-visible, &.Mui-focusVisible': { transform: 'none' },
};
