import { Button, IconButton, Tooltip, Typography, Modal } from '@meonode/mui'
import {
  Center,
  Column,
  Div,
  Img,
  Node,
  Root,
  Row,
  Section,
  Span,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useTheme,
} from '@meonode/ui'
import {
  LightMode,
  DarkMode,
  AccountCircle,
  PersonalInjuryOutlined,
  AssignmentAdd,
  LocalPharmacyOutlined,
  Settings,
  Fullscreen,
  LogoutRounded,
  TrendingUp,
  DynamicForm,
} from '@mui/icons-material'
import { buttonTextSX } from '@src/constants/button.const'
import darkTheme from '@src/constants/themes/darkTheme'
import lightTheme from '@src/constants/themes/lightTheme'
import dayjs from 'dayjs'
import type { OverridableComponent } from '@mui/types'
import type { SvgIconTypeMap } from '@mui/material'
import LogoImage from '@src/assets/image/LOGO.png'
import { useEffect, useRef, useState } from 'react'
import { useGetDailyMonitoringQuery } from '@src/redux/service/daily-monitoring.service.ts'
import useGetToken from '@src/redux/hook/useGetToken.ts'
import { useNavigate } from 'react-router'
import { deleteToken } from '@src/redux/slice/auth.slice.ts'
import { useAppDispatch } from '@src/redux/store.ts'
import tinycolor from 'tinycolor2'

function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

