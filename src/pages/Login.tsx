import { Column, Center, Text, Section, Input, Node, useTheme, Div, Span, Img, Form, Row } from '@meonode/ui'
import { Button, IconButton } from '@meonode/mui'
import { buttonTextSX } from '@src/constants/button.const'
import darkTheme from '@src/constants/themes/darkTheme'
import lightTheme from '@src/constants/themes/lightTheme'
import { DarkMode, LightMode, Visibility, VisibilityOff } from '@mui/icons-material'
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

  const [login] = useLoginMutation()

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
        children: [
          // Login content
          Center({
            minHeight: '100vh',
            position: 'relative',
            zIndex: 2,
            children: Column({
              width: '100%',
              maxWidth: 500,
              backgroundColor: ({ system }) => tinycolor(system.base.default).setAlpha(0.6).toString(),
              backdropFilter: 'blur(10px)',
              borderRadius: 'theme.radius.xl',
              padding: 'theme.spacing.xl',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              gap: 'theme.spacing.md',
              children: [
                Div({
                  children: IconButton({
                    variant: 'contained',
                    sx: buttonTextSX.primary,
                    gap: 10,
                    onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
                    children: Node(theme.mode === 'light' ? DarkMode : LightMode),
                  }),
                }),
                // Title
                Div({
                  children: Img({
                    src: theme.mode === 'light' ? LogoImage : LogoImageWhite,
                    alt: 'MeoNode Logo',
                    width: 175,
                    height: 'auto',
                  }),
                }),

                Span('LOGIN', {
                  fontSize: 'theme.text.3xl',
                  color: 'theme.base.content',
                  fontWeight: 'bold',
                }),
                Span('Dashboard Daily Monitoring', {
                  opacity: 0.8,
                  fontSize: 'theme.text.xl',
                  color: 'theme.base.content',
                }),

                // Form Fields
                Form({
                  onSubmit,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'theme.spacing.lg',
                  children: [
                    Column({
                      gap: 'theme.spacing.md',
                      children: [
                        Input({
                          placeholder: 'Username',
                          padding: 'theme.spacing.md',
                          borderRadius: 'theme.radius.md',
                          border: 'none',
                          outline: 'none',
                          fontSize: 'theme.text.md',
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          color: 'theme.base.content',
                          css: {
                            '&::placeholder': { color: 'theme.base.content' },
                          },
                          ...register('name'),
                        }),
                        // Input({
                        //   type: 'password',
                        //   placeholder: 'Password',
                        //   padding: 'theme.spacing.md',
                        //   borderRadius: 'theme.radius.md',
                        //   border: 'none',
                        //   outline: 'none',
                        //   fontSize: 'theme.text.md',
                        //   backgroundColor: 'rgba(0,0,0,0.1)',
                        //   css: {
                        //     '&::placeholder': { color: 'theme.base.content' },
                        //   },
                        //   ...register('password'),
                        // }),
                        Row({
                          position: 'relative',
                          children: [
                            Input({
                              flex: 1,
                              type: passwordInputType,
                              placeholder: 'Password',
                              padding: 'theme.spacing.md',
                              borderRadius: 'theme.radius.md',
                              border: 'none',
                              outline: 'none',
                              fontSize: 'theme.text.md',
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              css: {
                                '&::placeholder': { color: 'theme.base.content' },
                                color: 'theme.base.content',
                                paddingRight: '48px',
                              },
                              ...register('password'),
                            }),
                            Div({
                              position: 'absolute',
                              right: 'theme.spacing.xs',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              children: IconButton({
                                onClick: handleTogglePassword,
                                size: 'small',
                                sx: { color: 'theme.base.content', '&:hover': { color: 'theme.primary.default' } },
                                children: Node(showPassword ? VisibilityOff : Visibility),
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),

                    // Login Button
                    Button({
                      children: 'Login',
                      fullWidth: true,
                      marginTop: 'theme.spacing.sm',
                      padding: 'theme.spacing.sm theme.spacing.md',
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      fontSize: 'large',
                      color: 'theme.primary.content',
                      background: 'linear-gradient(135deg, theme.primary 0%, theme.primary.hover 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      css: {
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        },
                      },
                      type: 'submit',
                    }),
                  ],
                }),

                // Optional: link to register or forgot password
                Text('Forgot password', {
                  fontSize: 'theme.text.sm',
                  fontWeight: 'bold',
                  marginTop: 'theme.spacing.md',
                  opacity: '0.7',
                  cursor: 'pointer',
                  color: 'theme.base.content',
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
