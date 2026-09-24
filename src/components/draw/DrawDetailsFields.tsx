import React from 'react';
import { Box } from '@mui/material';
import { Control, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormTextField from '../form/FormTextField';
import FormSelect from '../form/FormSelect';
import { DrawDetails } from '../../models/Draw';

// Same limits as the Firestore rules.
export const DRAW_NAME_MAX_LENGTH = 80;
export const DESCRIPTION_MAX_LENGTH = 1000;
export const EVENT_PLACE_MAX_LENGTH = 200;
export const BUDGET_MAX = 1_000_000;

const currencyOptions = ['PLN', 'EUR', 'USD', 'GBP'].map((value) => ({
  value,
  label: value,
}));

// What the form holds, trimmed the way it is stored.
export const cleanDrawDetails = (details: DrawDetails): DrawDetails => ({
  drawName: details.drawName.trim(),
  description: details.description.trim(),
  budget: Number(details.budget),
  currency: details.currency,
  eventDate: details.eventDate ?? '',
  eventPlace: (details.eventPlace ?? '').trim(),
});

// The draw's own fields, shared by the create form and the edit dialog.
const DrawDetailsFields = <T extends FieldValues & DrawDetails>({
  control,
}: {
  control: Control<T>;
}) => {
  const { t } = useTranslation();
  const name = (field: keyof DrawDetails) => field as Path<T>;

  return (
    <>
      <FormTextField
        name={name('drawName')}
        control={control}
        label={t('createPage.drawName')}
        fullWidth
        autoComplete="off"
        slotProps={{ htmlInput: { maxLength: DRAW_NAME_MAX_LENGTH } }}
        rules={{
          validate: (value: string) =>
            value.trim().length > 0 ||
            t('createPage.validation.drawNameRequired'),
          maxLength: {
            value: DRAW_NAME_MAX_LENGTH,
            message: t('createPage.validation.drawNameTooLong'),
          },
        }}
      />

      <FormTextField
        name={name('description')}
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
          name={name('budget')}
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
              isNumber: (value: number) =>
                !isNaN(Number(value)) ||
                t('createPage.validation.budgetMustBeNumber'),
              positive: (value: number) =>
                Number(value) > 0 || t('createPage.validation.budgetPositive'),
              notTooHigh: (value: number) =>
                Number(value) <= BUDGET_MAX ||
                t('createPage.validation.budgetTooHigh'),
            },
          }}
        />

        <Box sx={{ width: { xs: 104, sm: 120 }, flexShrink: 0 }}>
          <FormSelect
            name={name('currency')}
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

      <FormTextField
        name={name('eventDate')}
        control={control}
        label={t('createPage.eventDate')}
        type="date"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        rules={{
          pattern: {
            value: /^\d{4}-\d{2}-\d{2}$/,
            message: t('createPage.validation.eventDateInvalid'),
          },
        }}
      />

      <FormTextField
        name={name('eventPlace')}
        control={control}
        label={t('createPage.eventPlace')}
        helperText={t('createPage.eventPlaceHint')}
        fullWidth
        autoComplete="off"
        slotProps={{ htmlInput: { maxLength: EVENT_PLACE_MAX_LENGTH } }}
        rules={{
          maxLength: {
            value: EVENT_PLACE_MAX_LENGTH,
            message: t('createPage.validation.eventPlaceTooLong'),
          },
        }}
      />
    </>
  );
};

export default DrawDetailsFields;
