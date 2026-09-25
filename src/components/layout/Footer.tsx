import React from 'react';
import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { GitHub } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { footerLinkStyles, footerStyles } from '../../styles/layoutStyles';

const Footer = () => {
  const { t } = useTranslation();

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
