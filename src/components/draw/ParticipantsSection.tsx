import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Draw, Participant } from '../../models/Draw';
import { useAuth } from '../../hooks/useAuth';
import PaperCard from '../common/PaperCard';
import StampAvatar from '../common/StampAvatar';
import SectionHeading from './SectionHeading';
import { tokens } from '../../styles/theme';

interface ParticipantsSectionProps {
  draw: Draw;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ draw }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // Whether someone wrote a letter matters only until the draw.
  const showWishStatus = draw.status === 'WAITING_FOR_DRAW';

  const sortedParticipants = [...draw.participants].sort((a, b) =>
    a.userName.localeCompare(b.userName),
  );

  const renderParticipantRow = (participant: Participant) => {
    const isCurrentUser = user && participant.userUuid === user.uid;
    const hasWish = !!participant.wish;

    return (
      <Box
        component="li"
        key={participant.userUuid}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1,
          px: 1,
          mx: -1,
          borderRadius: '6px',
          backgroundColor: isCurrentUser ? tokens.paperShade : 'transparent',
        }}
      >
        <StampAvatar
          name={participant.userName}
          photoUrl={participant.userPhotoUrl}
        />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>
            {participant.userName}
            {isCurrentUser && (
              <Typography component="span" color="text.secondary">
                {' '}
                {t('drawPage.participantsSection.you')}
              </Typography>
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {participant.userUuid === draw.ownerUuid
              ? t('drawPage.participantsSection.owner')
              : t('drawPage.participantsSection.participant')}
          </Typography>
        </Box>
        {showWishStatus && (
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
              fontWeight: 700,
              color: hasWish ? tokens.pine : tokens.amber,
            }}
          >
            {hasWish ? (
              <CheckCircle fontSize="small" />
            ) : (
              <HourglassEmpty fontSize="small" />
            )}
            {hasWish
              ? t('drawPage.participantsSection.wishProvided')
              : t('drawPage.participantsSection.noWish')}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box component="section">
      <SectionHeading>
        {t('drawPage.participantsSection.title', {
          count: draw.participants.length,
        })}
      </SectionHeading>

      <PaperCard sx={{ gap: 0, py: { xs: 1.5, sm: 2 } }}>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {sortedParticipants.map(renderParticipantRow)}
        </Box>
      </PaperCard>
    </Box>
  );
};

export default ParticipantsSection;
