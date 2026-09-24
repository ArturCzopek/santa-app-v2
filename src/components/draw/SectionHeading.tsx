import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { tokens } from '../../styles/theme';

// Section titles on the spruce ground, on the page's left edge.
const SectionHeading: React.FC<{ children: ReactNode; id?: string }> = ({
  children,
  id,
}) => (
  <Typography
    id={id}
    variant="h2"
    sx={{ color: tokens.snow, fontSize: '1.3rem', mb: 1.5 }}
  >
    {children}
  </Typography>
);

export default SectionHeading;
