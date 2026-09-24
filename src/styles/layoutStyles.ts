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
};

export const pageTitleStyles: SxProps<Theme> = {
  mb: 3,
  color: tokens.snow,
  overflowWrap: 'anywhere',
};

export const footerStyles: SxProps<Theme> = {
  py: 3,
  px: 2,
  textAlign: 'center',
  color: tokens.snowMuted,
  fontSize: '0.875rem',
  position: 'relative',
  zIndex: 1,
};
