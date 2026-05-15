import type { ISupport } from '@/types/supportTypes'
import { dnxApi } from '../dnxApi'

/** Query string for `GET /support` (server pagination only). */
export type SupportTicketsListParams = {
    page?: number
    limit?: number
}

export type SupportTicketsListResponse = {
    success?: boolean
    statusCode?: number
    message?: string
    data: ISupport[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPage: number
    }
}

const supportApi = dnxApi.injectEndpoints({
    endpoints: (build) => ({
        getAllSupportTickets: build.query<
            SupportTicketsListResponse,
            SupportTicketsListParams
        >({
            query: ({ page = 1, limit = 10 }) => ({
                url: '/support',
                method: 'GET',
                params: { page, limit },
            }),
            providesTags: ['SupportTickets'],
        }),

        getSupportTicketById: build.query<ISupport, string>({
            query: (id) => ({
                url: `/support/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _err, id) => [
                { type: 'SupportTickets', id },
                'SupportTickets',
            ],
        }),

        updateSupportTicket: build.mutation<
            ISupport,
            Pick<ISupport, 'id'> &
            Partial<
                Pick<ISupport, 'status' | 'subject' | 'message'>
            >
        >({
            query: (payload) => {
                const { id, ...body } = payload
                return {
                    url: `/support/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: ['SupportTickets'],
        }),
    }),
})

export const { useGetAllSupportTicketsQuery, useGetSupportTicketByIdQuery, useUpdateSupportTicketMutation } = supportApi;