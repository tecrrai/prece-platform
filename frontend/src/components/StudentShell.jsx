import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
export default function StudentShell() {
  return <div className="min-h-screen bg-prece-cream"><div className="mx-auto min-h-screen max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"><Header/><main className="mx-auto max-w-6xl pt-3"><Outlet/></main></div></div>
}
