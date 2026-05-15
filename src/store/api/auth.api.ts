import type { ChangePasswordRequest } from '@/types/auth'

import { dnxApi } from './dnxApi'

const authApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),

        getUser: build.query({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),


        changePassword: build.mutation<unknown, ChangePasswordRequest>({
            query: (body) => ({
                url: '/auth/change-password',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const { useLoginMutation, useGetUserQuery, useChangePasswordMutation } = authApi