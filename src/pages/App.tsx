import { Button, Grid } from '@meonode/mui'
import {
  Center,
  Column,
  Img,
  Node,
  Root,
  Row,
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
import { LightMode, DarkMode, AddCircleOutlined, PostAdd, ListAlt, Settings } from '@mui/icons-material'
import { buttonSX } from '@src/constants/button.const'
import darkTheme from '@src/constants/themes/darkTheme'
import lightTheme from '@src/constants/themes/lightTheme'
import dayjs from 'dayjs'
import type { OverridableComponent } from '@mui/types'
import type { SvgIconTypeMap } from '@mui/material'
import LogoImage from '@src/assets/image/LOGO.png'

const Card: {
  id: string
  label: string
  value: string
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string
  }
}[] = [
  { id: 'C1', label: 'Total Pasien', value: '50', icon: AddCircleOutlined },
  { id: 'C2', label: 'Total Member', value: '10', icon: PostAdd },
  { id: 'C3', label: 'Total Admision', value: '25', icon: ListAlt },
  { id: 'C4', label: 'Total Recharhe', value: '45', icon: Settings },
]
export default function App() {
  const { theme, setTheme } = useTheme()

  return Root({
    backgroundColor: 'theme.base',
    color: 'theme.base.content',
    maxHeight: '100dvh',
    children: Column({
      flex: 1,
      gap: 10,
      children: [
        Column({
          flex: 1,
          padding: 'theme.spacing.md',
          children: Row({
            gap: 10,
            children: [
              Center({
                padding: 'theme.spacing.sm',
                children: Button({
                  variant: 'contained',
                  sx: buttonSX.primary,
                  onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
                  children: ['Theme', Node(theme.mode === 'light' ? DarkMode : LightMode).render()],
                }),
              }),
              Node(DarkMode),
            ],
          }),
        }),
        Center({
          padding: 'theme.spacing.sm',
          children: Button({
            variant: 'contained',
            sx: buttonSX.primary,
            onClick: () => setTheme(theme.mode === 'light' ? darkTheme : lightTheme),
            children: ['Theme', Node(theme.mode === 'light' ? DarkMode : LightMode).render()],
          }),
        }),
        Img({ src: LogoImage, alt: 'MeoNode Logo', width: 400, height: 'auto' }),
        Text(['Update:', dayjs().toString()]),
        Grid({
          props: { container: true },
          spacing: 2,
          padding: 'theme.spacing.sm',
          children: Card.map(card =>
            Grid({
              size: { xs: 12, sm: 6, md: 3 },
              children: Row({
                padding: 'theme.spacing.md',
                alignItems: 'center',
                gap: 'theme.spacing.sm',
                borderRadius: 'theme.radius.lg',
                backgroundColor: 'theme.neutral',
                color: 'theme.neutral.content',
                boxShadow: 'theme.shadow.md',
                children: [
                  Node(card.icon, { fontSize: 'theme.text.4xl' }),
                  Column({
                    gap: 'theme.spacing.sm',
                    children: [
                      Span(card.label, { fontSize: 'large', fontWeight: 'bold' }), // label dari mapping
                      Span(card.value, { fontSize: 'medium', fontWeight: 'lighter' }), // ini bisa diganti dengan value dinamis
                    ],
                  }),
                ],
              }),
            }),
          ),
        }),
        Column({
          flex: 1,
          overflow: 'hidden',
          padding: 'theme.spacing.md',
          children: Row({
            gap: 10,
            overflow: 'auto',
            children: [
              Table({
                flex: 1,
                position: 'relative',
                cellPadding: 0,
                cellSpacing: 0,
                borderCollapse: 'collapse',
                css: {
                  '& tbody td': { border: '1px solid', borderColor: 'theme.accent', padding: 'theme.spacing.sm' },
                  '& thead tr': {
                    position: 'sticky',
                    top: 0,
                    '& th': {
                      backgroundColor: 'theme.accent',
                      color: 'theme.accent.content',
                      position: 'relative',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'theme.base',
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
                        Th({ children: 'Member ID', padding: 'theme.spacing.sm' }),
                        Th({ children: 'Member Name', padding: 'theme.spacing.sm' }),
                        Th({ children: 'Member Status', padding: 'theme.spacing.sm' }),
                        Th({ children: 'Provider', padding: 'theme.spacing.sm' }),
                        Th({ children: 'Admission', padding: 'theme.spacing.sm' }),
                        Th({ children: 'Days', padding: 'theme.spacing.sm' }),
                      ],
                    }),
                  }),
                  Tbody({
                    children: Array.from({ length: 100 }).map(_ =>
                      Tr({
                        children: [
                          Td({ children: 'Test' }),
                          Td({ children: 'Test' }),
                          Td({ children: 'Test' }),
                          Td({ children: 'Test' }),
                          Td({ children: 'Test' }),
                          Td({ children: 'Test' }),
                        ],
                      }),
                    ),
                  }),
                ],
              }),
            ],
          }),
        }),
        Grid({
          marginBlockStart: 'auto',
          props: { container: true },
          spacing: 2,
          padding: 'theme.spacing.sm',
          children: Array.from({ length: 2 }).map(_ =>
            Grid({
              size: { xs: 12, sm: 6, md: 6 },
              padding: 'theme.spacing.sm',
              borderRadius: 'theme.radius.md',
              minWidth: 150,
              backgroundColor: 'theme.neutral',
              color: 'theme.neutral.content',
              children: 'Card',
            }),
          ),
        }),
        // Uncomment to test flex wrap
        // Row({
        //   padding: 'theme.spacing.sm',
        //   gap: 10,
        //   flexWrap: 'wrap',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   children: [
        //     ...Array.from({ length: 20 }).map((_, i) =>
        //       Container({
        //         flex: 1,
        //         padding: 'theme.spacing.sm',
        //         minWidth: 150,
        //         backgroundColor: 'theme.accent',
        //         color: 'theme.accent.content',
        //         children: 'Card',
        //       }),
        //     ),
        //   ],
        // }),
      ],
    }),
  }).render()
}
