import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
  useTheme,
} from '@mui/material';
import { ExitToApp, Message, GitHub } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import NavbarItem from './NavbarItem';
import { useTranslation } from 'react-i18next';
import {
  appBarStyles,
  titleStyles,
  navItemContainerStyles,
  dividerStyles,
  userNameStyles,
  logoutButtonStyles,
} from '../../styles/navbarStyles';
import MessageModal from '../MessageModal';
import ShowSantaModal from '../ShowSantaModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [santaModalOpen, setSantaModalOpen] = useState(false);

  const handleLogOut = async () => {
    await logOut();
    // Start over from the login page. A plain navigate would keep the
    // protected page remembered as the one to return to, so whoever signs in
    // next would land on it.
    window.location.replace(window.location.pathname);
  };

  const handleOpenMessageModal = () => {
    setMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
  };

  const handleOpenSantaModal = () => {
    setSantaModalOpen(true);
  };

  const handleCloseSantaModal = () => {
    setSantaModalOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" sx={appBarStyles(theme)}>
        <Toolbar>
          <Typography
            variant="h3"
            component="div"
            sx={titleStyles(theme)}
            onClick={() => navigate('/draws')}
          >
            {t('navbar.title')}
          </Typography>

          <Box sx={navItemContainerStyles}>
            <NavbarItem
              icon={<GitHub />}
              onClick={() =>
                window.open(
                  'https://github.com/ArturCzopek/santa-app-v2',
                  '_blank',
                )
              }
            >
              {t('navbar.checkApp')}
            </NavbarItem>

            <Divider orientation="vertical" flexItem sx={dividerStyles} />

            <NavbarItem onClick={handleOpenSantaModal}>
              {t('navbar.showSanta')}
            </NavbarItem>

            {/* Messages are tied to an account, so guests cannot send them. */}
            {user && (
              <>
                <Divider orientation="vertical" flexItem sx={dividerStyles} />

                <NavbarItem icon={<Message />} onClick={handleOpenMessageModal}>
                  {t('navbar.leaveMessage')}
                </NavbarItem>

                <Divider orientation="vertical" flexItem sx={dividerStyles} />

                <Typography sx={userNameStyles(theme)}>
                  {user.displayName}
                </Typography>

                <IconButton
                  aria-label="logout"
                  onClick={handleLogOut}
                  size="small"
                  sx={logoutButtonStyles(theme)}
                >
                  <ExitToApp />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {user && (
        <MessageModal open={messageModalOpen} onClose={handleCloseMessageModal} />
      )}

      <ShowSantaModal open={santaModalOpen} onClose={handleCloseSantaModal} />
    </>
  );
};

export default Navbar;
