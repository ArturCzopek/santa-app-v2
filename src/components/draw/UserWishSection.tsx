import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Draw } from '../../models/Draw';
import { drawService } from '../../services/DrawService';
import { useAuth } from '../../hooks/useAuth';
import {
  wishSectionContainerStyles,
  wishSectionTitleStyles,
  wishFormContainerStyles,
  wishTextFieldStyles,
  editButtonStyles,
  saveButtonStyles,
  cancelButtonStyles,
  buttonsContainerStyles,
  noWishWarningStyles,
  successMessageStyles,
} from '../../styles/wishSectionStyles';

interface UserWishSectionProps {
  draw: Draw;
  onDrawUpdated: (updatedDraw: Draw) => void;
}

const UserWishSection: React.FC<UserWishSectionProps> = ({
  draw,
  onDrawUpdated,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();

  const userParticipant = draw.participants.find(
    (p) => p.userUuid === user?.uid,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [wish, setWish] = useState('');
  const [originalWish, setOriginalWish] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userParticipant) {
      setWish(userParticipant.wish || '');
      setOriginalWish(userParticipant.wish || '');
    }
  }, [userParticipant]);

  const hasWish =
    userParticipant &&
    userParticipant.wish &&
    userParticipant.wish.trim() !== '';

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setWish(originalWish);
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!user || !userParticipant) return;

    setIsSaving(true);
    setSuccess(false);

    try {
      const latestDraw = await drawService.getDrawDetails(draw.id || '');

      const latestUserParticipant = latestDraw.participants.find(
        (p) => p.userUuid === user.uid,
      );

      if (!latestUserParticipant) {
        throw new Error('User not found in draw participants');
      }

      latestUserParticipant.wish = wish;

      await drawService.updateDraw(latestDraw);

      setIsEditing(false);
      setSuccess(true);
      setOriginalWish(wish);

      onDrawUpdated(latestDraw);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating wish:', error);
      alert(t('drawPage.errors.wishUpdateFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={wishSectionContainerStyles}>
      <Typography variant="h5" sx={wishSectionTitleStyles(theme)}>
        {t('drawPage.wishSection.title')}
      </Typography>

      <Box sx={wishFormContainerStyles(theme)}>
        {success && (
          <Alert severity="success" sx={successMessageStyles(theme)}>
            {t('drawPage.wishSection.saveSuccess')}
          </Alert>
        )}

        <TextField
          label={t('drawPage.wishSection.wishLabel')}
          multiline
          rows={4}
          variant="outlined"
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          disabled={!isEditing}
          fullWidth
          placeholder={t('drawPage.wishSection.wishPlaceholder')}
          sx={wishTextFieldStyles(theme)}
          InputProps={{
            sx: {
              color: theme.palette.text.primary,
            },
          }}
        />

        {!hasWish && !isEditing && (
          <Typography sx={noWishWarningStyles(theme)}>
            {t('drawPage.wishSection.noWishWarning')}
          </Typography>
        )}

        <Box sx={buttonsContainerStyles}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancelClick}
                sx={cancelButtonStyles(theme)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveClick}
                disabled={isSaving}
                sx={saveButtonStyles(theme)}
              >
                {isSaving
                  ? t('common.saving')
                  : t('drawPage.wishSection.saveButton')}
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={editButtonStyles(theme)}
            >
              {t('drawPage.wishSection.editButton')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserWishSection;
