import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { ExitToApp, FeedbackOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  appBarStyles,
  brandStyles,
  navButtonStyles,
  accountButtonStyles,
  accountNameStyles,
  accountMenuPaperStyles,
} from '../../styles/navbarStyles';
import MessageModal from '../MessageModal';
import ShowSantaModal from '../ShowSantaModal';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { t } = useTranslation();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [santaModalOpen, setSantaModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleLogOut = async () => {
    setMenuAnchor(null);
    await logOut();
    // Start over from the login page. A plain navigate would keep the
    // protected page remembered as the one to return to, so whoever signs in
    // next would land on it.
    window.location.replace(window.location.pathname);
  };

  const openMessageModal = () => {
    setMenuAnchor(null);
    setMessageModalOpen(true);
  };

  const userName = user?.displayName || '';

  return (
    <>
      <AppBar position="sticky" sx={appBarStyles}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 60, sm: 68 } }}>
          <ButtonBase
            component={RouterLink}
            to={user ? '/draws' : '/'}
            sx={brandStyles}
          >
            {t('navbar.title')}
          </ButtonBase>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            color="inherit"
            onClick={() => setSantaModalOpen(true)}
            sx={navButtonStyles}
          >
            {t('navbar.showSanta')}
          </Button>

          {/* Messages are tied to an account, so guests cannot send them. */}
          {user && (
            <>
              <Button
                color="inherit"
                startIcon={<FeedbackOutlined />}
                onClick={openMessageModal}
                sx={{
                  ...navButtonStyles,
                  display: { xs: 'none', md: 'inline-flex' },
                }}
              >
                {t('navbar.leaveMessage')}
              </Button>

              <ButtonBase
                aria-label={t('navbar.accountMenu', { name: userName })}
                aria-haspopup="menu"
                aria-expanded={menuAnchor ? 'true' : undefined}
                onClick={(event) => setMenuAnchor(event.currentTarget)}
                sx={accountButtonStyles}
              >
                <Avatar
                  src={user.photoURL || undefined}
                  alt=""
                  sx={{ width: 34, height: 34, fontSize: '1rem' }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography component="span" sx={accountNameStyles}>
                  {userName}
                </Typography>
              </ButtonBase>

              <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: accountMenuPaperStyles } }}
              >
                <Typography
                  sx={{ px: 2, py: 1, fontWeight: 700, maxWidth: 260 }}
                  noWrap
                >
                  {userName}
                </Typography>
                <Divider />
                {/* Wider screens have this button in the bar itself. */}
                <MenuItem
                  onClick={openMessageModal}
                  sx={{ display: { md: 'none' } }}
                >
                  <ListItemIcon>
                    <FeedbackOutlined fontSize="small" />
                  </ListItemIcon>
                  {t('navbar.leaveMessage')}
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  {t('navbar.logout')}
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {user && (
        <MessageModal
          open={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
        />
      )}

      <ShowSantaModal
        open={santaModalOpen}
        onClose={() => setSantaModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
