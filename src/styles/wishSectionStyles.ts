import { SxProps, Theme } from '@mui/material';

export const wishSectionContainerStyles: SxProps<Theme> = {
  width: '100%',
  maxWidth: '600px',
  mt: 4,
  mb: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export const wishSectionTitleStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
  fontWeight: 'medium',
  mb: 2
});

export const wishFormContainerStyles = (theme: Theme): SxProps<Theme> => ({
  width: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.customColors.darkGreen,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
});

export const editButtonStyles = (theme: Theme): SxProps<Theme> => ({
  alignSelf: 'flex-end',
  color: theme.palette.common.white,
  borderColor: theme.palette.common.white,
  '&:hover': {
    borderColor: theme.customColors.gold,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
});

export const saveButtonStyles = (theme: Theme): SxProps<Theme> => ({
  alignSelf: 'flex-end',
  backgroundColor: theme.customColors.gold,
  color: 'rgba(0, 0, 0, 0.87)',
  '&:hover': {
    backgroundColor: theme.customColors.lightGold
  }
});

export const noWishWarningStyles = (theme: Theme): SxProps<Theme> => ({
  color: theme.customColors.lightGold,
  fontWeight: 'medium',
  mt: 2
});

export const successMessageStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  color: '#C8E6C9',
  '.MuiAlert-icon': {
    color: theme.palette.success.main
  }
});

export const wishTextFieldStyles = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.customColors.gold,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputBase-input.Mui-disabled': {
    // Improved visibility for read-only mode
    WebkitTextFillColor: 'rgba(255, 255, 255, 0.9)',
    color: 'rgba(255, 255, 255, 0.9)',
  }
});

// Add style for the cancel button
export const cancelButtonStyles = (theme: Theme): SxProps<Theme> => ({
  marginRight: theme.spacing(2),
  color: theme.palette.text.secondary,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
});

// Add style for buttons container
export const buttonsContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 2
};