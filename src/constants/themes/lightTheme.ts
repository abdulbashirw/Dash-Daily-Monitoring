import themeSystem from '@src/constants/themes/themeSystem'

const lightTheme = {
  mode: 'light',
  system: {
    ...themeSystem,
    primary: {
      default: '#1a73e8', // Google Blue
      content: '#ffffff',
      muted: '#90caf9',
      hover: '#1765c1',
    },
    secondary: {
      default: '#5f6368', // Neutral Gray
      content: '#ffffff',
      muted: '#dadce0',
      hover: '#3c4043',
    },
    accent: {
      default: '#e37400', // Google Orange
      content: '#ffffff',
      muted: '#fbbc04',
      hover: '#c06000',
    },
    neutral: {
      default: '#f1f3f4',
      content: '#202124',
      muted: '#e0e0e0',
      hover: '#e8eaed',
    },
    base: {
      default: '#ffffff',
      medium: '#f9f9f9',
      deep: '#f1f3f4',
      content: '#202124',
      muted: '#5f6368',
      hover: '#f5f5f5',
    },

    success: {
      default: '#188038',
      content: '#ffffff',
      muted: '#81c995',
      hover: '#137333',
    },
    warning: {
      default: '#e37400',
      content: '#ffffff',
      muted: '#fbbc04',
      hover: '#c06000',
    },
    error: {
      default: '#d93025',
      content: '#ffffff',
      muted: '#f28b82',
      hover: '#b31412',
    },
    danger: {
      default: '#b31412',
      content: '#ffffff',
      muted: '#f28b82',
      hover: '#a50e0e',
    },
    info: {
      default: '#0288d1',
      content: '#ffffff',
      muted: '#81d4fa',
      hover: '#0277bd',
    },

    shadow: {
      default: '0 1px 3px rgba(60, 64, 67, 0.3)',
      sm: '0 1px 2px rgba(60, 64, 67, 0.2)',
      md: '0 2px 6px rgba(60, 64, 67, 0.25)',
      lg: '0 4px 8px rgba(60, 64, 67, 0.3)',
      xl: '0 6px 12px rgba(60, 64, 67, 0.35)',
      '2xl': '0 8px 16px rgba(60, 64, 67, 0.4)',
    },
  },
}

export default lightTheme
