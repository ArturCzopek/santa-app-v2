import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { handFont, tokens } from '../styles/theme';

const STEPS = ['step1', 'step2', 'step3'] as const;

// The three steps of a Secret Santa, for people who arrive for the first time.
const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
        {t('howItWorks.title')}
      </Typography>
      <Box
        component="ol"
        sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.5 }}
      >
        {STEPS.map((step, index) => (
          <Box
            component="li"
            key={step}
            sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}
          >
            <Box
              aria-hidden
              sx={{
                fontFamily: handFont,
                fontWeight: 700,
                fontSize: '1.9rem',
                lineHeight: 1,
                color: tokens.wax,
                minWidth: '1.1em',
                textAlign: 'center',
              }}
            >
              {index + 1}
            </Box>
            <Typography>{t(`howItWorks.${step}`)}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HowItWorks;
