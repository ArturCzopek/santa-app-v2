import React, { useRef } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ContentCopy, MoreHoriz, MoreVert } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PaperCard from './common/PaperCard';
import { useNotify } from '../hooks/useNotify';
import { handFont, tokens } from '../styles/theme';

const StepNumber: React.FC<{ n: number }> = ({ n }) => (
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
    {n}
  </Box>
);

const menuIconSx = {
  fontSize: '1.3rem',
  verticalAlign: 'middle',
  border: `1.5px solid ${tokens.inkMuted}`,
  borderRadius: '4px',
  mx: 0.25,
};

// Inside Messenger, Instagram and the like Google refuses to sign in, and
// that is where most invite links are opened. So there this card comes first
// and the one thing to do is get the page into the phone's own browser.
const OpenInBrowserCard = () => {
  const { t } = useTranslation();
  const notify = useNotify();
  const fieldRef = useRef<HTMLInputElement>(null);
  const url = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      notify(t('loginPage.inAppBrowser.linkCopied'), 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      // The address stays in the field below, ready to select by hand.
      fieldRef.current?.focus();
      fieldRef.current?.select();
      notify(t('loginPage.inAppBrowser.copyFailedSelect'));
    }
  };

  const step = (n: number, content: React.ReactNode) => (
    <Box
      component="li"
      sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}
    >
      <StepNumber n={n} />
      <Typography component="div">{content}</Typography>
    </Box>
  );

  return (
    <PaperCard airmail component="section" aria-labelledby="open-in-browser">
      <Box>
        <Typography
          id="open-in-browser"
          variant="h2"
          sx={{ fontSize: '1.35rem', mb: 1 }}
        >
          {t('loginPage.inAppBrowser.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('loginPage.inAppBrowser.why')}
        </Typography>
      </Box>

      <Box
        component="ol"
        sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.5 }}
      >
        {step(
          1,
          <>
            {t('loginPage.inAppBrowser.step1')}{' '}
            <MoreVert aria-hidden sx={menuIconSx} />{' '}
            {t('loginPage.inAppBrowser.or')}{' '}
            <MoreHoriz aria-hidden sx={menuIconSx} />
          </>,
        )}
        {step(2, t('loginPage.inAppBrowser.step2'))}
        {step(3, t('loginPage.inAppBrowser.step3'))}
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<ContentCopy />}
        onClick={handleCopy}
      >
        {t('loginPage.inAppBrowser.copyLink')}
      </Button>

      <TextField
        label={t('loginPage.inAppBrowser.linkLabel')}
        value={url}
        fullWidth
        size="small"
        inputRef={fieldRef}
        onFocus={(event) => event.target.select()}
        slotProps={{ input: { readOnly: true } }}
      />
    </PaperCard>
  );
};

export default OpenInBrowserCard;
