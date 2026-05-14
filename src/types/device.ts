export type DeviceConnectivity = 'online' | 'warning' | 'offline'

export interface BiometricDevice {
  id: string
  label: string
  stationId: string
  firmware: string
  batteryPct: number
  status: DeviceConnectivity
  lastSeen: string
}
