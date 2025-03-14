import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Divider } from '@mui/material';
import { ExitToApp, Message, GitHub } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NavbarItem from './NavbarItem';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const { t } = useTranslation();

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#D32F2F',
        boxShadow: 'none'
      }}
    >
      <Toolbar>
        <Typography
          variant="h3"
          component="div"
          sx={{
            flexGrow: 1,
            color: '#FFFFFF',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/draws')}
        >
          {t('navbar.title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NavbarItem
            icon={<GitHub />}
            onClick={() => window.open('https://github.com/ArturCzopek/santa-app-v2', '_blank')}
          >
            {t('navbar.checkApp')}
          </NavbarItem>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

          <NavbarItem
            onClick={() => alert('Show Santa feature coming soon!')}
          >
            {t('navbar.showSanta')}
          </NavbarItem>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

          <NavbarItem
            icon={<Message />}
            onClick={() => alert('Message feature coming soon!')}
          >
            {t('navbar.leaveMessage')}
          </NavbarItem>

          {user && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

              <Typography sx={{ mx: 2, color: '#FFFFFF' }}>
                {user.displayName}
              </Typography>

              <IconButton
                aria-label="logout"
                onClick={logOut}
                size="small"
                sx={{
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ExitToApp />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;