export default function App() {
  const { theme, setTheme } = useTheme()
  const token = useGetToken()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // States
  const [isMainTableFullscreen, setIsMainTableFullscreen] = useState(false)

  const payor = parseJwt(token)
  const startDate = dayjs().subtract(1, 'w').format('YYYY-MM-DD')
  const endDate = dayjs().format('YYYY-MM-DD')

  const { data: { data } = { data: undefined }, refetch } = useGetDailyMonitoringQuery(
    {
      payload: {
        payor_code: payor.payor_code,
        start_date: startDate,
        end_date: endDate,
        //start_date: '2025-01-01',
        //end_date: '2025-01-29',
      },
    },
    { skip: !token },
  )

  console.log(data)

  const totalPasien =
    data?.reduce((acc, curr) => {
      const cardNo = curr?.Header?.CardNo
      if (cardNo && !acc.includes(cardNo)) acc.push(cardNo)
      return acc
    }, [] as string[])?.length || 0

  // const totalProvider =
  //   data?.reduce((acc, curr) => {
  //     const ProviderID = curr?.Header?.ProviderID
  //     if (ProviderID && !acc.includes(ProviderID)) acc.push(ProviderID)
  //     return acc
  //   }, [] as string[])?.length || 0

  const totalProvider = new Set(data?.map(item => item?.Header?.ProviderID).filter(Boolean)).size || 0

  const totalAdmission =
    data?.reduce((acc, curr) => {
      const AdmissionDate = curr?.Header?.CardNo
      if (AdmissionDate && !acc.includes(AdmissionDate)) acc.push(AdmissionDate)
      return acc
    }, [] as string[])?.length || 0

  const totalDischarge =
    data?.reduce((acc, curr) => {
      const DischargeDate = curr?.Header?.DischargeDate
      if (DischargeDate && !acc.includes(DischargeDate)) acc.push(DischargeDate)
      return acc
    }, [] as string[])?.length || 0

  const cards: {
    id: string
    label: string
    value: string
    icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
      muiName: string
    }
    gradientStart: string
    gradientEnd: string
  }[] = [
    {
      id: 'C1',
      value: totalPasien.toString(),
      label: 'Total Patient',
      icon: PersonalInjuryOutlined,
      gradientStart: '#11998e', // Hijau Tua
      gradientEnd: '#38ef7d',
    },
    {
      id: 'C2',
      label: 'Total Provider',
      value: totalProvider.toString(),
      icon: AssignmentAdd,
      gradientStart: '#c0392b', // Merah Tua (Deep Red)
      gradientEnd: '#e74c3c', // Merah Cerah (Bright Red)
    },
    {
      id: 'C3',
      label: 'Total Admission',
      value: totalAdmission.toString(),
      icon: LocalPharmacyOutlined,
      gradientStart: '#0072ff', // Biru Tua
      gradientEnd: '#00c6ff', // Biru Muda
    },
    {
      id: 'C4',
      label: 'Total Discharge',
      value: totalDischarge.toString(),
      icon: Settings,
      gradientStart: '#ff4b1f', // Merah Oranye
      gradientEnd: '#ff9068',
    },
  ]

  const headerData = Object.entries(
    data?.reduce(
      (acc, item) => {
        const key = item.Header?.ICDXDesc || '-'
        if (!acc[key]) acc[key] = 0
        acc[key] += 1
        return acc
      },
      {} as { ICDXDesc: string; total: number },
    ) || {},
  )
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(deleteToken())
    navigate('/login')
  }

  // const intervalRef = useRef<NodeJS.Timeout | string | number | undefined | null>(null)
  //
  // useEffect(() => {
  //   if (!intervalRef.current) {
  //     intervalRef.current = setInterval(async () => {
  //       await refetch()
  //     }, 10000)
  //   }
  //
  //   return () => {
  //     clearInterval(intervalRef.current)
  //   }
  // }, [])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(async () => {
        try {
          await refetch()
        } catch (err) {
          console.error('Refetch failed:', err)
        }
      }, 600000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [refetch])

  if (!data) return null

  return Root({
    backgroundColor: 'theme.base.deep',
    color: 'theme.base.content',
    maxHeight: '100dvh',
    padding: 'theme.spacing.md',
    css: {
      '@keyframes breath': {
        from: {
          animationTimingFunction: 'ease-out',
        },
        to: {
          transform: 'scale(1.25) translateY(-5px) perspective(1px)',
          textShadow: '0 0 20px var(--really-green)',
          animationTimingFunction: 'ease-in-out',
        },
      },
    },
    children: Column({
      flex: 1,
      backgroundColor: 'theme.base',
      boxShadow: 'theme.shadow.md',
      borderRadius: 'theme.radius.xl',
      gap: 'theme.spacing.md',
      children: [
        Row({
          padding: 'theme.spacing.lg',
          gap: 'theme.spacing.sm',
          children: [
            Span('Daily Monitoring', {
              fontSize: 'theme.text.3xl',
              fontWeight: '800',
              animation: 'breath',
            }),
            Row({
              flex: 1,
              justifyContent: 'flex-end',
              gap: 'theme.spacing.md',
              children: [
                Center({
                  children: Row({
                    gap: 8,
                    alignItems: 'center',
                    children: [
                      Button({
                        sx: buttonTextSX.baseContent,
                        gap: 'theme.spacing.sm',
                        onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
                        children: Node(theme.mode === 'light' ? DarkMode : LightMode),
                      }),
                      Node(AccountCircle),
                      Text(payor.name),
                      Button({
                        sx: buttonTextSX.danger,
                        onClick: () => setShowLogoutModal(true),
                        startIcon: Node(LogoutRounded).render(),
                        children: 'Logout',
                      }),
                    ],
                  }),
                }),
                showLogoutModal &&
                  Modal({
                    open: showLogoutModal,
                    onClose: () => setShowLogoutModal(false),
                    children: Center({
                      minHeight: '100dvh',
                      children: Column({
                        background: `linear-gradient(135deg, theme.base.deep 0%, theme.base 100%)`,
                        maxWidth: 'theme.breakpoint.md',
                        alignItems: 'center',
                        gap: 'theme.spacing.md',
                        padding: 'theme.spacing.lg',
                        borderRadius: 'theme.radius.lg',
                        color: 'theme.base.content',
                        children: [
                          Typography({
                            variant: 'h6',
                            fontWeight: 'bold',
                            color: 'theme.text.primary',
                            children: 'Konfirmasi Logout',
                          }),
                          Text('Apakah kamu yakin ingin keluar dari aplikasi ini?'),
                          Row({
                            justifyContent: 'center',
                            gap: 'theme.spacing.md',
                            mt: 'theme.spacing.md',
                            children: [
                              Button({
                                sx: buttonTextSX.baseContent,
                                onClick: () => setShowLogoutModal(false),
                                children: 'Batal',
                              }),
                              Button({
                                sx: buttonTextSX.danger,
                                onClick: () => {
                                  setShowLogoutModal(false)
                                  handleLogout()
                                },
                                children: 'Logout',
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
              ],
            }),
          ],
        }),
        Column({
          flex: 1,
          gap: 'theme.spacing.md',
          paddingInline: 'theme.spacing.lg',
          paddingBlock: 'theme.spacing.sm',
          children: [
            Row({
              flex: 1,
              flexBasis: '40%',
              flexShrink: 0,
              maxHeight: 350,
              gap: 'theme.spacing.md',
              children: [
                Row({
                  flexBasis: '60%',
                  gap: 20,
                  children: [
                    Column({
                      flex: 1,
                      gap: 'theme.spacing.md',
                      children: [
                        Column({
                          flex: 1,
                          position: 'relative',
                          height: 100,
                          aspectRatio: 4,
                          children: [
                            Img({
                              src: LogoImage,
                              alt: 'MeoNode Logo',
                              objectFit: 'contain',
                              flex: 1,
                              width: '100%',
                            }),
                            Span(`Update: ${startDate} - ${endDate}`, {
                              fontSize: 'theme.text.md',
                              fontWeight: 'bold',
                              margin: 0,
                            }),
                          ],
                        }),
                        Column({
                          flex: 1,
                          padding: 'theme.spacing.md',
                          gap: 'theme.spacing.sm',
                          borderRadius: 'theme.radius.lg',
                          background: `linear-gradient(135deg, ${cards[0].gradientStart} 0%, ${cards[0].gradientEnd} 100%)`,
                          color: 'white',
                          boxShadow: 'theme.shadow.md',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                          css: {
                            '&:hover': {
                              transform: 'translateY(-5%)',
                              boxShadow: 'theme.shadow.lg',
                            },
                          },
                          children: [
                            Node(cards[0].icon, {
                              fontSize: '10vw',
                              position: 'absolute',
                              zIndex: 0,
                              bottom: '-30%',
                              left: '-10%',
                              opacity: 0.3,
                            }),
                            Row({
                              alignItems: 'center',
                              gap: 'theme.spacing.md',
                              children: [
                                Node(cards[0].icon, { fontSize: 'theme.text.5xl' }),
                                Span(cards[0].label, { flex: 1, fontSize: 'theme.text.3xl', fontWeight: 'bold' }),
                              ],
                            }),
                            Span(cards[0].value, {
                              marginInlineStart: 'auto',
                              marginBlockStart: 'auto',
                              marginInlineEnd: 'theme.spacing.md',
                              fontSize: 'theme.text.6xl',
                              fontWeight: 'bold',
                            }),
                          ],
                        }),
                      ],
                    }),
                    Column({
                      flex: 1,
                      padding: 'theme.spacing.md',
                      gap: 'theme.spacing.sm',
                      borderRadius: 'theme.radius.lg',
                      background: `linear-gradient(135deg, ${cards[1].gradientStart} 0%, ${cards[1].gradientEnd} 100%)`,
                      color: 'white',
                      boxShadow: 'theme.shadow.md',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                      css: {
                        '&:hover': {
                          transform: 'translateY(-5%)',
                          boxShadow: 'theme.shadow.lg',
                        },
                      },
                      children: [
                        Node(cards[1].icon, {
                          fontSize: '15vw',
                          position: 'absolute',
                          zIndex: 0,
                          bottom: '-20%',
                          left: '-10%',
                          opacity: 0.3,
                        }),
                        Row({
                          alignItems: 'center',
                          gap: 'theme.spacing.md',
                          children: [
                            Node(cards[1].icon, { fontSize: 'theme.text.6xl' }),
                            Span(cards[1].label, { flex: 1, fontSize: 'theme.text.4xl', fontWeight: 'bold' }),
                          ],
                        }),
                        Span(cards[1].value, {
                          marginInlineStart: 'auto',
                          marginBlockStart: 'auto',
                          marginInlineEnd: 'theme.spacing.md',
                          fontSize: 'theme.text.6xl',
                          fontWeight: 'bold',
                        }),
                      ],
                    }),
                    Column({
                      flex: 1,
                      flexhShrink: 0,
                      gap: 'theme.spacing.md',
                      children: [
                        Column({
                          flex: 1,
                          flexhShrink: 0,
                          padding: 'theme.spacing.md',
                          gap: 'theme.spacing.sm',
                          borderRadius: 'theme.radius.lg',
                          background: `linear-gradient(135deg, ${cards[2].gradientStart} 0%, ${cards[2].gradientEnd} 100%)`,
                          color: 'white',
                          boxShadow: 'theme.shadow.md',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                          css: {
                            '&:hover': {
                              transform: 'translateY(-5%)',
                              boxShadow: 'theme.shadow.lg',
                            },
                          },
                          children: [
                            Node(cards[2].icon, {
                              fontSize: '8vw',
                              position: 'absolute',
                              zIndex: 0,
                              bottom: '-20%',
                              left: '-8%',
                              opacity: 0.3,
                            }),
                            Row({
                              alignItems: 'center',
                              gap: 'theme.spacing.md',
                              children: [
                                Node(cards[2].icon, { fontSize: 'theme.text.5xl' }),
                                Span(cards[2].label, { flex: 1, fontSize: 'theme.text.3xl', fontWeight: 'bold' }),
                              ],
                            }),
                            Span(cards[2].value, {
                              marginInlineStart: 'auto',
                              marginBlockStart: 'auto',
                              marginInlineEnd: 'theme.spacing.md',
                              fontSize: 'theme.text.6xl',
                              fontWeight: 'bold',
                            }),
                          ],
                        }),
                        Column({
                          flex: 1,
                          flexhShrink: 0,
                          padding: 'theme.spacing.md',
                          gap: 'theme.spacing.sm',
                          borderRadius: 'theme.radius.lg',
                          background: `linear-gradient(135deg, ${cards[3].gradientStart} 0%, ${cards[3].gradientEnd} 100%)`,
                          color: 'white',
                          boxShadow: 'theme.shadow.md',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                          css: {
                            '&:hover': {
                              transform: 'translateY(-5%)',
                              boxShadow: 'theme.shadow.lg',
                            },
                          },
                          children: [
                            Node(cards[3].icon, {
                              fontSize: '8vw',
                              position: 'absolute',
                              zIndex: 0,
                              bottom: '-20%',
                              left: '-8%',
                              opacity: 0.3,
                            }),
                            Row({
                              alignItems: 'center',
                              gap: 'theme.spacing.md',
                              children: [
                                Node(cards[3].icon, { fontSize: 'theme.text.5xl' }),
                                Span(cards[3].label, {
                                  flex: 1,
                                  fontSize: 'theme.text.3xl',
                                  fontWeight: 'bold',
                                }),
                              ],
                            }),
                            Span(cards[3].value, {
                              marginInlineStart: 'auto',
                              marginBlockStart: 'auto',
                              marginInlineEnd: 'theme.spacing.md',
                              fontSize: 'theme.text.6xl',
                              fontWeight: 'bold',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                Column({
                  flexBasis: '40%',
                  gap: 'theme.spacing.sm',
                  overflow: 'hidden',
                  padding: 'theme.spacing.md',
                  backgroundColor: 'theme.neutral',
                  borderRadius: 'theme.radius.lg',
                  boxShadow: 'theme.shadow.md',
                  children: [
                    Row({
                      placeContent: 'center',
                      placeItems: 'center',
                      gap: 'theme.spacing.sm',
                      children: [
                        Node(TrendingUp, { color: 'theme.primary' }),
                        Typography({
                          fontSize: 'theme.text.2xl',
                          fontWeight: 'bold',
                          color: 'theme.text.primary',
                          paddingBlock: 'theme.spacing.sm',
                          textAlign: 'center',
                          children: 'Trend Diagnosa',
                        }),
                      ],
                    }),
                    Div({
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'theme.spacing.sm',
                      overflow: 'auto',
                      borderBottom: '1px solid',
                      backgroundColor: 'theme.base',
                      borderTopLeftRadius: 'theme.spacing.sm',
                      borderTopRightRadius: 'theme.spacing.sm',
                      children: Table({
                        flex: 1,
                        cellPadding: 0,
                        cellSpacing: 0,
                        borderCollapse: 'collapse',
                        css: {
                          '& tbody td': {
                            borderLeft: '1px solid rgba(0,0,0,0.05)',
                            borderRight: '1px solid rgba(0,0,0,0.05)',
                            padding: 'theme.spacing.sm',
                            fontSize: 15,
                            color: 'theme.text.secondary',
                            transition: 'all 0.25s ease-in-out',
                          },

                          '& tbody tr:nth-child(odd) td': {
                            backgroundColor: 'theme.base', // baris ganjil
                          },

                          '& tbody tr:nth-child(even) td': {
                            backgroundColor: 'theme.neutral.hover', // baris genap
                          },

                          '& thead tr': {
                            position: 'sticky',
                            top: 0,
                            background: theme => {
                              const firstColor = tinycolor(theme.system.success.default).toHexString()
                              const secondColor = tinycolor(theme.system.primary.default).toHexString()
                              return `linear-gradient(90deg, ${firstColor}, ${secondColor})`
                            },
                            '& th': {
                              color: 'theme.primary.content',
                              letterSpacing: '0.4px',
                              textTransform: 'capitalize',
                              boxShadow: 'inset 0 -2px 0 rgba(255,255,255,0.1), 0 2px 6px rgba(0,0,0,0.1)',
                              position: 'relative',
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                // backgroundColor: 'theme.primary',
                                zIndex: -1,
                              },
                            },
                            '& th:first-child': {
                              borderTopLeftRadius: 'theme.radius.md',
                              boxShadow: 'inset 2px 0 0 rgba(255,255,255,0.1)', // sedikit cahaya di sisi kiri
                              // background: 'linear-gradient(135deg, theme.primary, theme.primary.hover)', // gradasi halus ke pojok kiri
                            },

                            '& th:last-child': {
                              borderTopRightRadius: 'theme.radius.md',
                              boxShadow: 'inset -2px 0 0 rgba(255,255,255,0.1)', // cahaya halus di sisi kanan
                              // background: 'linear-gradient(225deg, theme.primary, theme.primary.hover)', // gradasi searah ke kanan
                            },
                          },
                        },
                        children: [
                          Thead({
                            fontWeight: 'bold',
                            fontSize: 18,
                            children: Tr({
                              children: [
                                Th({
                                  children: 'Diagnosis',
                                  padding: 'theme.spacing.sm',
                                  style: { width: '100%' },
                                }),
                                Th({
                                  children: 'Total Patient',
                                  padding: 'theme.spacing.sm',
                                  style: { width: 'auto', whiteSpace: 'nowrap' },
                                }),
                              ],
                            }),
                          }),
                          Tbody({
                            children: headerData.map(([ICDXDesc, total]) =>
                              Tr({
                                children: [
                                  Td({ children: ICDXDesc }),
                                  Td({
                                    children: total.toString(),
                                    fontWeight: 'bold',
                                    backgroundColor: 'theme.neutral.hover',
                                    textAlign: 'center',
                                  }),
                                ],
                              }),
                            ),
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            Column({
              flex: 1,
              flexBasis: '60%',
              position: isMainTableFullscreen ? 'fixed' : undefined,
              inset: isMainTableFullscreen ? 0 : undefined,
              zIndex: isMainTableFullscreen ? '9999999999999' : undefined,
              backgroundColor: 'theme.base',
              maxHeight: '100vh',
              gap: 'theme.spacing.sm',
              children: [
                Row({
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  children: [
                    Row({
                      flex: 1,
                      placeItems: 'center',
                      gap: 'theme.spacing.sm',
                      children: [
                        Node(DynamicForm, { color: 'theme.primary' }),
                        Typography({
                          fontSize: 'theme.text.2xl',
                          fontWeight: 'bold',
                          color: 'theme.text.primary',
                          paddingBlock: 'theme.spacing.sm',
                          textAlign: 'center',
                          children: 'Member List',
                        }),
                      ],
                    }),
                    Tooltip({
                      title: 'Show Fullscreen',
                      arrow: true,
                      children: IconButton({
                        color: 'theme.base.content',
                        onClick: () => setIsMainTableFullscreen(prevState => !prevState),
                        children: Node(Fullscreen),
                      }),
                    }),
                  ],
                }),
                Column({
                  flex: 1,
                  gap: 'theme.spacing.sm',
                  overflow: 'auto',
                  backgroundColor: 'theme.base',
                  border: '1px solid theme.secondary',
                  borderTopLeftRadius: 'theme.spacing.sm',
                  borderTopRightRadius: 'theme.spacing.sm',
                  children: Table({
                    flex: 1,
                    position: 'relative',
                    cellPadding: 0,
                    cellSpacing: 0,
                    borderCollapse: 'collapse',
                    css: {
                      '& tbody td': {
                        border: '1px solid',
                        borderColor: 'theme.secondary',
                        padding: 'theme.spacing.sm',
                        backgroundColor: 'theme.base',
                      },
                      '& thead tr': {
                        background: theme => {
                          const firstColor = tinycolor(theme.system.success.default).toHexString()
                          const secondColor = tinycolor(theme.system.primary.default).toHexString()
                          return `linear-gradient(90deg, ${firstColor}, ${secondColor})`
                        },
                        position: 'sticky',
                        top: 0,
                        '& th': {
                          color: 'theme.secondary.content',
                          position: 'relative',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: -1,
                          },
                        },
                        '& th:first-child': {
                          borderTopLeftRadius: 'theme.spacing.sm',
                        },
                        '& th:last-child': {
                          borderTopRightRadius: 'theme.spacing.sm',
                        },
                      },
                    },
                    children: [
                      Thead({
                        fontWeight: 'bold',
                        fontSize: 18,
                        children: Tr({
                          children: [
                            Th({
                              children: 'Member ID',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Member Name',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Member Status',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Provider Name',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Admission Date',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Days',
                              padding: 'theme.spacing.sm',
                            }),
                          ],
                        }),
                      }),
                      Tbody({
                        children: data.map((item, index) =>
                          Tr({
                            key: index,
                            children: [
                              Td({ children: item.Header.MemberID || '-', textAlign: 'center' }),

                              Td({
                                children: item.Header.MemberName || '-',
                              }),
                              Td({
                                children:
                                  item.Header.PD === 'P' ? 'Principal' : item.Header.PD === 'D' ? 'Dependent' : '-',
                                textAlign: 'center',
                              }),
                              Td({
                                children: item.Header.ProviderName || '-',
                                textAlign: 'center',
                              }),
                              Td({
                                children: dayjs(item.Header.AdmissionDate, 'YYYY-MM-DD').format('DD MMMM YYYY') || '-',
                                textAlign: 'center',
                              }),
                              Td({
                                children: item.Header.Days || '-',
                                textAlign: 'center',
                              }),
                            ],
                          }),
                        ),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),

        // Footer
        Section({
          backgroundColor: 'theme.text.primary',
          color: 'theme.text.light',
          paddingInline: 'theme.spacing.lg',
          paddingBlock: 'theme.spacing.sm',
          textAlign: 'center',
          children: Center({
            children: Column({
              children: [
                Text('© 2025 Dashboard Daily Monitoring.', {
                  opacity: 0.7,
                  fontSize: '0.9rem',
                  margin: 0,
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  }).render()
}
