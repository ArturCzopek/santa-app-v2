import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import DrawDetailsFields, {
  cleanDrawDetails,
} from '../components/draw/DrawDetailsFields';
import FormActions from '../components/form/FormActions';
import PasswordField from '../components/form/PasswordField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { drawService } from '../services/DrawService';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import { MIN_PASSWORD_LENGTH } from '../services/PasswordUtils';
import { tokens } from '../styles/theme';
import { DrawDetails } from '../models/Draw';

type FormData = DrawDetails & { password: string };

const CreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      drawName: '',
      description: '',
      budget: 50,
      currency: 'PLN',
      eventDate: '',
      eventPlace: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // The route is only open to signed-in users.
    if (!user) return;

    setIsSubmitting(true);
    try {
      const newDrawUid = await drawService.createDraw(
        { ...cleanDrawDetails(data), password: data.password },
        user,
      );
      notify(t('createPage.success'), 'success');
      // The invite opens first; the owner is a participant too, so the
      // letter editor is open behind it.
      navigate(`/draw/${newDrawUid}`, {
        state: { justJoined: true, justCreated: true },
      });
    } catch (error) {
      console.error('Error creating draw:', error);
      notify(t('createPage.errors.createFailed'));
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ color: tokens.snow, mb: 1.5 }}>
          {t('createPage.title')}
        </Typography>
        <Typography sx={{ color: tokens.snowMuted, fontSize: '1.125rem' }}>
          {t('createPage.lead')}
        </Typography>
      </Box>

      <PaperCard airmail onSubmit={handleSubmit(onSubmit)}>
        <DrawDetailsFields control={control} />

        <Box sx={{ borderTop: `1px dashed ${tokens.paperLine}`, pt: 2.5 }}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: t('createPage.validation.passwordRequired'),
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: t('createPage.validation.passwordTooShort'),
              },
            }}
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <PasswordField
                {...field}
                // Lets react-hook-form move focus to the field when it's invalid.
                inputRef={ref}
                label={t('createPage.password')}
                autoComplete="new-password"
                error={error?.message}
                helperText={t('createPage.passwordHint')}
              />
            )}
          />
        </Box>

        <FormActions
          primaryLabel={t('createPage.createButton')}
          secondaryLabel={t('common.cancel')}
          onSecondaryClick={() => navigate('/draws')}
          isSubmitting={isSubmitting}
        />
      </PaperCard>
    </MainLayout>
  );
};

export default CreatePage;
