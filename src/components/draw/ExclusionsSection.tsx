import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Close, SyncAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import HelpLink from '../HelpLink';
import PaperCard from '../common/PaperCard';
import SectionHeading from './SectionHeading';
import { Draw } from '../../models/Draw';
import {
  blockingExclusions,
  Exclusion,
  isDrawPossible,
} from '../../services/pairs';
import { drawService } from '../../services/DrawService';
import { useNotify } from '../../hooks/useNotify';
import { tokens } from '../../styles/theme';

export const EXCLUSIONS_SECTION_ID = 'exclusions';

const samePair = ([a, b]: Exclusion, [c, d]: Exclusion) =>
  (a === c && b === d) || (a === d && b === c);

// "Ania ↔ Bartek"
export const pairLabel = ([a, b]: Exclusion, nameOf: (uid: string) => string) =>
  `${nameOf(a)} ↔ ${nameOf(b)}`;

// Exclusions between people still in the draw (someone may have left).
export const currentExclusions = (draw: Draw, exclusions: Exclusion[]) =>
  exclusions.filter(
    ([a, b]) =>
      draw.participantUuids.includes(a) && draw.participantUuids.includes(b),
  );

// Tells which exclusions to remove when the draw has become impossible.
export const ImpossibleDrawNotice: React.FC<{
  draw: Draw;
  exclusions: Exclusion[];
  nameOf: (uid: string) => string;
}> = ({ draw, exclusions, nameOf }) => {
  const { t } = useTranslation();
  if (isDrawPossible(draw.participantUuids, exclusions)) return null;

  const blocking = blockingExclusions(draw.participantUuids, exclusions);
  return (
    <Typography role="alert" sx={{ color: tokens.wax, fontWeight: 700 }}>
      {blocking.length > 0
        ? t('drawPage.exclusions.impossibleRemoveOne', {
            pairs: blocking.map((pair) => pairLabel(pair, nameOf)).join(', '),
          })
        : t('drawPage.exclusions.impossibleRemoveMore')}
    </Typography>
  );
};

interface ExclusionsSectionProps {
  draw: Draw;
  exclusions: Exclusion[];
  onChange: (exclusions: Exclusion[]) => void;
}

// The owner marks pairs who must not draw each other, e.g. couples.
const ExclusionsSection: React.FC<ExclusionsSectionProps> = ({
  draw,
  exclusions,
  onChange,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const people = [...draw.participants].sort((a, b) =>
    a.userName.localeCompare(b.userName),
  );
  const nameOf = (uid: string) =>
    draw.participants.find((p) => p.userUuid === uid)?.userName ?? '?';
  const current = currentExclusions(draw, exclusions);

  // Nobody draws themselves anyway, and a pair is listed once, so the other
  // field offers neither this person nor anyone already paired with them.
  const unavailableWith = (uid: string) =>
    new Set(
      uid
        ? [
            uid,
            ...current
              .filter((pair) => pair.includes(uid))
              .map(([a, b]) => (a === uid ? b : a)),
          ]
        : [],
    );

  const pickFirst = (uid: string) => {
    setFirst(uid);
    if (unavailableWith(uid).has(second)) setSecond('');
  };

  const pickSecond = (uid: string) => {
    setSecond(uid);
    if (unavailableWith(uid).has(first)) setFirst('');
  };

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const pair: Exclusion = [first, second];
    if (!first || !second || first === second) {
      setError(t('drawPage.exclusions.pickTwo'));
      return;
    }
    if (current.some((other) => samePair(other, pair))) {
      setError(t('drawPage.exclusions.alreadyThere'));
      return;
    }
    if (!isDrawPossible(draw.participantUuids, [...current, pair])) {
      setError(t('drawPage.exclusions.wouldBeImpossible'));
      return;
    }

    setSaving(true);
    try {
      await drawService.addExclusion(draw.id as string, pair);
      onChange([...exclusions, pair]);
      setFirst('');
      setSecond('');
    } catch (err) {
      console.error('Error adding exclusion:', err);
      notify(t('drawPage.exclusions.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (pair: Exclusion) => {
    try {
      await drawService.removeExclusion(draw.id as string, pair);
      onChange(exclusions.filter((other) => !samePair(other, pair)));
    } catch (err) {
      console.error('Error removing exclusion:', err);
      notify(t('drawPage.exclusions.saveFailed'));
    }
  };

  const personSelect = (
    id: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    unavailable: Set<string>,
  ) => (
    <FormControl fullWidth error={!!error}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        label={label}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setError(null);
        }}
      >
        {people
          .filter((person) => !unavailable.has(person.userUuid))
          .map((person) => (
            <MenuItem key={person.userUuid} value={person.userUuid}>
              {person.userName}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );

  return (
    <Box component="section" id={EXCLUSIONS_SECTION_ID}>
      <SectionHeading>
        {t('drawPage.exclusions.title', { count: current.length })}
      </SectionHeading>

      <PaperCard>
        <Typography color="text.secondary">
          {t('drawPage.exclusions.explanation')}
        </Typography>
        <Box sx={{ mt: -1.5 }}>
          <HelpLink topic="exclusions">{t('help.links.exclusions')}</HelpLink>
        </Box>

        {current.length > 0 && (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {current.map((pair) => (
              <Box
                component="li"
                key={pair.join('_')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  borderBottom: `1px dashed ${tokens.paperLine}`,
                }}
              >
                <Typography sx={{ fontWeight: 700, flexGrow: 1, minWidth: 0 }}>
                  {pairLabel(pair, nameOf)}
                </Typography>
                <IconButton
                  aria-label={t('drawPage.exclusions.remove', {
                    pair: pairLabel(pair, nameOf),
                  })}
                  onClick={() => handleRemove(pair)}
                >
                  <Close />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <ImpossibleDrawNotice
          draw={draw}
          exclusions={current}
          nameOf={nameOf}
        />

        <Box
          component="form"
          noValidate
          onSubmit={handleAdd}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'center' },
              gap: 1.5,
            }}
          >
            {personSelect(
              'exclusion-first',
              t('drawPage.exclusions.first'),
              first,
              pickFirst,
              unavailableWith(second),
            )}
            <SyncAlt
              aria-hidden
              sx={{
                alignSelf: 'center',
                color: tokens.inkMuted,
                transform: { xs: 'rotate(90deg)', sm: 'none' },
              }}
            />
            {personSelect(
              'exclusion-second',
              t('drawPage.exclusions.second'),
              second,
              pickSecond,
              unavailableWith(first),
            )}
          </Box>
          {error && (
            <FormHelperText error sx={{ m: 0 }}>
              {error}
            </FormHelperText>
          )}
          <Button
            type="submit"
            variant="outlined"
            color="inherit"
            disabled={saving}
            sx={{ alignSelf: { sm: 'flex-end' }, color: tokens.ink }}
          >
            {t('drawPage.exclusions.add')}
          </Button>
        </Box>
      </PaperCard>
    </Box>
  );
};

export default ExclusionsSection;
