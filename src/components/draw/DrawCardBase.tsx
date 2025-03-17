// components/draw/DrawCardBase.tsx
import React, { ReactNode } from 'react';
import { Typography, Box, Chip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentCard from '../common/ContentCard';
import {
  cardHeaderStyles,
  cardTitleStyles,
  descriptionStyles,
  waitingChipStyles,
  completedChipStyles,
  metadataContainerStyles,
  metadataTextStyles,
} from '../../styles/drawCardStyles';
import { format } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';

interface DrawCardBaseProps {
  title: string;
  description: string;
  status: 'WAITING_FOR_DRAW' | 'DRAWED';
  cardStyles: any;
  children?: ReactNode;
  budget?: number;
  currency?: string;
  drawDate?: Date | null;
  showMetadata?: boolean;
}

const DrawCardBase: React.FC<DrawCardBaseProps> = ({
  title,
  description,
  status,
  cardStyles,
  children,
  budget,
  currency,
  drawDate,
  showMetadata = false, // Default to false
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const getStatusChip = () => {
    if (status === 'WAITING_FOR_DRAW') {
      return (
        <Chip
          label={t('drawCard.waitingStatus')}
          color="warning"
          sx={waitingChipStyles(theme)}
        />
      );
    } else {
      return (
        <Chip
          label={t('drawCard.drawedStatus')}
          color="success"
          sx={completedChipStyles(theme)}
        />
      );
    }
  };

  const formattedDrawDate = drawDate
    ? format(new Date(drawDate), 'PP', {
        locale: i18n.language === 'pl' ? pl : enUS,
      })
    : '-';

  return (
    <ContentCard sx={cardStyles}>
      <Box sx={cardHeaderStyles}>
        <Box>
          <Typography variant="h4" sx={cardTitleStyles(theme)}>
            {title}
          </Typography>
        </Box>
        <Box>{getStatusChip()}</Box>
      </Box>

      {/* Only show metadata if showMetadata is true and we have budget and currency */}
      {showMetadata && budget !== undefined && currency && (
        <Box sx={metadataContainerStyles}>
          <Typography sx={metadataTextStyles()}>
            {t('drawCard.budget', { budget, currency })}
          </Typography>
          <Typography sx={metadataTextStyles()}>
            {t('drawCard.drawDate', { drawDate: formattedDrawDate })}
          </Typography>
        </Box>
      )}

      <Typography variant="body2" sx={descriptionStyles()}>
        {description}
      </Typography>

      {children}
    </ContentCard>
  );
};

export default DrawCardBase;
