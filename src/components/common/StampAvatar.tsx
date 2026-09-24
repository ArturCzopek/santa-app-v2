import React from 'react';
import { Box } from '@mui/material';
import { tokens } from '../../styles/theme';

interface StampAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'small' | 'large';
}

// Width and height of the picture; the perforated frame adds 5 px on each
// side, so the whole stamp lands on the 8 px hole grid.
const sizes = {
  small: { w: 38, h: 46, font: '1.2rem' },
  large: { w: 86, h: 102, font: '2.6rem' },
};

const stampColors = [
  tokens.wax,
  tokens.pine,
  tokens.ink,
  tokens.amber,
  tokens.spruceRaised,
];

const colorFor = (name: string) =>
  stampColors[
    [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      stampColors.length
  ];

// A postage stamp with a perforated edge: the person's photo or initial.
const StampAvatar: React.FC<StampAvatarProps> = ({
  name,
  photoUrl,
  size = 'small',
}) => {
  const { w, h, font } = sizes[size];

  return (
    <Box
      aria-hidden
      sx={{
        flexShrink: 0,
        p: '5px',
        lineHeight: 0,
        background:
          'radial-gradient(circle at center, transparent 2.3px, #FFFFFF 2.8px) -4px -4px / 8px 8px',
        filter: 'drop-shadow(0 1px 1.5px rgba(30, 42, 68, 0.45))',
        transform: 'rotate(-2deg)',
      }}
    >
      <Box
        sx={{
          width: w,
          height: h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colorFor(name),
          backgroundImage: photoUrl ? `url("${photoUrl}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: tokens.snow,
          fontWeight: 800,
          fontSize: font,
          lineHeight: 1,
        }}
      >
        {!photoUrl && name.charAt(0).toUpperCase()}
      </Box>
    </Box>
  );
};

export default StampAvatar;
