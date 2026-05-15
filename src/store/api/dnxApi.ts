import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { AUTH_ACCESS_TOKEN_STORAGE_KEY } from '@/constants/auth-storage'
import { API_BASE_URL } from '@/utils/api-base'
import { getFromLocalStorage } from '@/utils/local-storage'

/**
 * Root RTK Query API for the DNX dashboard. Add feature slices with `injectEndpoints`.
 */
export const dnxApi = createApi({
  reducerPath: 'dnxApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getFromLocalStorage(AUTH_ACCESS_TOKEN_STORAGE_KEY)
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Users', 'SupportTickets', 'rules', 'User'],
  endpoints: () => ({}),
})
