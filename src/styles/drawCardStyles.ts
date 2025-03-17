import { SxProps, Theme } from '@mui/material';

// Shared styles for both preview and detail cards
export const cardBaseStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.customColors.darkGreen,
  p: 3,
});

export const cardHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

export const cardTitleStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
});

export const descriptionStyles = (): SxProps<Theme> => ({
  color: 'rgba(255, 255, 255, 0.7)',
});

export const waitingChipStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.common.white,
});

export const completedChipStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
});

// Preview card specific styles
export const previewCardStyles = (theme: Theme): SxProps<Theme> => ({
  ...cardBaseStyles(theme),
  mb: 2,
});

export const participantsStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.primary,
});

export const noWishStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.customColors.lightGold,
  fontWeight: 'medium',
});

export const resultStyles = (): SxProps<Theme> => ({
  color: '#81C784', // Light green
  fontWeight: 'medium',
});

export const actionContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export const viewDetailsButtonStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.customColors.gold,
  color: 'rgba(0, 0, 0, 0.87)',
  '&:hover': {
    backgroundColor: theme.customColors.lightGold,
  },
});

export const detailCardStyles = (theme: Theme): SxProps<Theme> => ({
  ...cardBaseStyles(theme),
});

export const metadataContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const metadataTextStyles = (): SxProps<Theme> => ({
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '1rem',
  fontWeight: 'medium'
});