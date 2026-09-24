import React, { ReactNode } from 'react';
import { Box, Button, SxProps, Theme } from '@mui/material';

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'contained' | 'outlined';
  sx?: SxProps<Theme>;
}

interface ActionButtonsProps {
  buttons: ActionButtonProps[];
  containerStyles?: SxProps<Theme>;
  children?: ReactNode;
}

// A row of page actions that stacks to full-width buttons on phones.
const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  containerStyles = {},
  children,
}) => (
  <Box
    sx={[
      {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        '& > *': { flex: { xs: '1 1 100%', sm: '0 0 auto' } },
      },
      ...(Array.isArray(containerStyles) ? containerStyles : [containerStyles]),
    ]}
  >
    {buttons.map((button) => (
      <Button
        key={button.label}
        variant={button.variant ?? 'contained'}
        color={button.variant === 'outlined' ? 'inherit' : 'primary'}
        startIcon={button.icon}
        onClick={button.onClick}
        sx={button.sx}
      >
        {button.label}
      </Button>
    ))}
    {children}
  </Box>
);

export default ActionButtons;
