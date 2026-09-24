import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Assignment, Draw } from '../../models/Draw';
import { drawingService } from '../../services/DrawingService';
import PaperCard from '../common/PaperCard';
import StampAvatar from '../common/StampAvatar';
import SectionHeading from './SectionHeading';
import { handFont, tokens } from '../../styles/theme';

interface WinnerSectionProps {
  draw: Draw;
}

const WinnerSection: React.FC<WinnerSectionProps> = ({ draw }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (!draw.id || !user) return;

    drawingService
      .getMyAssignment(draw.id, user.uid)
      .then(setAssignment)
      .catch((error) => console.error('Error fetching assignment:', error));
  }, [draw.id, user]);

  if (!assignment) return null;

  const winner = draw.participants.find(
    (participant) => participant.userUuid === assignment.toUuid,
  );

  if (!winner) return null;

  return (
    <Box component="section">
      <SectionHeading>{t('drawPage.winnerSection.title')}</SectionHeading>

      <PaperCard airmail sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <StampAvatar
            name={winner.userName}
            photoUrl={winner.userPhotoUrl}
            size="large"
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              {t('drawPage.winnerSection.youBuyFor')}
            </Typography>
            <Typography
              sx={{
                fontFamily: handFont,
                fontWeight: 700,
                fontSize: { xs: '2.4rem', sm: '3rem' },
                lineHeight: 1.05,
                color: tokens.ink,
              }}
            >
              {winner.userName}
            </Typography>
            <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
              {t('drawPage.winnerSection.budget', {
                budget: draw.budget,
                currency: draw.currency,
              })}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: `1px dashed ${tokens.paperLine}`,
            pt: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: handFont,
              fontSize: '1.5rem',
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {t('drawPage.winnerSection.theirLetter', { name: winner.userName })}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {winner.wish || t('drawPage.winnerSection.noWishProvided')}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {t('drawPage.winnerSection.keepSecret')}
        </Typography>
      </PaperCard>
    </Box>
  );
};

export default WinnerSection;
