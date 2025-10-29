import { StrictMode, useEffect, useMemo, useState } from 'react'
import { store } from '@src/redux/store'
import { type Children, Container, Node, type NodeElement, type Theme } from '@meonode/ui'
import { Provider as ReduxProvider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import lightTheme from '@src/constants/themes/lightTheme.ts'
import darkTheme from '@src/constants/themes/darkTheme.ts'
import { ThemeProvider as MeoThemeProvider } from '@meonode/ui'
import { CssBaseline } from '@meonode/mui'

interface WrappersProps {
  children: NodeElement
}

const ThemeWrapper = ({ children }: { children?: Children }) => {
  const initialTheme = useMemo<Theme>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('theme')
    return stored === 'dark' ? darkTheme : lightTheme
  }, [])

  return MeoThemeProvider({ theme: initialTheme, children }).render()
}

export const Wrapper = ({ children }: WrappersProps) =>
  Node(ReduxProvider, {
    store,
    children: Node(ThemeWrapper, {
      children: Node(SnackbarProvider, {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        children: [
          CssBaseline(),
          Container({
            children,
          }),
        ],
      }),
    }),
  })

const PortalThemeWrapper = ({ children }: { children?: Children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('theme')
    return stored === 'dark' ? darkTheme : lightTheme
  })

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setTheme(e.newValue === 'dark' ? darkTheme : lightTheme)
      }
    }

    // Listen for changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return MeoThemeProvider({ theme, children }).render()
}

export const PortalWrappers = Node(StrictMode, {
  children: Node(ReduxProvider, { store, children: Node(PortalThemeWrapper) }),
})
