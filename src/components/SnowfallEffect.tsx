import React from 'react';
import Snowfall from 'react-snowfall';

const SnowfallEffect = () => (
  <Snowfall
    snowflakeCount={200}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden'
    }}
  />
);

export default SnowfallEffect;
