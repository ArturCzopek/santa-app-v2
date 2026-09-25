import React from 'react';
import { Box } from '@mui/material';
import { tokens } from '../../styles/theme';

interface PostmarkProps {
  label: string;
  tone: 'waiting' | 'done';
  // Lighter inks for the spruce ground.
  onDark?: boolean;
}

const inks = {
  waiting: { paper: tokens.amber, dark: tokens.stampGold },
  done: { paper: tokens.pine, dark: tokens.pineOnDark },
};

// A double-ringed rubber stamp, slightly askew, for the draw status. Big
// and in sentence case so it stays easy to read, also for older eyes.
const Postmark: React.FC<PostmarkProps> = ({ label, tone, onDark = false }) => {
  const ink = inks[tone][onDark ? 'dark' : 'paper'];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        flexShrink: 0,
        mx: '3px',
        px: 1.25,
        py: 0.5,
        color: ink,
        border: `2px solid ${ink}`,
        borderRadius: '6px',
        outline: `1px solid ${ink}`,
        outlineOffset: '2px',
        fontSize: '0.875rem',
        fontWeight: 800,
        letterSpacing: '0.02em',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        transform: 'rotate(-2deg)',
      }}
    >
      {label}
    </Box>
  );
};

export default Postmark;
