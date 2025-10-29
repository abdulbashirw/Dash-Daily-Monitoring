import themeSystem from '@src/constants/themes/themeSystem'

const darkTheme = {
  mode: 'dark',
  system: {
    ...themeSystem,
    primary: {
      default: '#8ab4f8',
      content: '#202124',
      muted: '#669df6',
      hover: '#a1c2fa',
    },
    secondary: {
      default: '#9aa0a6',
      content: '#202124',
      muted: '#bdc1c6',
      hover: '#80868b',
    },
    accent: {
      default: '#f28b82',
      content: '#202124',
      muted: '#e57373',
      hover: '#ff9b91',
    },
    neutral: {
      default: '#3c4043',
      content: '#e8eaed',
      muted: '#5f6368',
      hover: '#5f6368',
    },
    base: {
      default: '#202124',
      medium: '#303134',
      deep: '#171717',
      content: '#e8eaed',
      muted: '#9aa0a6',
      hover: '#3c4043',
    },

    success: {
      default: '#81c995',
      content: '#202124',
      muted: '#66bb6a',
      hover: '#9be7a3',
    },
    warning: {
      default: '#fbc02d',
      content: '#202124',
      muted: '#fdd835',
      hover: '#ffeb3b',
    },
    error: {
      default: '#f28b82',
      content: '#202124',
      muted: '#e57373',
      hover: '#ff9b91',
    },
    danger: {
      default: '#ea4335',
      content: '#202124',
      muted: '#ff7961',
      hover: '#ff8a80',
    },
    info: {
      default: '#8ab4f8',
      content: '#202124',
      muted: '#669df6',
      hover: '#a1c2fa',
    },

    shadow: {
      default: '0 1px 3px rgba(0, 0, 0, 0.5)',
      sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
      md: '0 2px 6px rgba(0, 0, 0, 0.45)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.5)',
      xl: '0 6px 12px rgba(0, 0, 0, 0.55)',
      '2xl': '0 8px 16px rgba(0, 0, 0, 0.6)',
    },
  },
}

export default darkTheme
