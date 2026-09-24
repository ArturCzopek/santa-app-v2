import React, { useId, useState } from 'react';
import { Button, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../styles/theme';

export type DrawOption = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

// Less frequent actions on a draw, behind one "Więcej" button.
const DrawOptionsMenu: React.FC<{ options: DrawOption[] }> = ({ options }) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();

  if (options.length === 0) return null;

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<MoreHoriz />}
        aria-haspopup="menu"
        aria-controls={anchor ? menuId : undefined}
        aria-expanded={anchor ? 'true' : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ color: tokens.snow }}
      >
        {t('drawPage.options.more')}
      </Button>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              setAnchor(null);
              option.onClick();
            }}
            sx={option.danger ? { color: tokens.wax } : undefined}
          >
            <ListItemIcon
              sx={option.danger ? { color: tokens.wax } : undefined}
            >
              {option.icon}
            </ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DrawOptionsMenu;
