import React from 'react';
import { Link } from '@mui/material';
import { HelpOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';

interface HelpLinkProps {
  // The answer to open on the help page, e.g. 'password'.
  topic: string;
  children: React.ReactNode;
}

// A small link to the one help answer that fits where it is shown.
const HelpLink: React.FC<HelpLinkProps> = ({ topic, children }) => (
  <Link
    component={RouterLink}
    to={`/help?q=${topic}`}
    color="inherit"
    sx={{
      display: 'inline-flex',
      alignSelf: 'flex-start',
      alignItems: 'center',
      gap: 0.5,
      minHeight: 44,
      fontWeight: 600,
    }}
  >
    <HelpOutlined aria-hidden fontSize="small" />
    {children}
  </Link>
);

export default HelpLink;
