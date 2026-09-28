import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Assignment, Draw, Letter, THANKS_MAX_LENGTH } from '../../models/Draw';
import { drawService } from '../../services/DrawService';
import { useNotify } from '../../hooks/useNotify';
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
import LetterView from './LetterView';
import SupportCard from './SupportCard';

interface WinnerSectionProps {
  draw: Draw;
  onGiftBoughtChange: (giftBought: boolean) => void;
}

const letterOut = keyframes`
  from { transform: translateY(32px); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

type EnvelopeState = 'sealed' | 'opening' | 'justOpened' | 'open';

const WinnerSection: React.FC<WinnerSectionProps> = ({
  draw,
  onGiftBoughtChange,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const notify = useNotify();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [winnerLetter, setWinnerLetter] = useState<Letter>({
    wish: '',
    comment: '',
  });
  const [giftBought, setGiftBought] = useState(
    () =>
      !!draw.participants.find(
        (participant) => participant.userUuid === user?.uid,
      )?.giftBought,
  );
  const [savingGiftBought, setSavingGiftBought] = useState(false);
  const [thanksText, setThanksText] = useState('');
  const [recipientThanks, setRecipientThanks] = useState('');
  const [savingThanks, setSavingThanks] = useState(false);
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
        // Thanks are extra: failing to read them must not hide the result.
        const thanks = (uid: string) =>
          drawService.getThanks(drawId, uid).catch((error) => {
            console.error('Error fetching thanks:', error);
            return '';
          });
        const [letter, ownThanks, theirThanks] = mine
          ? await Promise.all([
              drawService.getLetter(drawId, mine.toUuid),
              thanks(user.uid),
              thanks(mine.toUuid),
            ])
          : [{ wish: '', comment: '' }, '', ''];
        setWinnerLetter(letter);
        setThanksText(ownThanks);
        setRecipientThanks(theirThanks);
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

  const handleGiftBoughtChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!draw.id || !user) return;
    const previous = giftBought;
    const next = event.target.checked;
    setGiftBought(next);
    setSavingGiftBought(true);
    try {
      await drawService.updateGiftBought(draw.id, user.uid, next);
      onGiftBoughtChange(next);
    } catch (error) {
      console.error('Error updating gift status:', error);
      setGiftBought(previous);
      onGiftBoughtChange(previous);
      notify(t('drawPage.errors.giftBoughtUpdateFailed'));
    } finally {
      setSavingGiftBought(false);
    }
  };

  const handleSaveThanks = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draw.id || !user) return;
    setSavingThanks(true);
    try {
      await drawService.saveThanks(draw.id, user.uid, thanksText);
      notify(t('drawPage.winnerSection.thanksSaved'), 'success');
    } catch (error) {
      console.error('Error saving thanks:', error);
      notify(t('drawPage.errors.thanksSaveFailed'));
    } finally {
      setSavingThanks(false);
    }
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
              <LetterView letter={winnerLetter} />
            </Box>

            {recipientThanks !== '' && (
              <Box
                sx={{
                  borderTop: `1px dashed ${tokens.paperLine}`,
                  pt: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                  {t('drawPage.winnerSection.thanksFrom', {
                    name: winner.userName,
                  })}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {recipientThanks}
                </Typography>
              </Box>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={giftBought}
                  disabled={savingGiftBought}
                  onChange={handleGiftBoughtChange}
                />
              }
              label={t('drawPage.winnerSection.giftBoughtToggle')}
              sx={{ mx: -1 }}
            />

            <Typography variant="body2" color="text.secondary">
              {t('drawPage.winnerSection.keepSecret')}
            </Typography>
          </PaperCard>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <SupportCard />
      </Box>

      <Box component="section" sx={{ mt: 4 }}>
        <SectionHeading>
          {t('drawPage.winnerSection.thanksTitle')}
        </SectionHeading>
        <PaperCard onSubmit={handleSaveThanks}>
          <Typography variant="body2" color="text.secondary">
            {t('drawPage.winnerSection.thanksHelper')}
          </Typography>
          <TextField
            label={t('drawPage.winnerSection.thanksLabel')}
            multiline
            minRows={3}
            value={thanksText}
            onChange={(event) => setThanksText(event.target.value)}
            fullWidth
            helperText={`${thanksText.length} / ${THANKS_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: THANKS_MAX_LENGTH } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* Not wax: the page keeps one red main action (D15). */}
            <Button
              type="submit"
              variant="outlined"
              color="inherit"
              disabled={savingThanks}
              sx={{ color: tokens.ink }}
            >
              {t('drawPage.winnerSection.sendThanks')}
            </Button>
          </Box>
        </PaperCard>
      </Box>
    </Box>
  );
};

export default WinnerSection;
