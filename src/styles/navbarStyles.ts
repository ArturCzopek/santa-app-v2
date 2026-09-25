import { SxProps, Theme } from '@mui/material';
import { airmailStripes, handFont, tokens } from './theme';

export const appBarStyles: SxProps<Theme> = {
  backgroundColor: tokens.spruce,
  color: tokens.snow,
  boxShadow: 'none',
  // The striped edge of an airmail envelope under the bar.
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -5,
    height: 5,
    background: airmailStripes,
  },
};

export const brandStyles: SxProps<Theme> = {
  fontFamily: handFont,
  fontWeight: 700,
  fontSize: { xs: '1.75rem', sm: '2rem' },
  lineHeight: 1,
  color: tokens.snow,
  borderRadius: 1,
  px: 0.5,
  minHeight: 44,
  whiteSpace: 'nowrap',
};

export const navButtonStyles: SxProps<Theme> = {
  color: tokens.snow,
  px: { xs: 1, sm: 1.5 },
  whiteSpace: 'nowrap',
  '&:hover': { backgroundColor: 'rgba(245, 241, 232, 0.08)' },
};

export const accountButtonStyles: SxProps<Theme> = {
  gap: 1,
  borderRadius: 999,
  p: '5px',
  pr: { xs: '5px', md: 1.5 },
  color: tokens.snow,
  '&:hover': { backgroundColor: 'rgba(245, 241, 232, 0.08)' },
};

export const accountNameStyles: SxProps<Theme> = {
  display: { xs: 'none', md: 'inline' },
  fontWeight: 700,
  maxWidth: 180,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const accountMenuPaperStyles: SxProps<Theme> = {
  mt: 1,
  minWidth: 220,
  color: tokens.ink,
  '& .MuiListItemIcon-root': { color: tokens.inkMuted },
};

// The initial on a gold stamp when there is no Google photo.
export const accountAvatarStyles: SxProps<Theme> = {
  width: 34,
  height: 34,
  fontSize: '1rem',
  fontWeight: 800,
  bgcolor: tokens.stampGold,
  color: tokens.ink,
};
