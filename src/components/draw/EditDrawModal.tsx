import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DrawDetailsFields, { cleanDrawDetails } from './DrawDetailsFields';
import FormActions from '../form/FormActions';
import { drawService } from '../../services/DrawService';
import { useNotify } from '../../hooks/useNotify';
import { Draw, DrawDetails } from '../../models/Draw';

interface EditDrawModalProps {
  open: boolean;
  onClose: () => void;
  draw: Draw;
  onSaved: (details: DrawDetails) => void;
}

const detailsOf = (draw: Draw): DrawDetails => ({
  drawName: draw.drawName,
  description: draw.description ?? '',
  budget: draw.budget,
  currency: draw.currency,
  eventDate: draw.eventDate ?? '',
  eventPlace: draw.eventPlace ?? '',
});

// The owner changes the draw's details before the draw takes place.
const EditDrawModal: React.FC<EditDrawModalProps> = ({
  open,
  onClose,
  draw,
  onSaved,
}) => {
  const { t } = useTranslation();
  const notify = useNotify();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<DrawDetails>({
    values: detailsOf(draw),
  });

  const handleClose = () => {
    reset(detailsOf(draw));
    onClose();
  };

  const onSubmit = async (data: DrawDetails) => {
    setIsSubmitting(true);
    try {
      const details = cleanDrawDetails(data);
      await drawService.updateDrawDetails(draw.id as string, details);
      onSaved(details);
      notify(t('drawPage.edit.saved'), 'success');
      onClose();
    } catch (error) {
      console.error('Error updating draw:', error);
      notify(t('drawPage.edit.saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t('drawPage.edit.title')}</DialogTitle>
        <DialogContent
          // '&&' beats MUI's zero top padding under a title, so the first
          // field's floating label is not cut off.
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            '&&': { pt: 1 },
          }}
        >
          <DrawDetailsFields control={control} />
          <FormActions
            primaryLabel={t('drawPage.edit.save')}
            secondaryLabel={t('common.cancel')}
            onSecondaryClick={handleClose}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EditDrawModal;
