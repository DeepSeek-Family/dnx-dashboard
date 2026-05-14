import { dnxApi } from "../dnxApi";

const dashboardOverviewApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        getDashboardOverview: build.query({
            query: () => {
                return {
                    url: '/dashboard/overview',
                    method: 'GET',
                }
            }
        }),
        getMOnthlyProgress: build.query({
            query: () => {
                return {
                    url: '/dashboard/monthly-activity',
                    method: 'GET',
                }
            }
        }),
    }),
})


export const { useGetDashboardOverviewQuery, useGetMOnthlyProgressQuery } = dashboardOverviewApi