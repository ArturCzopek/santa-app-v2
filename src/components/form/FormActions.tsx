import React, { ReactNode } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  buttonContainerStyles,
  primaryButtonStyles,
  secondaryButtonStyles,
} from '../../styles/formStyles';

interface FormActionsProps {
  primaryLabel: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  isPrimarySubmit?: boolean;
  children?: ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  isSubmitting = false,
  isDisabled = false,
  isPrimarySubmit = true,
  children,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={buttonContainerStyles}>
      {secondaryLabel && (
        <Button
          variant="outlined"
          size="large"
          onClick={onSecondaryClick}
          sx={secondaryButtonStyles(theme)}
        >
          {secondaryLabel}
        </Button>
      )}

      <Button
        type={isPrimarySubmit ? 'submit' : 'button'}
        variant="contained"
        color="primary"
        size="large"
        disabled={isSubmitting || isDisabled}
        onClick={isPrimarySubmit ? undefined : onPrimaryClick}
        sx={primaryButtonStyles(theme)}
      >
        {isSubmitting ? t('common.submitting') : primaryLabel}
      </Button>

      {children}
    </Box>
  );
};

export default FormActions;
