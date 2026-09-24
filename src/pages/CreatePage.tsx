import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import FormTextField from '../components/form/FormTextField';
import FormSelect from '../components/form/FormSelect';
import FormActions from '../components/form/FormActions';
import PasswordField from '../components/form/PasswordField';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { drawService } from '../services/DrawService';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import { MIN_PASSWORD_LENGTH } from '../services/PasswordUtils';
import { tokens } from '../styles/theme';

// Same limits as the Firestore rules.
const DRAW_NAME_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 1000;
const BUDGET_MAX = 1_000_000;

const currencyOptions = ['PLN', 'EUR', 'USD', 'GBP'].map((value) => ({
  value,
  label: value,
}));

type FormData = {
  drawName: string;
  description: string;
  budget: number;
  currency: string;
  password: string;
};

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
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // The route is only open to signed-in users.
    if (!user) return;

    setIsSubmitting(true);
    try {
      const newDrawUid = await drawService.createDraw(
        {
          ...data,
          drawName: data.drawName.trim(),
          description: data.description.trim(),
        },
        user,
      );
      notify(t('createPage.success'), 'success');
      // The password is hashed, so this is the only moment the invite can
      // carry it. The owner is a participant too, so the letter editor opens.
      navigate(`/draw/${newDrawUid}`, {
        state: { justJoined: true, createdPassword: data.password },
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
        <FormTextField
          name="drawName"
          control={control}
          label={t('createPage.drawName')}
          fullWidth
          autoComplete="off"
          slotProps={{ htmlInput: { maxLength: DRAW_NAME_MAX_LENGTH } }}
          rules={{
            validate: (value) =>
              value.trim().length > 0 ||
              t('createPage.validation.drawNameRequired'),
            maxLength: {
              value: DRAW_NAME_MAX_LENGTH,
              message: t('createPage.validation.drawNameTooLong'),
            },
          }}
        />

        <FormTextField
          name="description"
          control={control}
          label={t('createPage.description')}
          helperText={t('createPage.descriptionHint')}
          fullWidth
          multiline
          minRows={3}
          slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX_LENGTH } }}
          rules={{
            maxLength: {
              value: DESCRIPTION_MAX_LENGTH,
              message: t('createPage.validation.descriptionTooLong'),
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <FormTextField
            name="budget"
            control={control}
            label={t('createPage.budget')}
            type="number"
            sx={{ flex: 1, minWidth: 0 }}
            slotProps={{
              htmlInput: { min: 1, max: BUDGET_MAX, inputMode: 'decimal' },
            }}
            rules={{
              required: t('createPage.validation.budgetRequired'),
              validate: {
                isNumber: (value) =>
                  !isNaN(Number(value)) ||
                  t('createPage.validation.budgetMustBeNumber'),
                positive: (value) =>
                  Number(value) > 0 ||
                  t('createPage.validation.budgetPositive'),
                notTooHigh: (value) =>
                  Number(value) <= BUDGET_MAX ||
                  t('createPage.validation.budgetTooHigh'),
              },
            }}
          />

          <Box sx={{ width: { xs: 104, sm: 120 }, flexShrink: 0 }}>
            <FormSelect
              name="currency"
              control={control}
              label={t('createPage.currency')}
              options={currencyOptions}
              rules={{
                required: t('createPage.validation.currencyRequired'),
                maxLength: {
                  value: 3,
                  message: t('createPage.validation.currencyTooLong'),
                },
              }}
            />
          </Box>
        </Box>

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
