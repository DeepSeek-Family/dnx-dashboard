export type SupportTicketStatus = 'PENDING' | 'RESOLVED' | 'CLOSED'

export interface ISupport {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  image: string
  status: SupportTicketStatus
  createdAt: string
  updatedAt: string
}
