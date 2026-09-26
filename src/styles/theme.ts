import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { plPL } from '@mui/material/locale';

// "List do Mikołaja": Christmas mail on a night-spruce ground. Paper surfaces
// carry navy ink; sealing-wax red is kept for the one main action per screen.
export const tokens = {
  spruce: '#0E2A1E',
  spruceRaised: '#163A2A',
  spruceLine: '#2C4F3E',
  snow: '#F5F1E8',
  snowMuted: '#C9D2C8',
  paper: '#FBF8F2',
  paperShade: '#F1EBDF',
  paperLine: '#DDD3C2',
  ink: '#1E2A44',
  inkMuted: '#4F5A73',
  wax: '#B3202A',
  waxDark: '#8E1820',
  stampGold: '#D9A441',
  pine: '#2A7549',
  // "Done" on the spruce ground, where pine is too dark (8.6:1 on spruce).
  pineOnDark: '#8FD1A6',
  amber: '#8A5A00',
};

export const handFont = '"Caveat", "Segoe Print", cursive';

// The red-green-red striped edge of a Christmas airmail envelope.
export const airmailStripes = `repeating-linear-gradient(135deg, ${tokens.wax} 0 10px, ${tokens.paper} 10px 16px, ${tokens.pine} 16px 26px, ${tokens.paper} 26px 32px)`;

// Gold shows on the spruce ground but not on paper (2.1:1), so paper
// surfaces switch the ring to ink through this variable.
const focusRing = {
  outline: `3px solid var(--focus-ring, ${tokens.stampGold})`,
  outlineOffset: '2px',
};

// Set on every paper surface: cards, dialogs, menus.
export const onPaper = { '--focus-ring': tokens.ink };

const baseTheme = createTheme({
  palette: {
    primary: { main: tokens.wax, dark: tokens.waxDark, contrastText: '#FFFFFF' },
    secondary: { main: tokens.pine, contrastText: '#FFFFFF' },
    error: { main: '#A61B1B' },
    warning: { main: tokens.amber },
    success: { main: tokens.pine },
    background: {
      default: tokens.spruce,
      paper: tokens.paper,
    },
    // Text on paper; pages on the spruce ground set snow themselves.
    text: {
      primary: tokens.ink,
      secondary: tokens.inkMuted,
    },
    divider: tokens.paperLine,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.15, letterSpacing: '-0.01em' },
    h2: { fontWeight: 800, fontSize: '1.625rem', lineHeight: 1.2 },
    h3: { fontWeight: 700, fontSize: '1.3rem', lineHeight: 1.25 },
    h4: { fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.3 },
    h5: { fontWeight: 700, fontSize: '1.05rem' },
    h6: { fontWeight: 700, fontSize: '1rem' },
    body1: { fontSize: '1rem', lineHeight: 1.55 },
    body2: { fontSize: '0.9375rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 700, fontSize: '1rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minHeight: '100%' },
        body: {
          minHeight: '100dvh',
          backgroundColor: tokens.spruce,
          color: tokens.snow,
          scrollbarColor: `${tokens.spruceLine} ${tokens.spruce}`,
        },
        '::selection': { backgroundColor: tokens.stampGold, color: tokens.ink },
        ':focus-visible': focusRing,
      },
    },
    MuiButtonBase: {
      styleOverrides: { root: { '&.Mui-focusVisible': focusRing } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          padding: '10px 20px',
          borderRadius: 10,
          variants: [
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                boxShadow: '0 6px 16px -8px rgba(142, 24, 32, 0.9)',
                '&:hover': { backgroundColor: tokens.waxDark },
              },
            },
            {
              props: { variant: 'outlined' },
              style: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
            },
          ],
        },
        sizeSmall: { minHeight: 36, padding: '6px 14px', fontSize: '0.9rem' },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { '&.Mui-focusVisible': focusRing } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          ...onPaper,
          borderRadius: 12,
          color: tokens.ink,
          boxShadow: '0 24px 48px -16px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    // One layout for every dialog's buttons, like FormActions: main action
    // on the right; on phones full width, main action on top.
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '0 24px 24px',
          gap: 8,
          '@media (max-width: 599.95px)': {
            flexDirection: 'column-reverse',
            alignItems: 'stretch',
            '& > :not(style) ~ :not(style)': { marginLeft: 0 },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 800, fontSize: '1.3rem', paddingBottom: 8 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8C8272' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.ink },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.ink,
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: tokens.inkMuted, '&.Mui-focused': { color: tokens.ink } },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { fontSize: '0.875rem', marginLeft: 2 } },
    },
    MuiMenu: {
      styleOverrides: { paper: { ...onPaper, color: tokens.ink } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 12px 28px -12px rgba(0, 0, 0, 0.55)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
    MuiLink: {
      styleOverrides: { root: { textUnderlineOffset: '0.2em' } },
    },
  },
});

// Polish texts inside MUI components, e.g. the alert close button.
const theme = responsiveFontSizes(createTheme(baseTheme, plPL), {
  factor: 2.2,
});

export default theme;
