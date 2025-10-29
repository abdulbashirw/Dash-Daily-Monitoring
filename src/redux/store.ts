import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import appSlice from '@src/redux/slice/app.slice.ts'
import dailyMonitoringServiceApi from '@src/redux/service/daily-monitoring.service.ts'
import authServiceApi from '@src/redux/service/auth.service.ts'
import authSlice from '@src/redux/slice/auth.slice.ts'

export const store = configureStore({
  reducer: {
    appReducer: appSlice,
    authReducer: authSlice,
    [dailyMonitoringServiceApi.reducerPath]: dailyMonitoringServiceApi.reducer,
    [authServiceApi.reducerPath]: authServiceApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(dailyMonitoringServiceApi.middleware, authServiceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
