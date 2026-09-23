import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Assignment, Draw } from '../../models/Draw';
import { drawingService } from '../../services/DrawingService';
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
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (!draw.id || !user) return;

    drawingService
      .getMyAssignment(draw.id, user.uid)
      .then(setAssignment)
      .catch((error) => console.error('Error fetching assignment:', error));
  }, [draw.id, user]);

  // If no assignment found (yet), return null
  if (!assignment) return null;

  const winner = draw.participants.find(
    (participant) => participant.userUuid === assignment.toUuid,
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
