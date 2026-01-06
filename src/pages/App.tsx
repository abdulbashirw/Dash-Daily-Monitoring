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
  DynamicForm,
  GppBadOutlined,
} from '@mui/icons-material'
import { buttonTextSX } from '@src/constants/button.const'
import darkTheme from '@src/constants/themes/darkTheme'
import lightTheme from '@src/constants/themes/lightTheme'
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
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'

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


const RollingDigit = ({ digit, delay }: { digit: string; delay: number }) => {
  const [target, setTarget] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isNaN(parseInt(digit))) {
        setTarget(parseInt(digit))
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [digit])

  if (isNaN(parseInt(digit))) {
    return <span style={{ display: 'inline-block' }}>{digit}</span>
  }

  return (
    <div
      style={{
        display: 'inline-block',
        height: '1em',
        overflow: 'hidden',
        lineHeight: '1',
        position: 'relative',
      }}
    >
      <div
        style={{
          transition: `transform 2s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
          transform: `translateY(-${target * 10}%)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <span
            key={num}
            style={{
              height: '1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  )
}

const RollingCounter = ({ value }: { value: string | number }) => {
  const digits = value.toString().split('')

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {digits.map((digit, index) => (
        <RollingDigit key={index} digit={digit} delay={index * 0.1} />
      ))}
    </div>
  )
}


export default function App() {
  const { theme, setTheme } = useTheme()
  const token = useGetToken()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const summaryRef = useRef<HTMLDivElement | null>(null)
  const [diagnosticTableHeight, setDiagnosticTableHeight] = useState<number>()
  const tableContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (tableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          tableContainerRef.current.scrollBy({ top: 50, behavior: 'smooth' })
        }
      }
    }, 5000)

    return () => clearInterval(scrollInterval)
  }, [])

  const patientTableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (patientTableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = patientTableRef.current
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          patientTableRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          patientTableRef.current.scrollBy({ top: 50, behavior: 'smooth' })
        }
      }
    }, 8000)

    return () => clearInterval(scrollInterval)
  }, [])

  // States
  const [isMainTableFullscreen, setIsMainTableFullscreen] = useState(false)

  const payor = parseJwt(token)
  //const startDate = dayjs().subtract(1, 'w').format('YYYY-MM-DD')
  //const endDate = dayjs().format('YYYY-MM-DD')
  //const datatime = dayjs().format('YYYY-MM-DD HH:mm')

  const [currentTime, setCurrentTime] = useState(dayjs())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const {
    data: responseData,
    //data: { data } = { data: undefined },
    refetch,
    isError,
    isSuccess,
  } = useGetDailyMonitoringQuery(
    {
      payload: {
        payor_code: payor.payor_code,
        start_date: '',
        end_date: '',
        //start_date: '2025-01-01',
        //end_date: '2025-01-31',
      },
    },
    { skip: !token },
  )

  const data = Array.isArray(responseData?.data) ? responseData?.data : []


  // Claim Status
  const dataClaimStatus = data?.map(item => item?.header?.ClaimStatus) || []

  const totalDHC = dataClaimStatus.filter(item => item === 'DHC').length // Total Pasien Discharge
 
  const totalDMO = dataClaimStatus.filter(item => item === 'DMO').length // Total Pasien Monitoring

  const totalReject = dataClaimStatus.filter(item => item !== 'DMO' && item !== 'DHC').length // Total Pasien Reject

  const totalProviderDHC = new Set(
    data
      ?.map(item => item?.header?.ProviderID)
      ?.filter(Boolean),
  ).size

  // Admission
  const dataAdmission = data?.map(item => item?.header?.AdmissionDate) || []

  const totalAdmissionValid = dataAdmission.filter(Boolean).length || 0 // Total Pasien Admission

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
      value: totalDMO.toString(),
      label: 'Monitoring Pasien',
      icon: PersonalInjuryOutlined,
      gradientStart: '#11998e', // Hijau Tua
      gradientEnd: '#38ef7d',
    },
    {
      id: 'C2',
      label: 'Total Provider',
      value: totalProviderDHC.toString(),
      icon: AssignmentAdd,
      gradientStart: '#0072ff', // Biru Tua
      gradientEnd: '#00c6ff', // Biru Muda
    },
    {
      id: 'C3',
      label: 'Total Admission',
      value: totalAdmissionValid.toString(),
      icon: LocalPharmacyOutlined,
      gradientStart: '#0072ff', // Biru Tua
      gradientEnd: '#00c6ff', // Biru Muda
    },
    {
      id: 'C4',
      label: 'Total Discharge',
      value: totalDHC.toString(),
      icon: Settings,
      gradientStart: '#ff4b1f', // Merah Oranye
      gradientEnd: '#ff9068',
    },
    {
      id: 'C5',
      label: 'Total Rejected',
      value: totalReject.toString(),
      icon: GppBadOutlined,
      gradientStart: '#c0392b', // Merah Tua (Deep Red)
      gradientEnd: '#e74c3c', // Merah Cerah (Bright Red)
    },
  ]

  const headerData = Object.entries(
    data?.reduce(
      (acc, item) => {
        const key = item.header?.ICDXDesc || '-'
        if (!acc[key]) acc[key] = 0
        acc[key] += 1
        return acc
      },
      {} as Record<string, number>,
    ) || {},
  )
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(deleteToken())
    dispatch({ type: 'RESET' })
    navigate('/login')
  }

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(async () => {
        try {
          await refetch()
        } catch (err) {
          console.error('Refetch failed:', err)
        }
      }, 600000) // 600000 ms = 10 menit
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [refetch])

  useEffect(() => {
    if ((isError || isSuccess) && !data) {
      enqueueSnackbar('Gagal Memuat Data', {
        variant: 'warning',
      })
    }
  }, [isError, isSuccess])

  useEffect(() => {
    if (summaryRef.current) {
      setDiagnosticTableHeight(summaryRef.current.getBoundingClientRect().height)
    }
  }, [summaryRef.current])

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
          alignItems: 'center',
          flexWrap: 'wrap',
          children: [
            Span('Daily Monitoring', {
              fontSize: 'theme.text.3xl',
              fontWeight: '800',
              animation: 'breath',
            }),
            Span('(30 days)', {
              fontSize: 'theme.text.lg',
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
              gap: 'theme.spacing.md',
              children: [
                Row({
                  ref: summaryRef,
                  flexBasis: '60%',
                  gap: 20,
                  children: [
                    Column({
                      flex: 1,
                      gap: 'theme.spacing.md',
                      children: [
                        Column({
                          flex: 1,
                          padding: 'theme.spacing.md',
                          gap: 'theme.spacing.sm',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                          children: [
                            Row({
                              alignItems: 'center',
                              gap: 'theme.spacing.md',
                              children: [
                                Img({
                                  src: LogoImage,
                                  alt: 'MeoNode Logo',
                                  objectFit: 'contain',
                                  flex: 1,
                                  width: '100%',
                                }),
                              ],
                            }),
                            Span(`Last Update: ${currentTime.format('DD-MM-YYYY | HH:mm:ss')}`, {
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
                                Span(cards[0].label, {
                                  flex: 1,
                                  fontSize: 'theme.text.2xl',
                                  lineHeight: 'theme.text.2xl',
                                  fontWeight: 'bold',
                                }),
                              ],
                            }),
                            Span(
                              // cards[0].value,
                              <RollingCounter value={cards[0].value} />,
                              {
                                marginInlineStart: 'auto',
                                marginBlockStart: 'auto',
                                marginInlineEnd: 'theme.spacing.md',
                                fontSize: 'theme.text.5xl',
                                fontWeight: 'bold',
                              },
                            ),
                          ],
                        }),
                      ],
                    }),
                    Column({
                      flex: 1,
                      flexShrink: 0,
                      gap: 'theme.spacing.md',
                      children: [
                        Column({
                          flex: 1,
                          flexShrink: 0,
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
                                Span(cards[2].label, {
                                  flex: 1,
                                  fontSize: 'theme.text.2xl',
                                  lineHeight: 'theme.text.2xl',
                                  fontWeight: 'bold',
                                }),
                              ],
                            }),
                            Span(
                              <RollingCounter value={cards[2].value} />,
                              {
                                marginInlineStart: 'auto',
                                marginBlockStart: 'auto',
                                marginInlineEnd: 'theme.spacing.md',
                                fontSize: 'theme.text.5xl',
                                fontWeight: 'bold',
                              },
                            ),
                          ],
                        }),
                        Column({
                          flex: 1,
                          flexShrink: 0,
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
                                  fontSize: 'theme.text.2xl',
                                  lineHeight: 'theme.text.2xl',
                                  fontWeight: 'bold',
                                }),
                              ],
                            }),
                            Span(
                              <RollingCounter value={cards[3].value} />,
                              {
                                marginInlineStart: 'auto',
                                marginBlockStart: 'auto',
                                marginInlineEnd: 'theme.spacing.md',
                                fontSize: 'theme.text.5xl',
                                fontWeight: 'bold',
                              },
                            ),
                          ],
                        }),
                      ],
                    }),
                    Column({
                      flex: 1,
                      flexShrink: 0,
                      gap: 'theme.spacing.md',
                      children: [
                        Column({
                          flex: 1,
                          flexShrink: 0,
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
                                Node(cards[1].icon, { fontSize: 'theme.text.5xl' }),
                                Span(cards[1].label, {
                                  flex: 1,
                                  fontSize: 'theme.text.2xl',
                                  lineHeight: 'theme.text.2xl',
                                  fontWeight: 'bold',
                                }),
                              ],
                            }),
                            Span(
                              <RollingCounter value={cards[1].value} />,
                              {
                                marginInlineStart: 'auto',
                                marginBlockStart: 'auto',
                                marginInlineEnd: 'theme.spacing.md',
                                fontSize: 'theme.text.5xl',
                                fontWeight: 'bold',
                              },
                            ),
                          ],
                        }),
                        Column({
                          flex: 1,
                          flexShrink: 0,
                          padding: 'theme.spacing.md',
                          gap: 'theme.spacing.sm',
                          borderRadius: 'theme.radius.lg',
                          background: `linear-gradient(135deg, ${cards[4  ].gradientStart} 0%, ${cards[4].gradientEnd} 100%)`,
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
                            Node(cards[4].icon, {
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
                                Node(cards[4].icon, { fontSize: 'theme.text.5xl' }),
                                Span(cards[4].label, {
                                  flex: 1,
                                  fontSize: 'theme.text.2xl',
                                  lineHeight: 'theme.text.2xl',
                                  fontWeight: 'bold',
                                }),
                              ],
                            }),
                            Span(
                              <RollingCounter value={cards[4].value} />,
                              {
                                marginInlineStart: 'auto',
                                marginBlockStart: 'auto',
                                marginInlineEnd: 'theme.spacing.md',
                                fontSize: 'theme.text.5xl',
                                fontWeight: 'bold',
                              },
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                Column({
                  maxHeight: diagnosticTableHeight,
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
                      ref: tableContainerRef,
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
                            fontSize: 14,
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
                                zIndex: -1,
                              },
                            },
                            '& th:first-child': {
                              borderTopLeftRadius: 'theme.radius.md',
                              boxShadow: 'inset 2px 0 0 rgba(255,255,255,0.1)', // sedikit cahaya di sisi kiri
                            },
                            '& th:last-child': {
                              borderTopRightRadius: 'theme.radius.md',
                              boxShadow: 'inset -2px 0 0 rgba(255,255,255,0.1)', // cahaya halus di sisi kanan
                            },
                          },
                        },
                        children: [
                          Thead({
                            fontWeight: 'bold',
                            fontSize: 16,
                            children: Tr({
                              children: [
                                Th({
                                  children: 'Diagnosa',
                                  padding: 'theme.spacing.sm',
                                  style: { width: '100%' },
                                }),
                                Th({
                                  children: 'Total Pasien',
                                  padding: 'theme.spacing.sm',
                                  style: { width: 'auto', whiteSpace: 'nowrap' },
                                }),
                              ],
                            }),
                          }),
                          Tbody({
                            children: headerData
                              // 1. Filter ICDX kosong atau '-'
                              .filter(([ICDXDesc]) => ICDXDesc && ICDXDesc.trim() !== '' && ICDXDesc !== '-')

                              // 2. Urutkan berdasarkan total dari terbesar ke terkecil
                              .sort((a, b) => b[1] - a[1])

                              // 3. Render tabel
                              .map(([ICDXDesc, total]) =>
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
                          children: 'Pasien List',
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
                  ref: patientTableRef,
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
                        borderBottom: '1px solid',
                        borderColor: 'theme.secondary',
                        padding: '12px 16px',
                        backgroundColor: 'theme.base',
                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'theme.text.secondary',
                      },
                      '& tbody tr:hover td': {
                        backgroundColor: 'theme.neutral.hover',
                        color: 'theme.text.primary',
                      },
                      '& tbody td:nth-of-type(2)': {
                        fontWeight: 600,
                        color: 'theme.text.primary',
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
                        fontSize: 14,
                        children: Tr({
                          children: [
                            Th({
                              children: 'NPP',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Nama Pasien',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Principle/Dependent',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Nama Provider',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Tanggal Masuk',
                              padding: 'theme.spacing.sm',
                            }),
                            Th({
                              children: 'Lama Ranap',
                              padding: 'theme.spacing.sm',
                            }),
                          ],
                        }),
                      }),
                      Tbody({
                        children: data
                          ?.slice()
                          ?.filter(item => item?.header?.ClaimStatus === 'DMO')
                          ?.sort((a, b) => {
                            const daysA = a.header.Days || 0
                            const daysB = b.header.Days || 0
                            return daysB - daysA
                          })
                          ?.map((item, index) =>
                            Tr({
                              key: index,
                              children: [
                                Td({ children: item.header.MemberID || '-', textAlign: 'center' }),

                                Td({
                                  children: item.header.MemberName || '-',
                                }),
                                Td({
                                  children:
                                    item.header.PD === 'P' ? 'Principle' : item.header.PD === 'D' ? 'Dependent' : '-',
                                  textAlign: 'center',
                                }),
                                Td({
                                  children: item.header.ProviderName || '-',
                                  textAlign: 'center',
                                }),
                                Td({
                                  children:
                                    dayjs(item.header.AdmissionDate, 'YYYY-MM-DD').format('DD MMMM YYYY') || '-',
                                  textAlign: 'center',
                                }),
                                Td({
                                  children: item.header.Days || '-',
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
