import React, { useId, useState } from 'react';
import {
  Box,
  ButtonBase,
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  CheckCircle,
  ExpandMore,
  HourglassEmpty,
  PersonRemoveOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Draw, getDrawPlayers, Participant } from '../../models/Draw';
import { useAuth } from '../../hooks/useAuth';
import PaperCard from '../common/PaperCard';
import StampAvatar from '../common/StampAvatar';
import SectionHeading from './SectionHeading';
import { tokens } from '../../styles/theme';

interface ParticipantsSectionProps {
  draw: Draw;
  // The owner, before the draw: take someone else out.
  onRemove?: (participant: Participant) => void;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  draw,
  onRemove,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // Letter status ends at the draw; gift status starts after it, and the
  // participant list folds away because the result matters more.
  const showWishStatus = draw.status === 'WAITING_FOR_DRAW';
  const showGiftStatus = draw.status === 'DRAWED';
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const isOwner = !!user && user.uid === draw.ownerUuid;
  const players = new Set(getDrawPlayers(draw));
  const playerCount = players.size;
  const lettersWritten = draw.participants.filter(
    (p) => players.has(p.userUuid) && !!p.hasWish,
  ).length;
  const giftsBought = draw.participants.filter(
    (p) => players.has(p.userUuid) && !!p.giftBought,
  ).length;

  const sortedParticipants = [...draw.participants].sort((a, b) =>
    a.userName.localeCompare(b.userName),
  );

  const renderParticipantRow = (participant: Participant) => {
    const isCurrentUser = user && participant.userUuid === user.uid;
    const hasWish = !!participant.hasWish;
    const giftBought = !!participant.giftBought;
    const canRemove =
      !!onRemove && showWishStatus && participant.userUuid !== draw.ownerUuid;

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
          {/* Only the organizer's role says something; "Uczestnik" on every
              row was noise. */}
          {participant.userUuid === draw.ownerUuid &&
            (draw.ownerPlays === false ? (
              <Chip
                size="small"
                variant="outlined"
                label={t('drawPage.participantsSection.ownerNotDrawing')}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('drawPage.participantsSection.owner')}
              </Typography>
            ))}
        </Box>
        {(showWishStatus || showGiftStatus) &&
          players.has(participant.userUuid) && (
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flexShrink: 0,
                fontWeight: 700,
                color: (showWishStatus ? hasWish : giftBought)
                  ? tokens.pine
                  : tokens.amber,
              }}
            >
              {(showWishStatus ? hasWish : giftBought) ? (
                <CheckCircle fontSize="small" />
              ) : (
                <HourglassEmpty fontSize="small" />
              )}
              {showWishStatus
                ? hasWish
                  ? t('drawPage.participantsSection.wishProvided')
                  : t('drawPage.participantsSection.noWish')
                : giftBought
                  ? t('drawPage.participantsSection.giftBought')
                  : t('drawPage.participantsSection.giftNotBought')}
            </Typography>
          )}
        {canRemove && (
          <IconButton
            aria-label={t('drawPage.remove.button', {
              name: participant.userName,
            })}
            onClick={() => onRemove(participant)}
            sx={{ flexShrink: 0, mr: -1, color: tokens.inkMuted }}
          >
            <PersonRemoveOutlined />
          </IconButton>
        )}
        {/* Keeps the organizer's status in line with the rows above. */}
        {!!onRemove && showWishStatus && !canRemove && (
          <Box aria-hidden sx={{ width: 40, flexShrink: 0, mr: -1 }} />
        )}
      </Box>
    );
  };

  const title = t('drawPage.participantsSection.title', {
    count: draw.participants.length,
  });

  const list = (
    <PaperCard sx={{ gap: 0, py: { xs: 1.5, sm: 2 } }}>
      {(showWishStatus || showGiftStatus) && isOwner && (
        <Box
          sx={{
            pb: 1.5,
            mb: 1,
            borderBottom: `1px dashed ${tokens.paperLine}`,
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1 }}>
            {t(
              showWishStatus
                ? 'drawPage.participantsSection.lettersProgress'
                : 'drawPage.participantsSection.giftsProgress',
              {
                done: showWishStatus ? lettersWritten : giftsBought,
                total: playerCount,
              },
            )}
          </Typography>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={
              ((showWishStatus ? lettersWritten : giftsBought) /
                Math.max(playerCount, 1)) *
              100
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
