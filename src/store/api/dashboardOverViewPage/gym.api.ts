import { dnxApi } from "../dnxApi";

const gymApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        getGyms: build.query({
            query: () => {
                return {
                    url: '/gyms/admin',
                    method: 'GET',
                }
            }

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


export const { useGetGymsQuery, useUpdateGymMutation, useDeleteGymMutation, useAddGymMutation } = gymApi