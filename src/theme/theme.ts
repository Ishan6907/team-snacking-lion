import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b2545', // Official Indian Parliamentary Navy
      light: '#1e3a8a',
      dark: '#06172b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c2410c', // Indian Saffron
      light: '#ea580c',
      dark: '#9a3412',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    success: {
      main: '#15803d',
      light: '#22c55e',
      dark: '#166534',
    },
    background: {
      default: '#f1f5f9', // Clean Institutional Slate
      paper: '#ffffff',   // Crisp Surface White
    },
    text: {
      primary: '#0f172a', // Slate 900 High Contrast
      secondary: '#475569', // Slate 600
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#0f172a',
    },
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.01em',
      color: '#0f172a',
    },
    h6: {
      fontWeight: 700,
      color: '#0f172a',
    },
    subtitle1: {
      fontWeight: 600,
      color: '#1e293b',
    },
    subtitle2: {
      fontWeight: 700,
      color: '#334155',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
          scrollbarColor: '#cbd5e1 #f1f5f9',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
            backgroundColor: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: 4,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '6px 16px',
        },
        containedPrimary: {
          backgroundColor: '#0b2545',
          color: '#ffffff',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#133e87',
          },
        },
        outlined: {
          borderColor: '#cbd5e1',
          color: '#0b2545',
          '&:hover': {
            borderColor: '#0b2545',
            backgroundColor: 'rgba(11, 37, 69, 0.04)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: '#cbd5e1',
          },
          '&:hover fieldset': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0b2545',
          },
        },
        input: {
          color: '#0f172a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f8fafc',
          color: '#334155',
          fontWeight: 800,
          borderBottom: '2px solid #cbd5e1',
          fontSize: '0.76rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
        root: {
          borderBottom: '1px solid #f1f5f9',
          color: '#1e293b',
          padding: '11px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 700,
          fontSize: '0.72rem',
        },
      },
    },
  },
});
