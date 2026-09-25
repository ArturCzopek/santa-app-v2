import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { airmailStripes, handFont } from '../../styles/theme';

interface PostcardProps {
  title: string;
  // The message that will be sent; null while it is being prepared.
  message: string | null;
}

// A ready message shown as an airmail postcard: exactly the text that goes
// into the group chat.
const Postcard: React.FC<PostcardProps> = ({ title, message }) => (
  <Box sx={{ p: '6px', borderRadius: '10px', background: airmailStripes }}>
    <Box
      sx={{
        borderRadius: '5px',
        // Brighter than the dialog's paper, like a card inside a letter.
        backgroundColor: '#FFFFFF',
        p: { xs: 1.5, sm: 2 },
        overflowWrap: 'anywhere',
      }}
    >
      <Typography
        sx={{ fontFamily: handFont, fontSize: '1.4rem', lineHeight: 1.1 }}
      >
        {title}
      </Typography>
      {message === null ? (
        <Box aria-hidden sx={{ mt: 1 }}>
          <Skeleton />
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      ) : (
        <Typography
          component="p"
          variant="body2"
          sx={{ whiteSpace: 'pre-line', mt: 1 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  </Box>
);

export default Postcard;
