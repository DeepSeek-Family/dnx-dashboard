import { useMotionValueEvent, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  value: number | string | null | undefined
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: Props) {
  const numericValue = typeof value === 'number' ? value : Number(value)
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0
  const spring = useSpring(safeValue, { stiffness: 140, damping: 24 })
  const [text, setText] = useState(() => safeValue.toFixed(decimals))

  useEffect(() => {
    spring.set(safeValue)
    setText(safeValue.toFixed(decimals))
  }, [decimals, safeValue, spring])

  useMotionValueEvent(spring, 'change', (v) => {
    setText((Number.isFinite(v) ? v : 0).toFixed(decimals))
  })

  return (
    <span className="font-semibold tracking-tight text-dnx-text tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
