import { SxProps, Theme } from '@mui/material';

export const detailsCardStyles = (theme: Theme): SxProps<Theme> => ({
  mb: 3,
  p: 3,
  backgroundColor: theme.customColors.darkGreen
});

export const cardHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  mb: 2
};

export const cardTitleStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  mb: 1
});

export const descriptionStyles = (): SxProps<Theme> => ({
  color: 'rgba(255, 255, 255, 0.7)',
  mb: 2
});

export const chipContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 1
};

export const waitingChipStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.common.white
});

export const completedChipStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white
});