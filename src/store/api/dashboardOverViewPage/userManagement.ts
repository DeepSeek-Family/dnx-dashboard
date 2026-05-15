import { dnxApi } from '../dnxApi'

export type ManagedUserProfile = {
  name: string
  email: string
  profile: string
  gender: string
  age: number
  weight: number
  createdAt: string
  verified: boolean
  role: string
  nickName: string
  isBanned: boolean
  isDeleted: boolean
  isResetPassword: boolean
  oneTimeCode: number
  expireAt: string
}



export const userManagementApi = dnxApi.injectEndpoints({
  endpoints: (build) => ({
    getUserManagement: build.query({
      query: (params) => ({
        url: '/user-management/all-users',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),

    getSingleUser: build.query<ManagedUserProfile, string>({
      query: (id) => ({
        url: `/user-management/user/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    banUser: build.mutation({
      query: ({ id, isBanned }: { id: string; isBanned: boolean }) => ({
        url: `/user-management/user/${id}/ban`,
        method: 'PATCH',
        body: {
          isBanned,
        },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const { useGetUserManagementQuery, useGetSingleUserQuery, useBanUserMutation } =
  userManagementApi
