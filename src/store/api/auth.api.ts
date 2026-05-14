
import { dnxApi } from "./dnxApi";

const authApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const { useLoginMutation } = authApi