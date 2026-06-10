import type { IGym } from '@/types/gymTypes'

import { dnxApi } from '../dnxApi'

export type GymListParams = {
  page?: number
  limit?: number
  searchTerm?: string
}

export type GymListResponse = {
  data: IGym[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

const gymApi = dnxApi.injectEndpoints({
  endpoints: (build) => ({
    getGyms: build.query<GymListResponse, GymListParams>({
      query: (params) => {
        return {
          url: '/gyms/admin',
          method: 'GET',
          params,
        }
      },
    }),
    updateGym: build.mutation({
      query: (gym) => ({
        url: `/gym-management/update/${gym.id}`,
        method: 'PATCH',
        body: gym,
      }),
    }),
    deleteGym: build.mutation({
      query: (id) => ({
        url: `/gym-management/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    addGym: build.mutation({
      query: (gym) => ({
        url: '/gyms',
        method: 'POST',
        body: gym,
      }),
    }),
  }),
})

export const {
  useGetGymsQuery,
  useUpdateGymMutation,
  useDeleteGymMutation,
  useAddGymMutation,
} = gymApi
