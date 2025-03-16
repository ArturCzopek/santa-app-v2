import React from 'react';
import Snowfall from 'react-snowfall';

const SnowfallEffect = () => (
  <Snowfall
    snowflakeCount={200}
    style={{
      position: 'fixed',
      width: '100vw',
      height: '100vh',
    }}
  />
);

export default SnowfallEffect;
