import { SxProps, Theme } from '@mui/material';

export const pageContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%'
};

export const loadingContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 8
};

export const errorMessageStyles: SxProps<Theme> = {
  textAlign: 'center',
  mt: 8
};

// Reuse the same style approach as detailCardStyles
export const detailCardStyles = (theme: Theme): SxProps<Theme> => ({
  width: '100%',
  maxWidth: '600px',
  backgroundColor: theme.customColors.darkGreen,
  p: 3,
  mb: 3
});

// Owner section styles based on WinnerSection
export const ownerSectionContainerStyles: SxProps<Theme> = {
  width: '100%',
  mt: 3
};

export const ownerSectionTitleStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  fontWeight: 'medium',
  mb: 2
});

export const ownerAvatarStyles: SxProps<Theme> = {
  width: 80,
  height: 80,
  mb: 2
};

export const ownerNameStyles = (theme: Theme): SxProps<Theme> => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  mt: 1
});

export const actionContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 3
};

export const joinButtonStyles = (theme: Theme): SxProps<Theme> => ({
  minWidth: '200px',
  fontWeight: 'bold',
  py: 1.2,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.customColors.darkRed
  }
});