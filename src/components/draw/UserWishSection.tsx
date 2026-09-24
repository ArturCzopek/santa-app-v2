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
  // Opens the editor right away, e.g. after joining.
  startEditing?: boolean;
}

const UserWishSection: React.FC<UserWishSectionProps> = ({
  draw,
  savedWish,
  onWishSaved,
  startEditing = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const notify = useNotify();

  const userParticipant = draw.participants.find(
    (p) => p.userUuid === user?.uid,
  );

  const hasWish = savedWish !== '';

  const [isEditing, setIsEditing] = useState(startEditing);
  // Draft edited in the text field; the saved wish comes from the page.
  const [wish, setWish] = useState(startEditing ? savedWish : '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setWish(savedWish);
    setIsEditing(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !userParticipant) return;

    setIsSaving(true);
    try {
      const text = wish.trim();
      await drawService.updateWish(draw.id || '', user.uid, text);

      setIsEditing(false);
      notify(t('drawPage.wishSection.saveSuccess'), 'success');
      onWishSaved(text);
    } catch (error) {
      console.error('Error updating wish:', error);
      notify(t('drawPage.errors.wishUpdateFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box component="section">
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
                onClick={() => setIsEditing(false)}
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
              onClick={handleEditClick}
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
      </PaperCard>
    </Box>
  );
};

export default UserWishSection;
