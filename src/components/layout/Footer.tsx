import React from 'react';
import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { GitHub, Translate } from '@mui/icons-material';
import { setLanguage } from '../../i18n';
import { useTranslation } from 'react-i18next';
import { footerLinkStyles, footerStyles } from '../../styles/layoutStyles';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const otherLanguage = i18n.language === 'en' ? 'pl' : 'en';

  return (
    <Box
      component="footer"
      sx={{
        ...footerStyles,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 3,
        rowGap: 1,
      }}
    >
      {/* Named in the language it switches to, so either reader finds it. */}
      <Link
        component="button"
        type="button"
        color="inherit"
        lang={otherLanguage}
        onClick={() => setLanguage(otherLanguage)}
        sx={{ ...footerLinkStyles, gap: 0.75, font: 'inherit' }}
      >
        <Translate fontSize="small" aria-hidden />
        {otherLanguage === 'en' ? 'English' : 'Polski'}
      </Link>
      <Link
        component={RouterLink}
        to="/help"
        color="inherit"
        sx={footerLinkStyles}
      >
        {t('footer.help')}
      </Link>
      <Link
        component={RouterLink}
        to="/privacy"
        color="inherit"
        sx={footerLinkStyles}
      >
        {t('footer.privacy')}
      </Link>
      <Link
        href="https://github.com/ArturCzopek/santa-app-v2"
        target="_blank"
        rel="noopener"
        color="inherit"
        sx={{ ...footerLinkStyles, gap: 0.75 }}
      >
        <GitHub fontSize="small" />
        {t('footer.sourceCode')}
      </Link>
    </Box>
  );
};

export default Footer;
