import { Column, Center, Text, Section, Input, Node, Absolute, useTheme } from '@meonode/ui'
import { Button } from '@meonode/mui'
import { buttonSX } from '@src/constants/button.const'
import darkTheme from '@src/constants/themes/darkTheme'
import lightTheme from '@src/constants/themes/lightTheme'
import { DarkMode, LightMode } from '@mui/icons-material'

// Main Login Page component
const LoginPage = () => {
  const { theme, setTheme } = useTheme()
  return Column({
    minHeight: '100vh',
    overflow: 'hidden',
    children: [
      // Background Section
      Section({
        minHeight: '100vh',
        background: 'linear-gradient(135deg, theme.base 0%, theme.secondary 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        children: [
          // Animated subtle background
          Absolute({
            inset: 0,
            animation: 'gridMove 20s linear infinite',
            opacity: 0.05,
            css: {
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '40px 40px',
              '@keyframes gridMove': {
                '0%': { transform: 'translate(0, 0)' },
                '100%': { transform: 'translate(20px, 20px)' },
              },
            },
          }),

          // Login content
          Center({
            minHeight: '100vh',
            position: 'relative',
            zIndex: 2,
            children: Column({
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: 'theme.spacing.xl',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              gap: 'theme.spacing.md',
              children: [
                Button({
                  variant: 'contained',
                  sx: buttonSX.primary,
                  gap: 10,
                  onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
                  children: ['Theme', Node(theme.mode === 'light' ? DarkMode : LightMode).render()],
                }),
                // Title
                Text('LOGIN', {
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 'bold',
                  marginBottom: 'theme.spacing.sm',
                }),
                Text('Dashboard Daily Monitoring', {
                  opacity: 0.8,
                  marginBottom: 'theme.spacing.lg',
                  fontSize: '1rem',
                }),

                // Form Fields
                Column({
                  gap: 'theme.spacing.md',
                  children: [
                    Input({
                      placeholder: 'Username',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      css: {
                        '&::placeholder': { color: 'rgba(255,255,255,0.6)' },
                      },
                    }),
                    Input({
                      type: 'password',
                      placeholder: 'Password',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      css: {
                        '&::placeholder': { color: 'rgba(255,255,255,0.6)' },
                      },
                    }),
                  ],
                }),

                // Login Button
                Button({
                  children: 'Login',
                  marginTop: 'theme.spacing.lg',
                  padding: '12px',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: 'white',
                  background: 'linear-gradient(135deg, theme.primary 0%, theme.secondary 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  href: 'http://localhost:5173',
                  css: {
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    },
                  },
                }),

                // Optional: link to register or forgot password
                Text(['Forgot password'], {
                  fontSize: 'small',
                  fontWeight: 'bold',
                  marginTop: 'theme.spacing.md',
                  opacity: '0.7',
                  cursor: 'pointer',
                  css: { '&:hover': { opacity: 1, textDecoration: 'underline' } },
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  }).render()
}

export default LoginPage
