import { Button, IconButton, Tooltip, Typography } from '@meonode/mui'
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
import { useState } from 'react'
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
  console.log(payor)

  const { data: _data } = useGetDailyMonitoringQuery(
    {
      payload: {
        payor_code: 'ADMEDKA',
        start_date: dayjs().format('YYYY-MM-DD'),
        end_date: dayjs().add(1, 'w').format('YYYY-MM-DD'),
      },
    },
    { skip: !token },
  )

  const data = {
    code: 200,
    status: 'Success',
    message: 'Berhasil mendapatkan data',
    data: [
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'HSCPX_IND',
          PolicyNo: 'POLIC1234',
          ClaimID: '28638299',
          MemberID: '9090904-1',
          MemberName: 'DUMMY AGENT 4 D',
          CardNo: '8001001000019087',
          NIK: '',
          PD: 'D',
          ClaimType: 'M',
          ClaimStatus: '08',
          ProviderID: '0101',
          ProviderName: 'SILOAM HOSPITALS KEBON JERUK',
          AdmissionDate: '2024-12-05',
          DischargeDate: '',
          Days: '0',
          ICDX: '',
          ICDXDesc: '',
          CoverageID: 'H&S',
          PlanID: 'HS-1203',
          DisabilityNo: '',
          AmtInccured: '0',
          AmtApproved: '0',
          AmtNotApproved: '0',
          AmtAsoApproved: '0',
          Remarks: 'DUMMY-',
        },
        detail: null,
      },
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'HSRP_IND',
          PolicyNo: 'O602',
          ClaimID: '28638323',
          MemberID: '000059950177',
          MemberName: 'IRENE SOTERIANI UREN',
          CardNo: '8000210106923871',
          NIK: '',
          PD: 'P',
          ClaimType: 'M',
          ClaimStatus: '40',
          ProviderID: '1066',
          ProviderName: 'MRCCC-SILOAM HOSPITALS SEMANGGI SPECIALIST C',
          AdmissionDate: '2024-12-07',
          DischargeDate: '2024-12-07',
          Days: '1',
          ICDX: 'A01',
          ICDXDesc: 'TYPHOID AND PARATYPHOID FEVERS',
          CoverageID: 'H&S',
          PlanID: 'D1',
          DisabilityNo: '',
          AmtInccured: '11000',
          AmtApproved: '11000',
          AmtNotApproved: '0',
          AmtAsoApproved: '0',
          Remarks: 'TEST DATA.',
        },
        detail: null,
      },
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'HSCPX_IND',
          PolicyNo: 'POLIC1234',
          ClaimID: '28638272',
          MemberID: '9090903',
          MemberName: 'DUMMY AGENT 3',
          CardNo: '8000210106923723',
          NIK: '',
          PD: 'D',
          ClaimType: 'M',
          ClaimStatus: '21',
          ProviderID: '0101',
          ProviderName: 'SILOAM HOSPITALS KEBON JERUK',
          AdmissionDate: '2024-12-04',
          DischargeDate: '2024-12-04',
          Days: '1',
          ICDX: 'A01',
          ICDXDesc: 'TYPHOID AND PARATYPHOID FEVERS',
          CoverageID: 'H&S',
          PlanID: 'HS-1203',
          DisabilityNo: '',
          AmtInccured: '0',
          AmtApproved: '0',
          AmtNotApproved: '0',
          AmtAsoApproved: '0',
          Remarks: 'DUMMY 1',
        },
        detail: null,
      },
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'HCP_WOORI',
          PolicyNo: 'Q462',
          ClaimID: '28638310',
          MemberID: '077000001184',
          MemberName: 'CAROLUS BOROMEUS SUGIHARTO',
          CardNo: '8000210106923822',
          NIK: '',
          PD: 'P',
          ClaimType: 'M',
          ClaimStatus: '40',
          ProviderID: '0600',
          ProviderName: 'RS. ST. CAROLUS',
          AdmissionDate: '2024-12-06',
          DischargeDate: '2024-12-09',
          Days: '3',
          ICDX: 'F41',
          ICDXDesc: 'Other anxiety disorders',
          CoverageID: 'H&S',
          PlanID: 'PLAN A-IDR',
          DisabilityNo: '28638310',
          AmtInccured: '35000000',
          AmtApproved: '3000000',
          AmtNotApproved: '32000000',
          AmtAsoApproved: '0',
          Remarks:
            'Total biaya diajukan : Rp35.000.000 Total biaya yang disetujui: Rp.3.000.000 Total biaya yang tidak disetujui: Rp.32.000.000 (terdiri overlimit biaya) menjadi tanggungan peserta yang harus diselesaikan di RS.\r\nPenjaminan biaya rawat inap untuk diagnosa Schizophreni dapat diberikan,Informasi biaya rawat inap ini bersifat sementara, dan dapat berubah sesuai tagihan akhir dari RS.Khusus Peserta COB BPJS, wajib melampirkan surat rujukan faskes pertama dan Surat Eligibilitas Peserta (SEP),NOTE: Sebagai syarat pembayaran tagihan klaim agar dilengkapi kelengkapan dokumen saat pengiriman tagihan. Dokumen yang di lengkapi sbb: Surat penyataan, Laporan medis awal dan medis lanjutan (PEC, Medis harian, Medis indikasi, Medis konsul, hasil pemeriksaan penunjang) Jika tidak dilengkapi saat proses penagihan klaim akan kami kembalikan ke RS..',
        },
        detail: null,
      },
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'HCP_WOORI',
          PolicyNo: 'Q462',
          ClaimID: '28638308',
          MemberID: '077000001179',
          MemberName: 'MELA SUSILOWATI',
          CardNo: '8000210106923830',
          NIK: '',
          PD: 'P',
          ClaimType: 'M',
          ClaimStatus: '40',
          ProviderID: '1479',
          ProviderName: 'RS PONDOK INDAH PURI INDAH',
          AdmissionDate: '2024-12-06',
          DischargeDate: '2024-12-09',
          Days: '4',
          ICDX: 'S52.0',
          ICDXDesc: 'Fracture of upper end of ulna',
          CoverageID: 'H&S',
          PlanID: 'PLAN A-IDR',
          DisabilityNo: '28638308',
          AmtInccured: '45000000',
          AmtApproved: '3000000',
          AmtNotApproved: '42000000',
          AmtAsoApproved: '0',
          Remarks:
            'Total biaya diajukan : Rp45.000.000 Total biaya yang disetujui: Rp.3.000.000 Total biaya yang tidak disetujui: Rp.42.000.000 (terdiri overlimit biaya) menjadi tanggungan peserta yang harus diselesaikan di RS.\r\nPenjaminan biaya rawat inap untuk diagnosa Schizophreni dapat diberikan,Informasi biaya rawat inap ini bersifat sementara, dan dapat berubah sesuai tagihan akhir dari RS.Khusus Peserta COB BPJS, wajib melampirkan surat rujukan faskes pertama dan Surat Eligibilitas Peserta (SEP),NOTE: Sebagai syarat pembayaran tagihan klaim agar dilengkapi kelengkapan dokumen saat pengiriman tagihan. Dokumen yang di lengkapi sbb: Surat penyataan, Laporan medis awal dan medis lanjutan (PEC, Medis harian, Medis indikasi, Medis konsul, hasil pemeriksaan penunjang) Jika tidak dilengkapi saat proses penagihan klaim akan kami kembalikan ke RS..',
        },
        detail: null,
      },
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'HSCPX_IND',
          PolicyNo: 'POLIC123',
          ClaimID: '28638271',
          MemberID: '9090901',
          MemberName: 'DUMMY AGENT 1',
          CardNo: '8000210106923707',
          NIK: '',
          PD: 'D',
          ClaimType: 'M',
          ClaimStatus: '21',
          ProviderID: '0797',
          ProviderName: 'RS. MEDISTRA',
          AdmissionDate: '2024-12-04',
          DischargeDate: '2024-12-04',
          Days: '1',
          ICDX: 'J00',
          ICDXDesc: 'Acute Nasopharyngitis (common cold)',
          CoverageID: 'H&S',
          PlanID: 'HS-1203',
          DisabilityNo: '',
          AmtInccured: '0',
          AmtApproved: '0',
          AmtNotApproved: '0',
          AmtAsoApproved: '0',
          Remarks: 'DUMMY 1',
        },
        detail: null,
      },
      {
        header: {
          PayorID: 'ALLIANZ',
          CorporateID: 'IDMBUKALPK',
          PolicyNo: 'QD60',
          ClaimID: '28638309',
          MemberID: '013020000003041',
          MemberName: 'AGUS BUNARDY',
          CardNo: '8000210106923749',
          NIK: '',
          PD: 'P',
          ClaimType: 'M',
          ClaimStatus: '40',
          ProviderID: '1066',
          ProviderName: 'MRCCC-SILOAM HOSPITALS SEMANGGI SPECIALIST C',
          AdmissionDate: '2024-12-06',
          DischargeDate: '2024-12-09',
          Days: '3',
          ICDX: 'A09',
          ICDXDesc: 'Other gastroenteritis and colitis of infectious and unspecified origin',
          CoverageID: 'H&S',
          PlanID: 'IDM-200-NB',
          DisabilityNo: '28638309',
          AmtInccured: '38000000',
          AmtApproved: '5230000',
          AmtNotApproved: '32770000',
          AmtAsoApproved: '0',
          Remarks:
            'Total biaya diajukan : Rp38.000.000 Total biaya yang disetujui: Rp.5.230.000 Total biaya yang tidak disetujui: Rp.32.770.000 (terdiri dari innerlimit kamar,dokter,kamar) menjadi tanggungan peserta yang harus diselesaikan di RS.\r\nPenjaminan biaya rawat inap untuk diagnosa GEA dapat diberikan,Informasi biaya rawat inap ini bersifat sementara, dan dapat berubah sesuai tagihan akhir dari RS.Khusus Peserta COB BPJS, wajib melampirkan surat rujukan faskes pertama dan Surat Eligibilitas Peserta (SEP),NOTE: Sebagai syarat pembayaran tagihan klaim agar dilengkapi kelengkapan dokumen saat pengiriman tagihan. Dokumen yang di lengkapi sbb: Surat penyataan, Laporan medis awal dan medis lanjutan (PEC, Medis harian, Medis indikasi, Medis konsul, hasil pemeriksaan penunjang) Jika tidak dilengkapi saat proses penagihan klaim akan kami kembalikan ke RS.\r\n.',
        },
        detail: null,
      },
    ],
  } as const

  const startDate = dayjs().subtract(1, 'w').format('YYYY-MM-DD')
  const endDate = dayjs().format('YYYY-MM-DD')

  console.log(data)

  const totalPasien =
    data?.data?.reduce((acc, curr) => {
      const cardNo = curr?.header?.CardNo
      if (cardNo && !acc.includes(cardNo)) acc.push(cardNo)
      return acc
    }, [] as string[])?.length || 0

  const totalProvider =
    data?.data?.reduce((acc, curr) => {
      const ProviderID = curr?.header?.ProviderID
      if (ProviderID && !acc.includes(ProviderID)) acc.push(ProviderID)
      return acc
    }, [] as string[])?.length || 0

  const totalAdmission =
    data?.data?.reduce((acc, curr) => {
      const AdmissionDate = curr?.header?.CardNo
      if (AdmissionDate && !acc.includes(AdmissionDate)) acc.push(AdmissionDate)
      return acc
    }, [] as string[])?.length || 0

  const totalDischarge =
    data?.data?.reduce((acc, curr) => {
      const DischargeDate = curr?.header?.DischargeDate
      if (DischargeDate && !acc.includes(DischargeDate)) acc.push(DischargeDate)
      return acc
    }, [] as string[])?.length || 0

  console.log({
    totalPasien,
    totalProvider,
    totalAdmission,
    totalDischarge,
  })

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
      label: 'Total Pasien',
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
      label: 'Total Admision',
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
    data.data.reduce(
      (acc, item) => {
        const key = item.header.ICDXDesc || '-'
        if (!acc[key]) acc[key] = 0
        acc[key] += 1
        return acc
      },
      {} as { icdxDesc: string; total: number },
    ),
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(deleteToken())
    navigate('/login')
  }

  return Root({
    backgroundColor: 'theme.base',
    color: 'theme.base.content',
    maxHeight: '100dvh',
    children: Column({
      flex: 1,
      gap: 'theme.spacing.md',
      children: [
        Row({
          padding: 'theme.spacing.md',
          gap: 'theme.spacing.sm',
          children: [
            Span('Daily Monitoring', { fontSize: 'theme.text.3xl', fontWeight: 'bold' }),
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
                        sx: buttonTextSX.primary,
                        gap: 'theme.spacing.sm',
                        onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
                        children: Node(theme.mode === 'light' ? DarkMode : LightMode),
                      }),
                      Node(AccountCircle),
                      Text('DBS'),
                      Button({
                        sx: buttonTextSX.danger,
                        onClick: handleLogout,
                        startIcon: Node(LogoutRounded).render(),
                        children: 'Logout',
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
          gap: 'theme.spacing.md',
          children: [
            Row({
              flex: 1,
              flexShrink: 0,
              children: [
                Row({
                  flexBasis: '60%',
                  gap: 20,
                  paddingInline: 'theme.spacing.md',
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
                  gap: 'theme.spacing.sm',
                  maxHeight: 300,
                  flexBasis: '40%',
                  overflow: 'hidden',
                  padding: 'theme.spacing.md',
                  marginInline: 'theme.spacing.md',
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
                                  children: 'Total Pentient',
                                  padding: 'theme.spacing.sm',
                                  style: { width: 'auto', whiteSpace: 'nowrap' },
                                }),
                              ],
                            }),
                          }),
                          Tbody({
                            children: headerData.map(([icdxDesc, total]) =>
                              Tr({
                                children: [
                                  Td({ children: icdxDesc }),
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
              paddingBlock: 'theme.spacing.sm',
              paddingInline: 'theme.spacing.md',
              gap: 'theme.spacing.sm',
              children: [
                Row({
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  children: [
                    Row({
                      flex: 1,
                      //placeContent: 'center',
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
                          children: 'List Member',
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
                  backgroundColor: 'theme.secondary',
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
                        children: data.data.map((item, index) =>
                          Tr({
                            key: index,
                            children: [
                              Td({ children: item.header.MemberID || '-', textAlign: 'center' }),

                              Td({
                                children: item.header.MemberName || '-',
                              }),
                              Td({
                                children: item.header.ClaimStatus || '-',
                                textAlign: 'center',
                              }),
                              Td({
                                children: item.header.ProviderName || '-',
                                textAlign: 'center',
                              }),
                              Td({
                                children: dayjs(item.header.AdmissionDate, 'YYYY-MM-DD').format('DD MMMM YYYY') || '-',
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
          padding: 'theme.spacing.xs',
          textAlign: 'center',
          children: Center({
            children: Column({
              maxWidth: '800px',
              children: [
                Text('© 2025 Dashboard Daily Monitoring.', {
                  opacity: 0.7,
                  fontSize: '0.9rem',
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  }).render()
}
