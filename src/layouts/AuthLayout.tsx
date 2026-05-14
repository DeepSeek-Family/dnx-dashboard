import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,0,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(0,227,140,0.12),transparent_42%)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
