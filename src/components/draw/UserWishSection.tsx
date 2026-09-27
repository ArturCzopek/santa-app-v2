import React, { useState } from 'react';
import { Add, DeleteOutlined, Edit } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Draw,
  Letter,
  LETTER_COMMENT_MAX_LENGTH,
  WISH_ITEM_MAX_LENGTH,
  WISH_MAX_ITEMS,
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
import { itemsToWish, wishToItems } from './letterText';

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

const editableItems = (wish: string) =>
  wishToItems(wish).length ? wishToItems(wish) : [''];

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

  const hasLetterContent =
    wishToItems(savedLetter.wish).length > 0 ||
    savedLetter.comment.trim() !== '';
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
  const [initialLetter] = useState<Letter>(
    () => (isEditing ? keptDraft() : null) ?? savedLetter,
  );
  const [items, setItems] = useState(() => editableItems(initialLetter.wish));
  // The field that takes the cursor when it appears: the first one, or a
  // thing just added.
  const [focusIndex, setFocusIndex] = useState(0);
  const [comment, setComment] = useState(() => initialLetter.comment);
  // Whether the editor opened with a draft from an earlier visit.
  const [restoredDraft, setRestoredDraft] = useState(
    () => isEditing && !sameLetter(initialLetter, savedLetter),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Each time the editor opens it starts from the kept draft or the letter.
  const [wasEditing, setWasEditing] = useState(isEditing);
  if (isEditing !== wasEditing) {
    setWasEditing(isEditing);
    if (isEditing) {
      const kept = keptDraft();
      setItems(editableItems(kept?.wish ?? savedLetter.wish));
      setComment(kept?.comment ?? savedLetter.comment);
      setRestoredDraft(kept !== null);
    }
  }

  const saveDraft = (nextItems: string[], nextComment: string) => {
    draft.write({ wish: nextItems.join('\n'), comment: nextComment });
  };

  const handleItemChange = (index: number, text: string) => {
    const updated = [...items];
    updated[index] = text.replace(/[\r\n]/g, '').slice(0, WISH_ITEM_MAX_LENGTH);
    setItems(updated);
    setRestoredDraft(false);
    saveDraft(updated, comment);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
    setRestoredDraft(false);
    saveDraft(items, text);
  };

  const handleAddItem = () => {
    if (items.length >= WISH_MAX_ITEMS) return;
    const updated = [...items, ''];
    setFocusIndex(updated.length - 1);
    setItems(updated);
    setRestoredDraft(false);
    saveDraft(updated, comment);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(updated);
    setRestoredDraft(false);
    saveDraft(updated, comment);
  };

  const closeEditor = () => {
    draft.clear();
    onEditingChange(false);
  };

  // Changes that were not saved are not thrown away without asking.
  const handleCancel = () => {
    if (
      !sameLetter(trimLetter({ wish: items.join('\n'), comment }), savedLetter)
    ) {
      setConfirmDiscard(true);
    } else closeEditor();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !userParticipant) return;

    setIsSaving(true);
    try {
      const updated = trimLetter({ wish: items.join('\n'), comment });
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
            <Typography sx={{ fontWeight: 700 }}>
              {t('drawPage.wishSection.itemsHeading')}
            </Typography>
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <TextField
                  value={item}
                  onChange={(event) =>
                    handleItemChange(index, event.target.value)
                  }
                  onKeyDown={(event) => {
                    // Enter starts the next thing, like a list on paper.
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    if (item.trim() !== '' && index === items.length - 1)
                      handleAddItem();
                  }}
                  fullWidth
                  autoFocus={index === focusIndex}
                  placeholder={t('drawPage.wishSection.itemPlaceholder')}
                  slotProps={{
                    htmlInput: {
                      'aria-label': `${t('drawPage.wishSection.itemsHeading')} ${index + 1}`,
                      maxLength: WISH_ITEM_MAX_LENGTH,
                    },
                  }}
                  helperText={
                    index === 0 && restoredDraft
                      ? t('drawPage.wishSection.draftRestored')
                      : undefined
                  }
                />
                {items.length > 1 && (
                  <IconButton
                    type="button"
                    aria-label={t('drawPage.wishSection.removeItem', { item })}
                    onClick={() => handleRemoveItem(index)}
                    sx={{ color: tokens.ink, minWidth: 44, minHeight: 44 }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </Box>
            ))}
            <Box>
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={items.length >= WISH_MAX_ITEMS}
                startIcon={<Add />}
                sx={{ color: tokens.ink }}
              >
                {t('drawPage.wishSection.addItem')}
              </Button>
            </Box>
            <TextField
              label={t('drawPage.wishSection.commentLabel')}
              multiline
              minRows={3}
              value={comment}
              onChange={(event) => handleCommentChange(event.target.value)}
              fullWidth
              helperText={t('drawPage.wishSection.commentHelper')}
              slotProps={{
                htmlInput: { maxLength: LETTER_COMMENT_MAX_LENGTH },
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
  first.wish === second.wish && first.comment === second.comment;

const trimLetter = (letter: Letter): Letter => ({
  wish: itemsToWish(wishToItems(letter.wish)),
  comment: letter.comment.trim(),
});

export default UserWishSection;
