import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Draw, WISH_MAX_LENGTH } from '../../models/Draw';
import { drawService } from '../../services/DrawService';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import PaperCard from '../common/PaperCard';
import SectionHeading from './SectionHeading';
import { handFont, tokens } from '../../styles/theme';

interface UserWishSectionProps {
  draw: Draw;
  // The user's own letter ('' when not written yet).
  savedWish: string;
  onWishSaved: (wish: string) => void;
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
  savedWish,
  onWishSaved,
  isEditing,
  onEditingChange,
  writeButtonInRow = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const notify = useNotify();

  const userParticipant = draw.participants.find(
    (p) => p.userUuid === user?.uid,
  );

  const hasWish = savedWish !== '';

  // Draft edited in the text field; the saved wish comes from the page.
  const [wish, setWish] = useState(savedWish);
  const [isSaving, setIsSaving] = useState(false);

  // Each time the editor opens it starts from the saved letter.
  const [wasEditing, setWasEditing] = useState(isEditing);
  if (isEditing !== wasEditing) {
    setWasEditing(isEditing);
    if (isEditing) setWish(savedWish);
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !userParticipant) return;

    setIsSaving(true);
    try {
      const text = wish.trim();
      await drawService.updateWish(draw.id || '', user.uid, text);

      onEditingChange(false);
      notify(t('drawPage.wishSection.saveSuccess'), 'success');
      onWishSaved(text);
    } catch (error) {
      console.error('Error updating wish:', error);
      notify(t('drawPage.errors.wishUpdateFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const showWriteButton = hasWish || !writeButtonInRow;

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
          <TextField
            label={t('drawPage.wishSection.wishLabel')}
            multiline
            minRows={4}
            autoFocus
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            fullWidth
            placeholder={t('drawPage.wishSection.wishPlaceholder')}
            helperText={`${wish.length} / ${WISH_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: WISH_MAX_LENGTH } }}
          />
        ) : hasWish ? (
          <Typography sx={{ whiteSpace: 'pre-line' }}>{savedWish}</Typography>
        ) : (
          <Typography sx={{ color: tokens.amber, fontWeight: 700 }}>
            {t('drawPage.wishSection.noWishWarning')}
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
                  onClick={() => onEditingChange(false)}
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
                variant={hasWish ? 'outlined' : 'contained'}
                startIcon={<Edit />}
                onClick={() => onEditingChange(true)}
                sx={
                  hasWish
                    ? { color: tokens.ink, borderColor: tokens.ink }
                    : undefined
                }
              >
                {hasWish
                  ? t('drawPage.wishSection.editButton')
                  : t('drawPage.wishSection.writeButton')}
              </Button>
            )}
          </Box>
        )}
      </PaperCard>
    </Box>
  );
};

export default UserWishSection;
