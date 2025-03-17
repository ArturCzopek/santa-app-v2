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
} from '../../styles/drawCardStyles';

interface DrawCardBaseProps {
  title: string;
  description: string;
  status: 'WAITING_FOR_DRAW' | 'DRAWED';
  cardStyles: any;
  children?: ReactNode;
}

const DrawCardBase: React.FC<DrawCardBaseProps> = ({
  title,
  description,
  status,
  cardStyles,
  children,
}) => {
  const { t } = useTranslation();
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
      <Typography variant="body2" sx={descriptionStyles()}>
        {description}
      </Typography>
      {children}
    </ContentCard>
  );
};

export default DrawCardBase;
