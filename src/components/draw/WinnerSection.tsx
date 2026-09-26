import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Assignment, Draw } from '../../models/Draw';
import { drawService } from '../../services/DrawService';
import PaperCard from '../common/PaperCard';
import StampAvatar from '../common/StampAvatar';
import SectionHeading from './SectionHeading';
import EventDetails from './EventDetails';
import AddToCalendarButton from './AddToCalendarButton';
import SealedEnvelope, { ENVELOPE_OPENING_MS } from './SealedEnvelope';
import {
  rememberEnvelopeOpened,
  wasEnvelopeOpened,
} from '../../services/envelope';
import { handFont, tokens } from '../../styles/theme';

interface WinnerSectionProps {
  draw: Draw;
}

const letterOut = keyframes`
  from { transform: translateY(32px); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

type EnvelopeState = 'sealed' | 'opening' | 'justOpened' | 'open';

const WinnerSection: React.FC<WinnerSectionProps> = ({ draw }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [winnerWish, setWinnerWish] = useState('');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    noSsr: true,
  });
  // Opening the envelope is a one-time moment; later visits show the letter.
  const [envelope, setEnvelope] = useState<EnvelopeState>(() =>
    wasEnvelopeOpened(draw.id ?? '', user?.uid ?? '') ? 'open' : 'sealed',
  );
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!draw.id || !user) return;

    const drawId = draw.id;
    (async () => {
      try {
        const mine = await drawService.getMyAssignment(drawId, user.uid);
        // The rules let only the Santa read the recipient's letter.
        const letter = mine
          ? await drawService.getLetter(drawId, mine.toUuid)
          : '';
        setWinnerWish(letter);
        setAssignment(mine);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      }
    })();
  }, [draw.id, user]);

  useEffect(() => {
    if (envelope !== 'opening') return;
    const timer = setTimeout(
      () => setEnvelope('justOpened'),
      ENVELOPE_OPENING_MS,
    );
    return () => clearTimeout(timer);
  }, [envelope]);

  // Screen readers go on reading from the letter that replaced the button.
  useEffect(() => {
    if (envelope === 'justOpened')
      letterRef.current?.focus({ preventScroll: true });
  }, [envelope]);

  const openEnvelope = () => {
    rememberEnvelopeOpened(draw.id ?? '', user?.uid ?? '');
    setEnvelope(reducedMotion ? 'justOpened' : 'opening');
  };

  if (!assignment) return null;

  const winner = draw.participants.find(
    (participant) => participant.userUuid === assignment.toUuid,
  );

  if (!winner) return null;

  return (
    <Box component="section">
      <SectionHeading>{t('drawPage.winnerSection.title')}</SectionHeading>

      {envelope === 'sealed' || envelope === 'opening' ? (
        <SealedEnvelope
          recipientName={user?.displayName ?? ''}
          opening={envelope === 'opening'}
          onOpen={openEnvelope}
        />
      ) : (
        <Box
          ref={letterRef}
          tabIndex={-1}
          sx={{
            outline: 'none',
            animation:
              envelope === 'justOpened' && !reducedMotion
                ? `${letterOut} 450ms ease-out`
                : 'none',
          }}
        >
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

            <EventDetails
              eventDate={draw.eventDate}
              eventPlace={draw.eventPlace}
            />
            <AddToCalendarButton draw={draw} />

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
                {t('drawPage.winnerSection.theirLetter', {
                  name: winner.userName,
                })}
              </Typography>
              {/* The part the Santa actually needs, so not the quietest. */}
              <Typography
                sx={{
                  whiteSpace: 'pre-line',
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  color: tokens.ink,
                }}
              >
                {winnerWish || t('drawPage.winnerSection.noWishProvided')}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {t('drawPage.winnerSection.keepSecret')}
            </Typography>
          </PaperCard>
        </Box>
      )}
    </Box>
  );
};

export default WinnerSection;
