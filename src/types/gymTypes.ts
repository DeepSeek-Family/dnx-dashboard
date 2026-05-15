export interface IGym {
    id: string
    gymName: string
    city: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    createdAt: string
}