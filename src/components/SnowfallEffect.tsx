import React from 'react';
import { useMediaQuery } from '@mui/material';
import Snowfall from 'react-snowfall';

// Snow falls on the spruce ground behind the content (see App), with fewer
// flakes on small screens and none for people who ask for less motion.
const SnowfallEffect = () => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    noSsr: true,
  });
  const smallScreen = useMediaQuery('(max-width: 600px)', { noSsr: true });

  if (reducedMotion) return null;

  return (
    <Snowfall
      snowflakeCount={smallScreen ? 60 : 150}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
};

export default SnowfallEffect;
