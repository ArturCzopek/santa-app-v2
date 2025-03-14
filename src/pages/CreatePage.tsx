import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import ContentCard from '../components/ContentCard';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { drawService } from '../services/DrawService';
import { useAuth } from '../hooks/useAuth';

type FormData = {
  drawName: string;
  description: string;
  budget: number;
  currency: string;
};

const CreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      drawName: '',
      description: '',
      budget: 50,
      currency: 'PLN',
    }
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

  const currencies = ['PLN', 'EUR', 'USD', 'GBP'];

  const inputStyles = {
    color: 'rgba(255, 255, 255, 0.95)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: '2px'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFC107',
      borderWidth: '2px'
    }
  };

  const errorStyles = {
    '& .MuiFormHelperText-root': {
      color: '#FFD54F',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      marginTop: '6px'
    },
    '& .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFD54F',
      borderWidth: '2px'
    }
  };

  return (
    <MainLayout title={t('createPage.title')}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4
        }}
      >
        <ContentCard
          onSubmit={handleSubmit(onSubmit)}
          sx={{ background: 'rgba(0, 43, 0, 0.7)' }}
        >
          {/* Display success message if creation was successful */}
          {success && (
            <Alert
              severity="success"
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: '#C8E6C9',
                '.MuiAlert-icon': {
                  color: '#4CAF50'
                }
              }}
            >
              {t('createPage.success')}
            </Alert>
          )}

          <Controller
            name="drawName"
            control={control}
            rules={{
              required: t('createPage.validation.drawNameRequired'),
              maxLength: {
                value: 200,
                message: t('createPage.validation.drawNameTooLong')
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('createPage.drawName')}
                variant="outlined"
                fullWidth
                error={!!errors.drawName}
                helperText={errors.drawName?.message}
                InputProps={{ sx: inputStyles }}
                InputLabelProps={{
                  sx: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&.Mui-focused': {
                      color: '#FFC107'
                    },
                    '&.Mui-error': {
                      color: '#FFD54F'
                    }
                  }
                }}
                sx={errorStyles}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              required: t('createPage.validation.descriptionRequired'),
              maxLength: {
                value: 1000,
                message: t('createPage.validation.descriptionTooLong')
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('createPage.description')}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputProps={{ sx: inputStyles }}
                InputLabelProps={{
                  sx: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&.Mui-focused': {
                      color: '#FFC107'
                    },
                    '&.Mui-error': {
                      color: '#FFD54F'
                    }
                  }
                }}
                sx={errorStyles}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="budget"
              control={control}
              rules={{
                required: t('createPage.validation.budgetRequired'),
                validate: {
                  positive: (value) =>
                    value > 0 || t('createPage.validation.budgetPositive'),
                  isNumber: (value) =>
                    !isNaN(Number(value)) || t('createPage.validation.budgetMustBeNumber'),
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('createPage.budget')}
                  variant="outlined"
                  fullWidth
                  type="number"
                  error={!!errors.budget}
                  helperText={errors.budget?.message}
                  InputProps={{ sx: inputStyles }}
                  InputLabelProps={{
                    sx: {
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&.Mui-focused': {
                        color: '#FFC107'
                      },
                      '&.Mui-error': {
                        color: '#FFD54F'
                      }
                    }
                  }}
                  sx={errorStyles}
                />
              )}
            />

            <Controller
              name="currency"
              control={control}
              rules={{
                required: t('createPage.validation.currencyRequired'),
                maxLength: {
                  value: 3,
                  message: t('createPage.validation.currencyTooLong')
                }
              }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.currency}
                  sx={{
                    ...errorStyles,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      borderWidth: '2px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFC107',
                      borderWidth: '2px'
                    }
                  }}
                >
                  <InputLabel
                    id="currency-label"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&.Mui-focused': {
                        color: '#FFC107'
                      },
                      '&.Mui-error': {
                        color: '#FFD54F'
                      }
                    }}
                  >
                    {t('createPage.currency')}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="currency-label"
                    label={t('createPage.currency')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#1e1e1e',
                          '& .MuiMenuItem-root': {
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)'
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.currency && (
                    <FormHelperText>
                      {errors.currency.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/draws')}
              sx={{
                minWidth: '120px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: '#9E9E9E', // Gray text
                borderColor: '#9E9E9E', // Gray border
                '&:hover': {
                  borderColor: '#BDBDBD',
                  color: '#BDBDBD'
                }
              }}
            >
              {t('common.cancel')}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting || success}
              sx={{
                minWidth: '200px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                backgroundColor: '#D32F2F',
                '&:hover': {
                  backgroundColor: '#B71C1C'
                }
              }}
            >
              {isSubmitting ? t('common.submitting') : t('createPage.createButton')}
            </Button>
          </Box>
        </ContentCard>
      </Box>
    </MainLayout>
  );
};

export default CreatePage;