import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}