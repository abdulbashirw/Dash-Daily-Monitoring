import { useAppDispatch, useAppSelector } from '@src/redux/store.ts'
import { useEffect, useMemo } from 'react'
import { setToken } from '@src/redux/slice/auth.slice.ts'

export default function useGetToken() {
  const _token = useAppSelector(state => state.authReducer.token)
  const dispatch = useAppDispatch()

  const token = useMemo(() => {
    const localToken = localStorage.getItem('token')
    return localToken || _token
  }, [_token])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('token')
      if (localToken && localToken !== _token) {
        dispatch(setToken(localToken))
      } else if (_token && !localToken) {
        localStorage.setItem('token', _token)
      }
    }
  }, [_token])

  return token
}
