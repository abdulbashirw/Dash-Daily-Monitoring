import { Column, Center, Section, Input, Node, useTheme, Div, Span, Img, Form, Row } from '@meonode/ui'
import { Button, IconButton } from '@meonode/mui'
import darkTheme from '@src/constants/themes/darkTheme'
import lightTheme from '@src/constants/themes/lightTheme'
import { DarkMode, LightMode, Visibility, VisibilityOff, LockOutlined, PersonOutline } from '@mui/icons-material'
import { useNavigate } from 'react-router'
import LogoImage from '@src/assets/image/admedika-logo.png'
import LogoImageWhite from '@src/assets/image/admedika-logo-white.png'
import { useLoginMutation } from '@src/redux/service/auth.service.ts'
import { useForm } from 'react-hook-form'
import { enqueueSnackbar } from 'notistack'
import { setToken } from '@src/redux/slice/auth.slice.ts'
import { useAppDispatch } from '@src/redux/store.ts'
import tinycolor from 'tinycolor2'
import { useState } from 'react'

// Main Login Page component
const LoginPage = () => {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const [login, { isLoading }] = useLoginMutation()

  type InputT = {
    name: string
    password: string
  }
  const { register, handleSubmit } = useForm<InputT>({ defaultValues: { name: '', password: '' } })

  const onSubmit = handleSubmit(formData => {
    login({
      payload: formData,
    })
      .unwrap()
      .then(res => {
        enqueueSnackbar(res.message, { variant: 'success' })
        dispatch(setToken(res.data.token))
        navigate('/', { replace: true })
      })
      .catch(err => {
        const errorMessage = err.data.message
        enqueueSnackbar(errorMessage || 'Something went wrong, try again later', { variant: 'error' })
      })
  })

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev)
  }

  const passwordInputType = showPassword ? 'text' : 'password'

  return Column({
    minHeight: '100vh',
    overflow: 'hidden',
    children: [
      // Background Section
      Section({
        minHeight: '100vh',
        background: 'linear-gradient(135deg, theme.primary.muted 0%, theme.primary 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        css: {
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            top: '-10%',
            left: '-10%',
            borderRadius: '50%',
            animation: 'float 20s infinite ease-in-out',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            bottom: '-5%',
            right: '-5%',
            borderRadius: '50%',
            animation: 'float 25s infinite ease-in-out reverse',
            zIndex: 1,
          },
          '@keyframes float': {
            '0%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(50px, 50px)' },
            '100%': { transform: 'translate(0, 0)' },
          },
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        },
        children: [
          // Login content
          Center({
            minHeight: '100vh',
            position: 'relative',
            zIndex: 2,
            children: Column({
              width: '100%',
              maxWidth: 580,
              backgroundColor: ({ system }) =>
                theme.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.7)'
                  : tinycolor(system.base.default).setAlpha(0.4).toString(),
              backdropFilter: 'blur(20px)',
              borderRadius: 'theme.radius.xl',
              padding: '48px',
              boxShadow:
                theme.mode === 'light'
                  ? '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)'
                  : '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              gap: 'theme.spacing.lg',
              animation: 'slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
              children: [
                Row({
                  justifyContent: 'center',
                  children: IconButton({
                    variant: 'text',
                    sx: {
                      color: 'theme.base.content',
                      opacity: 0.7,
                      '&:hover': { opacity: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
                    },
                    onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
                    children: Node(theme.mode === 'light' ? DarkMode : LightMode),
                  }),
                }),
                // Title
                Column({
                  gap: 'theme.spacing.xs',
                  alignItems: 'center',
                  children: [
                    Img({
                      src: theme.mode === 'light' ? LogoImage : LogoImageWhite,
                      alt: 'MeoNode Logo',
                      width: 180,
                      height: 'auto',
                      style: { marginBottom: 16 },
                    }),
                    Span('LOGIN', {
                      fontSize: '32px',
                      color: 'theme.base.content',
                      fontWeight: '800',
                      letterSpacing: '-0.5px',
                    }),
                    Span('Dashboard Daily Monitoring', {
                      opacity: 0.6,
                      fontSize: '16px',
                      color: 'theme.base.content',
                      fontWeight: 500,
                    }),
                  ],
                }),

                // Form Fields
                Form({
                  onSubmit,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  marginTop: '16px',
                  children: [
                    Column({
                      gap: '20px',
                      children: [
                        Row({
                          position: 'relative',
                          alignItems: 'center',
                          children: [
                            Div({
                              position: 'absolute',
                              left: '16px',
                              zIndex: 1,
                              color: 'theme.base.content',
                              opacity: 0.5,
                              children: Node(PersonOutline),
                            }),
                            Input({
                              placeholder: 'Username',
                              padding: '16px 16px 16px 48px',
                              borderRadius: '12px',
                              border: '1px solid transparent',
                              outline: 'none',
                              fontSize: 'theme.text.md',
                              width: '100%',
                              backgroundColor:
                                theme.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)',
                              color: 'theme.base.content',
                              transition: 'all 0.2s ease',
                              css: {
                                '&::placeholder': { color: 'theme.base.content', opacity: 0.5 },
                                '&:focus': {
                                  backgroundColor:
                                    theme.mode === 'light' ? '#fff' : 'rgba(0,0,0,0.3)',
                                  boxShadow: `0 0 0 2px ${theme.system.primary.default}`,
                                  transform: 'translateY(-1px)',
                                },
                              },
                              ...register('name'),
                            }),
                          ],
                        }),
                        Row({
                          position: 'relative',
                          alignItems: 'center',
                          children: [
                            Div({
                              position: 'absolute',
                              left: '16px',
                              zIndex: 1,
                              color: 'theme.base.content',
                              opacity: 0.5,
                              children: Node(LockOutlined),
                            }),
                            Input({
                              flex: 1,
                              type: passwordInputType,
                              placeholder: 'Password',
                              padding: '16px 48px 16px 48px',
                              borderRadius: '12px',
                              border: '1px solid transparent',
                              outline: 'none',
                              fontSize: 'theme.text.md',
                              width: '100%',
                              backgroundColor:
                                theme.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)',
                              css: {
                                '&::placeholder': { color: 'theme.base.content', opacity: 0.5 },
                                color: 'theme.base.content',
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                  backgroundColor:
                                    theme.mode === 'light' ? '#fff' : 'rgba(0,0,0,0.3)',
                                  boxShadow: `0 0 0 2px ${theme.system.primary.default}`,
                                  transform: 'translateY(-1px)',
                                },
                              },
                              ...register('password'),
                            }),
                            Div({
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              children: IconButton({
                                onClick: handleTogglePassword,
                                size: 'small',
                                sx: {
                                  color: 'theme.base.content',
                                  opacity: 0.5,
                                  '&:hover': { opacity: 1, color: 'theme.primary.default' },
                                },
                                children: Node(showPassword ? VisibilityOff : Visibility),
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),

                    // Login Button
                    Button({
                      children: isLoading ? 'Signing in...' : 'Sign In',
                      fullWidth: true,
                      disabled: isLoading,
                      padding: '14px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#fff',
                      background: `linear-gradient(135deg, ${theme.system.primary.default} 0%, ${tinycolor(theme.system.primary.default).lighten(10).toString()} 100%)`,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 10px 20px -5px ${tinycolor(theme.system.primary.default).setAlpha(0.5).toString()}`,
                      css: {
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 15px 30px -5px ${tinycolor(theme.system.primary.default).setAlpha(0.6).toString()}`,
                          filter: 'brightness(1.1)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          opacity: 0.7,
                          cursor: 'not-allowed',
                        },
                      },
                      type: 'submit',
                    }),
                  ],
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
