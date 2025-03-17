import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Alert,
  useTheme,
  IconButton,
  InputAdornment,
  FormHelperText,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import ContentCard from '../components/common/ContentCard';
import FormTextField from '../components/form/FormTextField';
import FormSelect from '../components/form/FormSelect';
import FormActions from '../components/form/FormActions';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { drawService } from '../services/DrawService';
import { useAuth } from '../hooks/useAuth';
import {
  alertStyles,
  darkGreenBackground,
  inputStyles,
  inputLabelStyles,
  errorStyles,
} from '../styles/formStyles';

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
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    if (!user) {
      alert(t('createPage.errors.notAuthenticated'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newDrawUid = await drawService.createDraw(data, user);
      setSuccess(true);

      // Log the created entity after 3 seconds
      setTimeout(() => {
        console.log('Created draw:', newDrawUid);
      }, 3000);
    } catch (error) {
      console.error('Error creating draw:', error);
      alert(t('createPage.errors.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencyOptions = [
    { value: 'PLN', label: 'PLN' },
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
    { value: 'GBP', label: 'GBP' },
  ];

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <MainLayout title={t('createPage.title')}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <ContentCard
          onSubmit={handleSubmit(onSubmit)}
          sx={darkGreenBackground(theme)}
        >
          {/* Display success message if creation was successful */}
          {success && (
            <Alert severity="success" sx={alertStyles(theme)}>
              {t('createPage.success')}
            </Alert>
          )}

          <FormTextField
            name="drawName"
            control={control}
            label={t('createPage.drawName')}
            variant="outlined"
            fullWidth
            rules={{
              required: t('createPage.validation.drawNameRequired'),
              maxLength: {
                value: 80,
                message: t('createPage.validation.drawNameTooLong'),
              },
            }}
          />

          <FormTextField
            name="description"
            control={control}
            label={t('createPage.description')}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            rules={{
              required: t('createPage.validation.descriptionRequired'),
              maxLength: {
                value: 1000,
                message: t('createPage.validation.descriptionTooLong'),
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormTextField
              name="budget"
              control={control}
              label={t('createPage.budget')}
              variant="outlined"
              fullWidth
              type="number"
              rules={{
                required: t('createPage.validation.budgetRequired'),
                validate: {
                  positive: (value) =>
                    value > 0 || t('createPage.validation.budgetPositive'),
                  isNumber: (value) =>
                    !isNaN(Number(value)) ||
                    t('createPage.validation.budgetMustBeNumber'),
                },
              }}
            />

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

          {/* Password field with visibility toggle */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: t('createPage.validation.passwordRequired'),
              minLength: {
                value: 4,
                message: t('createPage.validation.passwordTooShort'),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Box sx={{ width: '100%' }}>
                <TextField
                  {...field}
                  label={t('createPage.password')}
                  variant="outlined"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    sx: inputStyles(theme),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: inputLabelStyles(theme),
                  }}
                  sx={errorStyles(theme)}
                />

                {/* Password hint text in amber color */}
                <FormHelperText
                  sx={{
                    color: theme.customColors.lightGold,
                    mt: 0.5,
                    mb: 2,
                    opacity: 0.9,
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                  }}
                >
                  {t('createPage.passwordHint')}
                </FormHelperText>
              </Box>
            )}
          />

          <FormActions
            primaryLabel={t('createPage.createButton')}
            secondaryLabel={t('common.cancel')}
            onSecondaryClick={() => navigate('/draws')}
            isSubmitting={isSubmitting}
            isDisabled={success}
          />
        </ContentCard>
      </Box>
    </MainLayout>
  );
};

export default CreatePage;
