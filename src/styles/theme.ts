import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#D32F2F' }, // Christmas red
    secondary: { main: '#004702' }, // Green for winter/ice theme
    background: {
      default: '#004702', // Green background
      paper: '#FFFFFF', // White for cards and paper elements
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)', // Near-white text for main content
      secondary: 'rgba(255, 255, 255, 0.85)', // Slightly dimmer white for secondary text
    },
    error: { main: '#F44336' },
    success: { main: '#4CAF50' },
  },
  typography: {
    fontFamily: '"Nunito", "Lato", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.8rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      color: 'rgba(255, 255, 255, 0.85)',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    body1: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          height: '100vh',
          backgroundColor: '#004702',
        },
        html: {
          height: '100vh',
          margin: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#B71C1C',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      },
    },
  },
});

export default theme;