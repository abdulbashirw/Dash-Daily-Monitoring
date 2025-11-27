import { type Action, combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import appSlice from '@src/redux/slice/app.slice.ts'
import dailyMonitoringServiceApi from '@src/redux/service/daily-monitoring.service.ts'
import authServiceApi from '@src/redux/service/auth.service.ts'
import authSlice from '@src/redux/slice/auth.slice.ts'

const combinedReducers = combineReducers({
  appReducer: appSlice,
  authReducer: authSlice,
  [dailyMonitoringServiceApi.reducerPath]: dailyMonitoringServiceApi.reducer,
  [authServiceApi.reducerPath]: authServiceApi.reducer,
})

export type RootState = ReturnType<typeof combinedReducers>

interface ResetAction extends Action {
  type: 'RESET'
  [key: string]: unknown
}

const rootReducer = (state: RootState | undefined, action: ResetAction): RootState => {
  if (action.type === 'RESET') {
    state = undefined
  }
  return combinedReducers(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(dailyMonitoringServiceApi.middleware, authServiceApi.middleware),
})
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
