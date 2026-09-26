import React from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../styles/theme';

interface FormActionsProps {
  primaryLabel: string;
  secondaryLabel: string;
  onSecondaryClick: () => void;
  isSubmitting?: boolean;
}

// Submit on the right; on phones both buttons take the full width,
// submit first.
const FormActions: React.FC<FormActionsProps> = ({
  primaryLabel,
  secondaryLabel,
  onSecondaryClick,
  isSubmitting = false,
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
      <Button onClick={onSecondaryClick} sx={{ color: tokens.ink }}>
        {secondaryLabel}
      </Button>

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? t('common.submitting') : primaryLabel}
      </Button>
    </Box>
  );
};

export default FormActions;
