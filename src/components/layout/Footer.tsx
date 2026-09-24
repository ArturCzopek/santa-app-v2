import React from 'react';
import { Box, Link } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { footerStyles } from '../../styles/layoutStyles';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={footerStyles}>
      <Link
        href="https://github.com/ArturCzopek/santa-app-v2"
        target="_blank"
        rel="noopener"
        color="inherit"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
      >
        <GitHub fontSize="small" />
        {t('footer.sourceCode')}
      </Link>
    </Box>
  );
};

export default Footer;
