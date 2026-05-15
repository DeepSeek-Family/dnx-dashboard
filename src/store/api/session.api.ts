import { dnxApi } from "./dnxApi";

const sessionApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        getSession: build.query({
            query: ({ page = 1, limit = 20 }) => ({
                url: "/dnx-biomechanic-metrics",
                method: "GET",
                params: {
                    page,
                    limit,
                },
            }),
        }),
    }),
});

export const { useGetSessionQuery } = sessionApi;