import useGetToken from '@src/redux/hook/useGetToken.ts'
import { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router'
import { Node } from '@meonode/ui'

export default function AuthWrapper() {
  const token = useGetToken()
  const location = useLocation()
  const navigate = useNavigate()

  const insecurePaths = ['/login']

  useEffect(() => {
    if (!token && !insecurePaths.includes(location.pathname)) {
      navigate('/login', { replace: true })
    } else if (!!token && insecurePaths.includes(location.pathname)) {
      navigate('/', { replace: true })
    }
  }, [token])

  if (!token && !insecurePaths.includes(location.pathname)) return null

  return Node(Outlet).render()
}
