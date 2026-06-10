import { dnxApi } from '../dnxApi'

export type ManagedUser = {
  id: string
  name: string
  email: string
  gender: string
  age: number
  weight: number
  createdAt: string
  verified: boolean
  role: string
  nickName: string
  isBanned: boolean
}

export type ManagedUserProfile = ManagedUser & {
  profile: string
  isDeleted: boolean
  isResetPassword: boolean
  oneTimeCode: number
  expireAt: string
}

export type UserManagementListParams = {
  page?: number
  limit?: number
  searchTerm?: string
}

export type UserManagementListResponse = {
  data: ManagedUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

export const userManagementApi = dnxApi.injectEndpoints({
  endpoints: (build) => ({
    getUserManagement: build.query<
      UserManagementListResponse,
      UserManagementListParams
    >({
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

export const {
  useGetUserManagementQuery,
  useLazyGetUserManagementQuery,
  useGetSingleUserQuery,
  useBanUserMutation,
} = userManagementApi
