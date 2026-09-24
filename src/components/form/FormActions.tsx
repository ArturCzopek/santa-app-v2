import React, { ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../styles/theme';

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

// Main action on the right; on phones both buttons take the full width,
// main action first.
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
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        justifyContent: 'flex-end',
        gap: 1.5,
        mt: 1,
      }}
    >
      {secondaryLabel && (
        <Button onClick={onSecondaryClick} sx={{ color: tokens.ink }}>
          {secondaryLabel}
        </Button>
      )}

      <Button
        type={isPrimarySubmit ? 'submit' : 'button'}
        variant="contained"
        disabled={isSubmitting || isDisabled}
        onClick={isPrimarySubmit ? undefined : onPrimaryClick}
      >
        {isSubmitting ? t('common.submitting') : primaryLabel}
      </Button>

      {children}
    </Box>
  );
};

export default FormActions;
