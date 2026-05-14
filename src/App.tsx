import { AppRoutes } from '@/routes/AppRoutes'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return <div>

    <AppRoutes />
    <Toaster toastOptions={{
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#131726',
        color: '#ffffff',
      },
    }} />
  </div>
}
