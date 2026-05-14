export interface ManagedUser {
  id: string
  name: string
  email: string
  gym: string
  rank: number
  subscription: 'free' | 'pro' | 'premium'
  status: 'active' | 'suspended' | 'banned'
  country: string
  division: 'junior' | 'senior' | 'pro'
  gender: 'male' | 'female' | 'mixed'
  lastActive: string
  dnxScore: number
}

export interface ManagedGym {
  id: string
  name: string
  logo: string
  country: string
  members: number
  revenue: number
  activeSessions: number
  deviceCount: number
  owner: string
  approved: boolean
}

export interface SupportTicket {
  id: string
  user: string
  subject: string
  priority: 'low' | 'medium' | 'high'
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed'
  category: 'Billing' | 'Ranking' | 'Device' | 'Account'
  date: string
  unread: number
  messages: { from: 'admin' | 'user'; text: string; at: string }[]
}

export const managedUsers: ManagedUser[] = [
  {
    id: 'u-1',
    name: 'Maya Ortiz',
    email: 'maya@vertex.fit',
    gym: 'Vertex Performance Lab',
    rank: 3,
    subscription: 'premium',
    status: 'active',
    country: 'US',
    division: 'pro',
    gender: 'female',
    lastActive: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    dnxScore: 981,
  },
  {
    id: 'u-2',
    name: 'Jonah Reeves',
    email: 'jonah@ironline.fit',
    gym: 'Ironline Athletics',
    rank: 4,
    subscription: 'pro',
    status: 'active',
    country: 'US',
    division: 'pro',
    gender: 'male',
    lastActive: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
    dnxScore: 968,
  },
  {
    id: 'u-3',
    name: 'Sydney Chen',
    email: 'sydney@pulse.fit',
    gym: 'Pulse District',
    rank: 6,
    subscription: 'pro',
    status: 'suspended',
    country: 'CA',
    division: 'senior',
    gender: 'female',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    dnxScore: 944,
  },
  {
    id: 'u-4',
    name: 'Diego Martins',
    email: 'diego@vertex.fit',
    gym: 'Vertex Performance Lab',
    rank: 8,
    subscription: 'free',
    status: 'active',
    country: 'BR',
    division: 'senior',
    gender: 'male',
    lastActive: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    dnxScore: 918,
  },
]

export const managedGyms: ManagedGym[] = [
  {
    id: 'g-1',
    name: 'Vertex Performance Lab',
    logo: 'V',
    country: 'US',
    members: 186,
    revenue: 62000,
    activeSessions: 19,
    deviceCount: 24,
    owner: 'Alyssa North',
    approved: true,
  },
  {
    id: 'g-2',
    name: 'Ironline Athletics',
    logo: 'I',
    country: 'US',
    members: 142,
    revenue: 49800,
    activeSessions: 13,
    deviceCount: 16,
    owner: 'Noah Kerr',
    approved: true,
  },
  {
    id: 'g-3',
    name: 'Pulse District',
    logo: 'P',
    country: 'CA',
    members: 104,
    revenue: 33400,
    activeSessions: 9,
    deviceCount: 12,
    owner: 'Mina Vo',
    approved: false,
  },
]

export const supportTickets: SupportTicket[] = [
  {
    id: 'T-1024',
    user: 'Maya Ortiz',
    subject: 'Ranking score mismatch after session sync',
    priority: 'high',
    status: 'Open',
    category: 'Ranking',
    date: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    unread: 2,
    messages: [
      { from: 'user', text: 'My score did not update after last session.', at: '10:06' },
      { from: 'admin', text: 'Checking sync logs now.', at: '10:12' },
      { from: 'user', text: 'Thanks. Need this before weekly cutoff.', at: '10:15' },
    ],
  },
  {
    id: 'T-1021',
    user: 'Jonah Reeves',
    subject: 'Premium renewal failed',
    priority: 'medium',
    status: 'Pending',
    category: 'Billing',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unread: 1,
    messages: [{ from: 'user', text: 'Card was charged but plan stayed on hold.', at: '09:02' }],
  },
]
