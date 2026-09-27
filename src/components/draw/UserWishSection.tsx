import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  Draw,
  Letter,
  LETTER_NOT_WANTED_MAX_LENGTH,
  LETTER_SIZES_MAX_LENGTH,
  WISH_MAX_LENGTH,
} from '../../models/Draw';
import { drawService } from '../../services/DrawService';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import PaperCard from '../common/PaperCard';
import SectionHeading from './SectionHeading';
import ConfirmDialog from '../common/ConfirmDialog';
import { letterDraft } from '../../services/letterDraft';
import { handFont, tokens } from '../../styles/theme';
import LetterView from './LetterView';

interface UserWishSectionProps {
  draw: Draw;
  // The user's own letter (empty fields when not written yet).
  savedLetter: Letter;
  onLetterSaved: (letter: Letter) => void;
  // The page decides when the editor is open, e.g. right after joining or
  // from "Napisz list" in its action row.
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  // The page shows "Napisz list" as its main action, so the card does not.
  writeButtonInRow?: boolean;
}

export const LETTER_SECTION_ID = 'your-letter';

const UserWishSection: React.FC<UserWishSectionProps> = ({
  draw,
  savedLetter,
  onLetterSaved,
  isEditing: isEditingProp,
  onEditingChange,
  writeButtonInRow = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const notify = useNotify();

  const userParticipant = draw.participants.find(
    (p) => p.userUuid === user?.uid,
  );

  const hasWish = savedLetter.wish !== '';
  const hasLetterContent =
    hasWish ||
    savedLetter.sizes.trim() !== '' ||
    savedLetter.notWanted.trim() !== '';
  // The Santa reads the letter as it was at the draw, so it cannot change
  // afterwards.
  const isLocked = draw.status !== 'WAITING_FOR_DRAW';
  const isEditing = isEditingProp && !isLocked;

  // An unsaved draft survives a reload, e.g. when a chat app's browser
  // reloads the page after switching apps.
  const draft = letterDraft(draw.id ?? '', user?.uid ?? '');
  const keptDraft = () => {
    const kept = draft.read();
    return kept !== null && !sameLetter(kept, savedLetter) ? kept : null;
  };

  // Draft edited in the fields; the saved letter comes from the page.
  const [letter, setLetter] = useState(
    () => (isEditing && keptDraft()) || savedLetter,
  );
  // Whether the editor opened with a draft from an earlier visit.
  const [restoredDraft, setRestoredDraft] = useState(
    () => isEditing && keptDraft() !== null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Each time the editor opens it starts from the kept draft or the letter.
  const [wasEditing, setWasEditing] = useState(isEditing);
  if (isEditing !== wasEditing) {
    setWasEditing(isEditing);
    if (isEditing) {
      const kept = keptDraft();
      setLetter(kept ?? savedLetter);
      setRestoredDraft(kept !== null);
    }
  }

  const handleChange = (field: keyof Letter, text: string) => {
    const updated = { ...letter, [field]: text };
    setLetter(updated);
    setRestoredDraft(false);
    draft.write(updated);
  };

  const closeEditor = () => {
    draft.clear();
    onEditingChange(false);
  };

  // Changes that were not saved are not thrown away without asking.
  const handleCancel = () => {
    if (!sameLetter(trimLetter(letter), savedLetter)) setConfirmDiscard(true);
    else closeEditor();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !userParticipant) return;

    setIsSaving(true);
    try {
      const updated = trimLetter(letter);
      await drawService.updateLetter(draw.id || '', user.uid, updated);

      closeEditor();
      notify(t('drawPage.wishSection.saveSuccess'), 'success');
      onLetterSaved(updated);
    } catch (error) {
      console.error('Error updating wish:', error);
      notify(t('drawPage.errors.wishUpdateFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const showWriteButton = !isLocked && (hasLetterContent || !writeButtonInRow);

  return (
    <Box component="section" id={LETTER_SECTION_ID}>
      <SectionHeading>{t('drawPage.wishSection.title')}</SectionHeading>

      <PaperCard onSubmit={isEditing ? handleSave : undefined}>
        <Typography
          sx={{ fontFamily: handFont, fontSize: '1.6rem', lineHeight: 1.1 }}
        >
          {t('drawPage.wishSection.salutation')}
        </Typography>

        {isEditing ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label={t('drawPage.wishSection.wishLabel')}
              multiline
              minRows={4}
              autoFocus
              value={letter.wish}
              onChange={(e) => handleChange('wish', e.target.value)}
              fullWidth
              placeholder={t('drawPage.wishSection.wishPlaceholder')}
              helperText={`${restoredDraft ? `${t('drawPage.wishSection.draftRestored')} · ` : ''}${t('drawPage.wishSection.wishHelper')} · ${letter.wish.length} / ${WISH_MAX_LENGTH}`}
              slotProps={{ htmlInput: { maxLength: WISH_MAX_LENGTH } }}
            />
            <TextField
              label={t('drawPage.wishSection.sizesLabel')}
              value={letter.sizes}
              onChange={(e) => handleChange('sizes', e.target.value)}
              fullWidth
              slotProps={{
                htmlInput: { maxLength: LETTER_SIZES_MAX_LENGTH },
              }}
            />
            <TextField
              label={t('drawPage.wishSection.notWantedLabel')}
              multiline
              minRows={2}
              value={letter.notWanted}
              onChange={(e) => handleChange('notWanted', e.target.value)}
              fullWidth
              slotProps={{
                htmlInput: { maxLength: LETTER_NOT_WANTED_MAX_LENGTH },
              }}
            />
          </Box>
        ) : hasLetterContent ? (
          <LetterView letter={savedLetter} />
        ) : isLocked ? (
          <Typography color="text.secondary">
            {t('drawPage.wishSection.noWishAfterDraw')}
          </Typography>
        ) : (
          <Typography sx={{ color: tokens.amber, fontWeight: 700 }}>
            {t('drawPage.wishSection.noWishWarning')}
          </Typography>
        )}

        {/* Said while writing, and after the draw where the button was. */}
        {(isEditing || (isLocked && hasLetterContent)) && (
          <Typography variant="body2" color="text.secondary">
            {t('drawPage.wishSection.lockedNote')}
          </Typography>
        )}

        {(isEditing || showWriteButton) && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: 1.5,
            }}
          >
            {isEditing ? (
              <>
                <Button
                  variant="text"
                  onClick={handleCancel}
                  sx={{ color: tokens.ink }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving
                    ? t('common.saving')
                    : t('drawPage.wishSection.saveButton')}
                </Button>
              </>
            ) : (
              <Button
                variant={hasLetterContent ? 'outlined' : 'contained'}
                startIcon={<Edit />}
                onClick={() => onEditingChange(true)}
                sx={
                  hasLetterContent
                    ? { color: tokens.ink, borderColor: tokens.ink }
                    : undefined
                }
              >
                {hasLetterContent
                  ? t('drawPage.wishSection.editButton')
                  : t('drawPage.wishSection.writeButton')}
              </Button>
            )}
          </Box>
        )}
      </PaperCard>

      <ConfirmDialog
        open={confirmDiscard}
        title={t('drawPage.wishSection.discardTitle')}
        text={t('drawPage.wishSection.discardText')}
        confirmLabel={t('drawPage.wishSection.discardConfirm')}
        onClose={() => setConfirmDiscard(false)}
        onConfirm={async () => {
          setConfirmDiscard(false);
          closeEditor();
        }}
      />
    </Box>
  );
};

const sameLetter = (first: Letter, second: Letter) =>
  first.wish === second.wish &&
  first.sizes === second.sizes &&
  first.notWanted === second.notWanted;

const trimLetter = (letter: Letter): Letter => ({
  wish: letter.wish.trim(),
  sizes: letter.sizes.trim(),
  notWanted: letter.notWanted.trim(),
});

export default UserWishSection;
