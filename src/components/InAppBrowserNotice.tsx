import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { isInAppBrowser } from '../services/inAppBrowser';
import { useNotify } from '../hooks/useNotify';

// Shown next to the Google button when the page is open inside Messenger,
// Instagram and the like, where Google blocks signing in.
const InAppBrowserNotice = () => {
  const { t } = useTranslation();
  const notify = useNotify();

  if (!isInAppBrowser()) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify(t('loginPage.inAppBrowser.linkCopied'), 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      notify(
        t('loginPage.inAppBrowser.copyFailed', { url: window.location.href }),
      );
    }
  };

  return (
    <Alert
      severity="warning"
      sx={{ width: '100%', boxSizing: 'border-box', textAlign: 'left' }}
    >
      {t('loginPage.inAppBrowser.message')}
      <Box sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<ContentCopy />}
          onClick={handleCopyLink}
        >
          {t('loginPage.inAppBrowser.copyLink')}
        </Button>
      </Box>
    </Alert>
  );
};

export default InAppBrowserNotice;
