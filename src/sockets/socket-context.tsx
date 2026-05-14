import { createContext, useContext } from 'react'
import type { Socket } from 'socket.io-client'

export interface DnxSocketContextValue {
  socket: Socket | null
  connected: boolean
  demoMode: boolean
}

export const SocketContext = createContext<DnxSocketContextValue>({
  socket: null,
  connected: false,
  demoMode: true,
})

export function useDnxSocket() {
  return useContext(SocketContext)
}
