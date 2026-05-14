import { useEffect } from 'react'

import { useDnxSocket } from '@/sockets/socket-context'

/**
 * Subscribe to a Socket.io event with automatic cleanup.
 * No-op when demo mode has no socket connection.
 */
export function useSocketEvent<T>(event: string, handler: (payload: T) => void) {
  const { socket } = useDnxSocket()

  useEffect(() => {
    if (!socket) return
    socket.on(event, handler as (...args: unknown[]) => void)
    return () => {
      socket.off(event, handler as (...args: unknown[]) => void)
    }
  }, [socket, event, handler])
}
