import Header from '@/components/Header'
import MonthCalendar from '@/components/Calendar/MonthCalendar'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { StudentDashboard } from '@/pages/DashboardPage'
import Footer from '@/components/Footer'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  useEffect(() => {
    if (location.hash !== '#calendar') return
    requestAnimationFrame(() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [location.hash])
  if (isAuthenticated) return <Navigate to="/app" replace />

  return (
    <div className="min-h-screen bg-prece-cream">
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <Header />
        <div className="mx-auto max-w-6xl">
        {user?.perfil === 'ALUNO' && <div className="mb-8"><StudentDashboard nome={user.nome?.split(' ')[0] ?? 'estudante'} /></div>}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-prece-green-ink">Comunidade PRECE</p>
            <h1 className="mt-1 text-2xl font-bold text-prece-red sm:text-3xl">Calendário escolar</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Acompanhe os próximos encontros, atividades e datas importantes da escola.</p>
          </div>
          <Button asChild variant="red" size="lg"><Link to={user?.perfil === 'ALUNO' ? '/app/tarefas' : '/login'}>{user?.perfil === 'ALUNO' ? 'Abrir minhas tarefas' : 'Acessar minha rotina'}</Link></Button>
        </div>
        <MonthCalendar />
      </div>
    </div>
    <Footer />
    </div>
  )
}
