import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { airmailStripes, handFont, tokens } from '../../styles/theme';

// How long the seal and flap take; the letter slides out afterwards.
export const ENVELOPE_OPENING_MS = 700;

const crackLeft = keyframes`
  to { transform: translate(-28px, 14px) rotate(-28deg); opacity: 0; }
`;
const crackRight = keyframes`
  to { transform: translate(28px, 14px) rotate(28deg); opacity: 0; }
`;
const flapOpen = keyframes`
  to { transform: rotateX(180deg); }
`;

interface SealedEnvelopeProps {
  recipientName: string;
  opening: boolean;
  onOpen: () => void;
}

const sealSize = { xs: 84, sm: 96 };

// One half of the wax seal, so it can crack down the middle.
const SealHalf: React.FC<{ side: 'left' | 'right'; opening: boolean }> = ({
  side,
  opening,
}) => (
  <Box
    aria-hidden
    sx={{
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 30%, #D2434C, ${tokens.wax} 45%, ${tokens.waxDark} 100%)`,
      boxShadow:
        'inset 0 0 0 5px rgba(0, 0, 0, 0.12), 0 6px 14px -6px rgba(0, 0, 0, 0.7)',
      clipPath:
        side === 'left'
          ? 'polygon(0 0, 52% 0, 46% 30%, 55% 55%, 47% 100%, 0 100%)'
          : 'polygon(52% 0, 100% 0, 100% 100%, 47% 100%, 55% 55%, 46% 30%)',
      animation: opening
        ? `${side === 'left' ? crackLeft : crackRight} 400ms ease-in forwards`
        : 'none',
    }}
  />
);

// The draw result before it is opened: an airmail envelope closed with
// sealing wax. The whole envelope is the button, so it is easy to tap.
const SealedEnvelope: React.FC<SealedEnvelopeProps> = ({
  recipientName,
  opening,
  onOpen,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: '7px',
        borderRadius: '12px',
        background: airmailStripes,
        boxShadow:
          '0 1px 0 rgba(0, 0, 0, 0.04), 0 14px 30px -14px rgba(0, 0, 0, 0.6)',
      }}
    >
      <ButtonBase
        onClick={onOpen}
        disabled={opening}
        aria-label={t('drawPage.winnerSection.openEnvelope')}
        sx={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: { xs: 250, sm: 290 },
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: tokens.paper,
          color: tokens.ink,
          textAlign: 'left',
          perspective: '900px',
          '&:hover .seal': { transform: 'translate(-50%, -50%) scale(1.04)' },
        }}
      >
        {/* The flap, folded down over the front. */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '52%',
            backgroundColor: tokens.paperShade,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transformOrigin: 'top',
            filter: 'drop-shadow(0 2px 0 rgba(0, 0, 0, 0.06))',
            animation: opening
              ? `${flapOpen} 450ms ease-in-out 250ms forwards`
              : 'none',
          }}
        />

        <Box
          className="seal"
          sx={{
            position: 'absolute',
            top: '52%',
            left: '50%',
            width: sealSize,
            height: sealSize,
            transform: 'translate(-50%, -50%)',
            transition: 'transform 150ms ease-out',
          }}
        >
          <SealHalf side="left" opening={opening} />
          <SealHalf side="right" opening={opening} />
          <Typography
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: handFont,
              fontWeight: 700,
              fontSize: { xs: '2.4rem', sm: '2.8rem' },
              color: 'rgba(255, 255, 255, 0.85)',
              textShadow: '0 -1px 0 rgba(0, 0, 0, 0.35)',
              opacity: opening ? 0 : 1,
              transition: 'opacity 150ms',
            }}
          >
            M
          </Typography>
        </Box>

        <Typography
          sx={{
            position: 'absolute',
            top: { xs: 'calc(52% + 50px)', sm: 'calc(52% + 56px)' },
            left: 0,
            right: 0,
            textAlign: 'center',
            fontWeight: 700,
            color: tokens.wax,
          }}
        >
          {t('drawPage.winnerSection.tapToOpen')}
        </Typography>

        <Typography
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: { xs: 2.5, sm: 3.5 },
            pb: { xs: 1.5, sm: 2 },
            fontFamily: handFont,
            fontWeight: 700,
            fontSize: { xs: '1.6rem', sm: '1.9rem' },
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t('drawPage.winnerSection.sealedTo', { name: recipientName })}
        </Typography>
      </ButtonBase>
    </Box>
  );
};

export default SealedEnvelope;
