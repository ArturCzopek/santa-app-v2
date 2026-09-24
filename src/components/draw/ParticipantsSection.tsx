import React, { useId, useState } from 'react';
import {
  Box,
  ButtonBase,
  Collapse,
  LinearProgress,
  Typography,
} from '@mui/material';
import { CheckCircle, ExpandMore, HourglassEmpty } from '@mui/icons-material';
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
  // Whether someone wrote a letter matters only until the draw; after it
  // the result matters, so the list starts folded away.
  const showWishStatus = draw.status === 'WAITING_FOR_DRAW';
  const [expanded, setExpanded] = useState(showWishStatus);
  const listId = useId();
  const isOwner = !!user && user.uid === draw.ownerUuid;
  const lettersWritten = draw.participants.filter((p) => !!p.wish).length;

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

  const title = t('drawPage.participantsSection.title', {
    count: draw.participants.length,
  });

  const list = (
    <PaperCard sx={{ gap: 0, py: { xs: 1.5, sm: 2 } }}>
      {showWishStatus && isOwner && (
        <Box
          sx={{
            pb: 1.5,
            mb: 1,
            borderBottom: `1px dashed ${tokens.paperLine}`,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1 }}>
            {t('drawPage.participantsSection.lettersProgress', {
              done: lettersWritten,
              total: draw.participants.length,
            })}
          </Typography>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={
              (lettersWritten / Math.max(draw.participants.length, 1)) * 100
            }
            aria-hidden
            sx={{ height: 8, borderRadius: 4, bgcolor: tokens.paperShade }}
          />
        </Box>
      )}
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {sortedParticipants.map(renderParticipantRow)}
      </Box>
    </PaperCard>
  );

  if (showWishStatus) {
    return (
      <Box component="section">
        <SectionHeading>{title}</SectionHeading>
        {list}
      </Box>
    );
  }

  return (
    <Box component="section">
      <SectionHeading>
        <ButtonBase
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={listId}
          sx={{
            font: 'inherit',
            color: 'inherit',
            gap: 1,
            borderRadius: '6px',
            py: 0.5,
            pr: 1,
            my: -0.5,
          }}
        >
          {title}
          <ExpandMore
            aria-hidden
            sx={{
              transition: 'transform 200ms',
              transform: expanded ? 'rotate(180deg)' : 'none',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          />
        </ButtonBase>
      </SectionHeading>
      <Collapse in={expanded} id={listId}>
        {list}
      </Collapse>
    </Box>
  );
};

export default ParticipantsSection;
