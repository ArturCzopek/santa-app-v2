import React, { useState } from 'react';
import { Box } from '@mui/material';
import PaperCard from './common/PaperCard';
import HowItWorks from './HowItWorks';
import GoogleSignInButton from './GoogleSignInButton';
import OpenInBrowserCard from './OpenInBrowserCard';
import { isInAppBrowser } from '../services/inAppBrowser';

// What a guest sees on the login and invite pages: how it works and the
// Google button. Inside Messenger & co. getting to a real browser comes
// first, and the Google button steps back.
const SignInCard = () => {
  const [inApp] = useState(isInAppBrowser);

  if (!inApp) {
    return (
      <PaperCard airmail>
        <HowItWorks />
        <GoogleSignInButton />
      </PaperCard>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <OpenInBrowserCard />
      <PaperCard>
        <HowItWorks />
        <GoogleSignInButton secondary />
      </PaperCard>
    </Box>
  );
};

export default SignInCard;
