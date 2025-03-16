import React, { ReactNode } from 'react';
import { Box, Button, SxProps, Theme, useTheme } from '@mui/material';

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  customStyles?: SxProps<Theme>;
}

interface ActionButtonsProps {
  buttons: ActionButtonProps[];
  containerStyles?: SxProps<Theme>;
  children?: ReactNode;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  containerStyles = {},
  children,
}) => {

  const baseButtonStyles: SxProps<Theme> = {
    minWidth: '220px',
    py: 1.5,
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        ...containerStyles,
      }}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="contained"
          color={button.color || 'primary'}
          startIcon={button.icon}
          onClick={button.onClick}
          sx={{
            ...baseButtonStyles,
            ...(button.customStyles || {}),
          }}
        >
          {button.label}
        </Button>
      ))}
      {children}
    </Box>
  );
};

export default ActionButtons;
