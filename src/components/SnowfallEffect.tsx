import React from 'react';
import { useMediaQuery } from '@mui/material';
import Snowfall from 'react-snowfall';
import { CONTENT_MAX_WIDTH } from '../styles/layoutStyles';

// Snow falls on the spruce ground behind the content (see App), with fewer
// flakes on small screens and none for people who ask for less motion.
// Over the 640 px content column the snow shows at 35 % (on phones that
// is the whole screen), fading back to full 40 px beyond its edges.
const columnMask = `linear-gradient(90deg, #000 calc(50% - ${CONTENT_MAX_WIDTH / 2 + 40}px), rgba(0, 0, 0, 0.35) calc(50% - ${CONTENT_MAX_WIDTH / 2}px), rgba(0, 0, 0, 0.35) calc(50% + ${CONTENT_MAX_WIDTH / 2}px), #000 calc(50% + ${CONTENT_MAX_WIDTH / 2 + 40}px))`;

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
        // Faint over the content column, where it would drift across
        // headings and text on the ground; full at the sides.
        maskImage: columnMask,
        WebkitMaskImage: columnMask,
      }}
    />
  );
};

export default SnowfallEffect;
