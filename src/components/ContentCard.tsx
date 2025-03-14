import React, { ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface ContentCardProps {
  children: ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  maxWidth?: string | number;
  component?: React.ElementType;
  sx?: SxProps<Theme>;
}

const ContentCard: React.FC<ContentCardProps> = ({
  children,
  onSubmit,
  maxWidth = '600px',
  component = 'div',
  sx = {},
}) => {
  return (
    <Box
      component={onSubmit ? 'form' : component}
      onSubmit={onSubmit}
      sx={{
        width: '100%',
        maxWidth,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        background: 'rgba(255, 255, 255, 0.15)',
        padding: 4,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default ContentCard;
