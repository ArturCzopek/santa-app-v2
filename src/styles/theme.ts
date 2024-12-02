import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#D32F2F' },
    secondary: { main: '#03A9F4' },
    background: {
      default: '#03A9F4',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0, // Reset body margin
          padding: 0, // Reset body padding
          height: '100vh', // Make sure it takes the full height
          overflow: 'hidden', // Prevent scrollbars
        },
        html: {
          height: '100vh',
          margin: 0,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
