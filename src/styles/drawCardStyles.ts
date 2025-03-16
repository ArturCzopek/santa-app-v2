import { SxProps, Theme } from '@mui/material';

export const cardStyles = (theme: Theme): SxProps<Theme> => ({
  mb: 2,
  p: 3,
  backgroundColor: theme.customColors.darkGreen,
});

export const cardHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

export const cardTitleStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  mb: 0.5,
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

export const descriptionStyles = (): SxProps<Theme> => ({
  color: 'rgba(255, 255, 255, 0.7)',
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
  mt: 0,
};

export const viewDetailsButtonStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: theme.customColors.gold,
  color: 'rgba(0, 0, 0, 0.87)', // Dark text for contrast
  '&:hover': {
    backgroundColor: theme.customColors.lightGold,
  },
});
