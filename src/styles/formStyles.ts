import { SxProps, Theme } from '@mui/material';

export const inputStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.primary,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: '2px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.customColors.gold,
    borderWidth: '2px',
  },
});

export const inputLabelStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.secondary,
  '&.Mui-focused': {
    color: theme.customColors.gold,
  },
  '&.Mui-error': {
    color: theme.customColors.lightGold,
  },
});

export const errorStyles = (theme: Theme): SxProps<Theme> => ({
  '& .MuiFormHelperText-root': {
    color: theme.customColors.lightGold,
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginTop: '6px',
  },
  '& .Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.customColors.lightGold,
    borderWidth: '2px',
  },
});

export const buttonContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 3,
  gap: 2,
};

export const primaryButtonStyles = (theme: Theme): SxProps<Theme> => ({
  minWidth: '200px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.customColors.darkRed,
  },
});

export const secondaryButtonStyles = (theme: Theme): SxProps<Theme> => ({
  minWidth: '120px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: theme.customColors.grayText,
  borderColor: theme.customColors.grayText,
  '&:hover': {
    borderColor: theme.customColors.lightGray,
    color: theme.customColors.lightGray,
  },
});

export const alertStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: 'rgba(76, 175, 80, 0.2)',
  color: '#C8E6C9',
  '.MuiAlert-icon': {
    color: theme.palette.success.main,
  },
});

export const darkGreenBackground = (theme: Theme): SxProps<Theme> => ({
  background: theme.customColors.darkGreen,
});
