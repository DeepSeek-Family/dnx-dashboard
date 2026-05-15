import { io, type Socket } from 'socket.io-client'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { App } from 'antd'

import { SOCKET_EVENTS } from '@/sockets/events'
import type { DnxSocketContextValue } from '@/sockets/socket-context'
import { SocketContext } from '@/sockets/socket-context'
import type {
  AlertEventPayload,
  AthleteSocketPayload,
  DeviceStatusPayload,
  SessionUpdatePayload,
} from '@/types/socket'

export function SocketProvider({ children }: { children: ReactNode }) {
  const { notification } = App.useApp()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const demoMode = !import.meta.env.VITE_SOCKET_URL

  useEffect(() => {
    if (demoMode) return

    const url = import.meta.env.VITE_SOCKET_URL
    if (!url) return
    const s = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 8000,
    })
    queueMicrotask(() => setSocket(s))

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    const onSession = (_payload: SessionUpdatePayload) => {}
    const onAthlete = (_payload: AthleteSocketPayload) => {}
    const onDevice = (_payload: DeviceStatusPayload) => {}
    const onRanking = () => {}
    const onAlert = (payload: AlertEventPayload) => {
      const desc = payload.message
      if (payload.severity === 'error')
        notification.error({ message: payload.title, description: desc })
      else if (payload.severity === 'warning')
        notification.warning({ message: payload.title, description: desc })
      else if (payload.severity === 'success')
        notification.success({ message: payload.title, description: desc })
      else notification.info({ message: payload.title, description: desc })
    }

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)
    s.on(SOCKET_EVENTS.sessionUpdate, onSession)
    s.on(SOCKET_EVENTS.athleteUpdate, onAthlete)
    s.on(SOCKET_EVENTS.deviceStatus, onDevice)
    s.on(SOCKET_EVENTS.rankingUpdate, onRanking)
    s.on(SOCKET_EVENTS.alertEvent, onAlert)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.off(SOCKET_EVENTS.sessionUpdate, onSession)
      s.off(SOCKET_EVENTS.athleteUpdate, onAthlete)
      s.off(SOCKET_EVENTS.deviceStatus, onDevice)
      s.off(SOCKET_EVENTS.rankingUpdate, onRanking)
      s.off(SOCKET_EVENTS.alertEvent, onAlert)
      s.disconnect()
      queueMicrotask(() => {
        setSocket(null)
        setConnected(false)
      })
    }
  }, [demoMode, notification])

  const value = useMemo<DnxSocketContextValue>(
    () => ({
      socket,
      connected,
      demoMode,
    }),
    [socket, connected, demoMode],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
