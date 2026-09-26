import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import { useAuth } from '../hooks/useAuth';
import { tokens } from '../styles/theme';
import { helpContent } from './helpContent';

// Questions and answers, open to everyone. A link like #/help?q=password
// opens that answer and scrolls to it, so screens can point at the help
// they need right there.
const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const language = i18n.language === 'en' ? 'en' : 'pl';
  const asked = useSearchParams()[0].get('q');
  const [open, setOpen] = useState<string | null>(asked);
  const askedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    askedRef.current?.scrollIntoView?.({ block: 'start' });
  }, []);

  return (
    <MainLayout>
      <Button
        color="inherit"
        startIcon={<ArrowBack />}
        onClick={() => navigate(user ? '/draws' : '/')}
        sx={{ ml: -1.5, mb: 2, color: tokens.snowMuted }}
      >
        {user ? t('common.backToDraws') : t('common.backHome')}
      </Button>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ color: tokens.snow, mb: 1.5 }}>
          {t('help.title')}
        </Typography>
        <Typography sx={{ color: tokens.snowMuted, fontSize: '1.125rem' }}>
          {t('help.lead')}
        </Typography>
      </Box>

      <PaperCard sx={{ gap: 0, py: { xs: 1, sm: 1.5 } }}>
        {helpContent[language].map((entry) => (
          <Accordion
            key={entry.id}
            ref={entry.id === asked ? askedRef : undefined}
            expanded={open === entry.id}
            onChange={(_, expanded) => setOpen(expanded ? entry.id : null)}
            disableGutters
            elevation={0}
            square
            sx={{
              backgroundColor: 'transparent',
              color: tokens.ink,
              scrollMarginTop: 88,
              borderBottom: `1px dashed ${tokens.paperLine}`,
              '&:last-of-type': { borderBottom: 'none' },
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: tokens.inkMuted }} />}
              sx={{ px: 0, minHeight: 56 }}
            >
              <Typography component="h2" sx={{ fontWeight: 700 }}>
                {entry.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0 }}>
              {entry.answer.map((paragraph) => (
                <Typography key={paragraph} sx={{ mb: 1, maxWidth: '65ch' }}>
                  {paragraph}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </PaperCard>
    </MainLayout>
  );
};

export default HelpPage;
