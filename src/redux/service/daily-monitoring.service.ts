import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NAHSEHAT_API_V3 } from '@src/constants/urls.const.ts'
import type { DailyMonitoringData, DailyMonitoringPayload } from '@src/redux/type/daily-monitoring.type.ts'

const dailyMonitoringServiceApi = createApi({
  reducerPath: 'DAILY_MONITORING_API',
  baseQuery: fetchBaseQuery({ baseUrl: NAHSEHAT_API_V3 }),
  tagTypes: [],
  endpoints: build => ({
    getDailyMonitoring: build.query<
      { data: DailyMonitoringData[] },
      { /*token: string;*/ payload: DailyMonitoringPayload }
    >({
      query: ({ /*token,*/ payload }) => ({
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        url: 'dailyMonitoring',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
})

export const { useGetDailyMonitoringQuery } = dailyMonitoringServiceApi
export default dailyMonitoringServiceApi
