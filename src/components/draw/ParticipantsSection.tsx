import React from 'react';
import { Box, Typography, Avatar, useTheme, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Draw, Participant } from '../../models/Draw';
import { useAuth } from '../../hooks/useAuth';
import ContentCard from '../common/ContentCard';
import {
  participantsSectionContainerStyles,
  participantsSectionTitleStyles,
  participantRowStyles,
  participantAvatarStyles,
  participantInfoContainerStyles,
  participantNameStyles,
  participantRoleStyles,
  currentUserHighlightStyles,
} from '../../styles/participantsSectionStyles';

interface ParticipantsSectionProps {
  draw: Draw;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ draw }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();

  // Sort participants alphabetically by name
  const sortedParticipants = [...draw.participants].sort((a, b) =>
    a.userName.localeCompare(b.userName),
  );

  const renderParticipantRow = (participant: Participant) => {
    const isCurrentUser = user && participant.userUuid === user.uid;
    const hasProvidedWish = !!participant.wish;

    console.log('===avatar', participant.userUuid, participant.userPhotoUrl);
    console.log(
      '===display letter?',
      !participant.userPhotoUrl && participant.userName[0].toUpperCase(),
    );
    return (
      <Box
        key={participant.userUuid}
        sx={{
          ...participantRowStyles(theme),
          ...(isCurrentUser ? currentUserHighlightStyles() : {}),
        }}
      >
        <Avatar
          src={participant.userPhotoUrl || undefined}
          alt={participant.userName}
          sx={participantAvatarStyles}
        >
          {!participant.userPhotoUrl && participant.userName[0].toUpperCase()}
        </Avatar>
        <Box sx={participantInfoContainerStyles}>
          <Typography sx={participantNameStyles(theme)}>
            {participant.userName}
          </Typography>
          <Typography sx={participantRoleStyles(theme)}>
            {participant.userUuid === draw.ownerUuid
              ? t('drawPage.participantsSection.owner')
              : t('drawPage.participantsSection.participant')}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          {hasProvidedWish ? (
            <Chip
              label={t('drawPage.participantsSection.wishProvided')}
              color="success"
              size="small"
              sx={{
                backgroundColor: theme.palette.success.main,
                color: 'white',
              }}
            />
          ) : (
            <Chip
              label={t('drawPage.participantsSection.noWish')}
              color="warning"
              size="small"
              sx={{
                backgroundColor: theme.palette.warning.main,
                color: 'white',
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={participantsSectionContainerStyles}>
      <Typography variant="h5" sx={participantsSectionTitleStyles(theme)}>
        {t('drawPage.participantsSection.title')}
      </Typography>

      <ContentCard
        sx={{ width: '100%', p: 3, backgroundColor: 'rgba(0, 43, 0, 0.7)' }}
      >
        {sortedParticipants.map(renderParticipantRow)}
      </ContentCard>
    </Box>
  );
};

export default ParticipantsSection;
