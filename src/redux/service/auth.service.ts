import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API } from '@src/constants/urls.const.ts'
import type { AuthData, AuthPayload } from '@src/redux/type/auth.type.ts'
import type { ResponseData } from '@src/redux/type/base.type.ts'

const authServiceApi = createApi({
  reducerPath: 'AUTH_API',
  baseQuery: fetchBaseQuery({ baseUrl: API }),
  tagTypes: [],
  endpoints: build => ({
    login: build.mutation<ResponseData<AuthData>, { payload: AuthPayload }>({
      query: ({ payload }) => ({
        url: 'login',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
})

export const { useLoginMutation } = authServiceApi
export default authServiceApi
