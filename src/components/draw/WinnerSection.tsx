import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Draw } from '../../models/Draw';
import ContentCard from '../common/ContentCard';
import {
  winnerSectionContainerStyles,
  winnerSectionTitleStyles,
  winnerAvatarStyles,
  winnerNameStyles,
  winnerWishStyles,
} from '../../styles/winnerSectionStyles';

interface WinnerSectionProps {
  draw: Draw;
}

const WinnerSection: React.FC<WinnerSectionProps> = ({ draw }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();

  const userPair = draw.pairs.find((pair) => pair.fromUuid === user?.uid);

  // If no pair found, return null
  if (!userPair) return null;

  const winner = draw.participants.find(
    (participant) => participant.userUuid === userPair.toUuid,
  );

  if (!winner) return null;

  return (
    <Box sx={winnerSectionContainerStyles}>
      <Typography variant="h5" sx={winnerSectionTitleStyles(theme)}>
        {t('drawPage.winnerSection.title')}
      </Typography>

      <ContentCard
        sx={{ width: '100%', p: 3, backgroundColor: 'rgba(0, 43, 0, 0.7)' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Avatar
            src={winner.userPhotoUrl || undefined}
            alt={winner.userName}
            sx={winnerAvatarStyles}
          >
            {!winner.userPhotoUrl && winner.userName[0].toUpperCase()}
          </Avatar>

          <Typography sx={winnerNameStyles(theme)}>
            {winner.userName}
          </Typography>

          <Typography sx={winnerWishStyles(theme)}>
            {winner.wish || t('drawPage.winnerSection.noWishProvided')}
          </Typography>
        </Box>
      </ContentCard>
    </Box>
  );
};

export default WinnerSection;
