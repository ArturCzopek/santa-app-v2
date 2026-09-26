import React, { ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { airmailStripes, onPaper, tokens } from '../../styles/theme';

interface PaperCardProps {
  children: ReactNode;
  // Envelope, postcard or letter that matters most on the screen.
  airmail?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  component?: React.ElementType;
  sx?: SxProps<Theme>;
  'aria-labelledby'?: string;
}

const paperSx: SxProps<Theme> = {
  ...onPaper,
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  minWidth: 0,
  backgroundColor: tokens.paper,
  color: tokens.ink,
  borderRadius: '8px',
  p: { xs: 2.5, sm: 3.5 },
  overflowWrap: 'anywhere',
};

const shadow =
  '0 1px 0 rgba(0, 0, 0, 0.04), 0 14px 30px -14px rgba(0, 0, 0, 0.6)';

// A sheet of writing paper on the spruce ground.
const PaperCard: React.FC<PaperCardProps> = ({
  children,
  airmail = false,
  onSubmit,
  component = 'div',
  sx = {},
  ...rest
}) => {
  const sheet = (
    <Box
      component={onSubmit ? 'form' : component}
      onSubmit={onSubmit}
      noValidate={onSubmit ? true : undefined}
      sx={[
        paperSx,
        airmail ? { borderRadius: '6px' } : { boxShadow: shadow },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );

  if (!airmail) return sheet;

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        p: '7px',
        borderRadius: '12px',
        background: airmailStripes,
        boxShadow: shadow,
      }}
    >
      {sheet}
    </Box>
  );
};

export default PaperCard;
