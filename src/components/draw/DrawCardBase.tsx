import React, { ReactNode } from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PaperCard from '../common/PaperCard';
import Postmark from '../common/Postmark';

interface DrawCardBaseProps {
  title: string;
  description: string;
  status: 'WAITING_FOR_DRAW' | 'DRAWED';
  children?: ReactNode;
  budget?: number;
  currency?: string;
  airmail?: boolean;
  // Lets a link around the card name itself by the title.
  titleId?: string;
}

// A draw on paper: its name, a status postmark, budget and description.
const DrawCardBase: React.FC<DrawCardBaseProps> = ({
  title,
  description,
  status,
  children,
  budget,
  currency,
  airmail = false,
  titleId,
}) => {
  const { t } = useTranslation();

  return (
    <PaperCard airmail={airmail}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap-reverse',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1.5,
        }}
      >
        <Typography
          variant="h2"
          id={titleId}
          sx={{ fontSize: '1.35rem', minWidth: 0, flex: '1 1 12rem' }}
        >
          {title}
        </Typography>
        <Postmark
          tone={status === 'DRAWED' ? 'done' : 'waiting'}
          label={
            status === 'DRAWED'
              ? t('drawCard.drawedStatus')
              : t('drawCard.waitingStatus')
          }
        />
      </Box>

      {budget !== undefined && currency && (
        <Typography sx={{ fontWeight: 700 }}>
          {t('drawCard.budget', { budget, currency })}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}

      {children}
    </PaperCard>
  );
};

export default DrawCardBase;
