import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3, BookOpen, CalendarDays, CheckSquare,
  ClipboardCheck, Flag, Home, Megaphone, Menu, Users, X, LogOut,
} from 'lucide-react'
import logo from '@/assets/logo-header.png'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { perfilLabel } from '@/lib/roles'
import Footer from '@/components/Footer'

const ICONS = { Home, CalendarDays, CheckSquare, BookOpen, Users, Flag, ClipboardCheck, BarChart3, Megaphone }

const MENU = {
  ALUNO: [
    { to: '/app', label: 'Início', icon: 'Home', end: true },
    { to: '/app/calendario', label: 'Calendário', icon: 'CalendarDays' },
    { to: '/app/tarefas', label: 'Minhas tarefas', icon: 'CheckSquare' },
    { to: '/app/materiais', label: 'Materiais', icon: 'BookOpen' },
    { to: '/app/grupos', label: 'Grupos de estudo', icon: 'Users' },
    { to: '/app/metas', label: 'Minhas metas', icon: 'Flag' },
    { to: '/app/reflexoes', label: 'Autoavaliação', icon: 'ClipboardCheck' },
  ],
  PROFESSOR: [
    { to: '/app', label: 'Visão geral', icon: 'Home', end: true },
    { to: '/app/calendario', label: 'Calendário', icon: 'CalendarDays' },
    { to: '/app/tarefas', label: 'Tarefas e validações', icon: 'CheckSquare' },
    { to: '/app/materiais', label: 'Materiais', icon: 'BookOpen' },
    { to: '/app/grupos', label: 'Grupos de estudo', icon: 'Users' },
    { to: '/app/metas', label: 'Metas', icon: 'Flag' },
    { to: '/app/reflexoes', label: 'Mentoria', icon: 'ClipboardCheck' },
    { to: '/app/relatorios', label: 'Relatórios', icon: 'BarChart3' },
  ],
  ADMIN: [
    { to: '/app', label: 'Visão geral', icon: 'Home', end: true },
    { to: '/app/calendario', label: 'Calendário escolar', icon: 'CalendarDays' },
    { to: '/app/mural', label: 'Mural de avisos', icon: 'Megaphone' },
    { to: '/app/pessoas', label: 'Pessoas e acessos', icon: 'Users' },
    { to: '/app/relatorios', label: 'Relatórios', icon: 'BarChart3' },
  ],
}
Object.values(MENU).forEach((links) => links.push({ to: '/app/perfil', label: 'Meu perfil', icon: 'Users' }))

function Navegacao({ perfil, aoNavegar }) {
  const links = MENU[perfil] ?? MENU.ALUNO
  return (
    <nav aria-label="Menu principal" className="space-y-1.5">
      {links.map(({ to, label, icon, end }) => {
        const Icon = ICONS[icon]
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={aoNavegar}
            className={({ isActive }) => cn(
              'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
              isActive ? 'bg-prece-red text-white shadow-sm' : 'text-neutral-700 hover:bg-prece-red/10 hover:text-prece-red',
            )}
          >
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default function AppShell() {
  const { user, logout } = useAuth()
  const [drawerAberto, setDrawerAberto] = useState(false)
  const location = useLocation()
  const perfil = user?.perfil ?? 'ALUNO'
  const nome = user?.nome?.split(' ')[0] ?? 'Comunidade'
  const links = MENU[perfil] ?? MENU.ALUNO
  const tituloAtual = useMemo(() => links.find((link) => link.to === location.pathname)?.label ?? 'PRECE', [links, location.pathname])

  useEffect(() => setDrawerAberto(false), [location.pathname])
  useEffect(() => {
    if (!drawerAberto) return undefined
    const fecharComEscape = (event) => event.key === 'Escape' && setDrawerAberto(false)
    window.addEventListener('keydown', fecharComEscape)
    return () => window.removeEventListener('keydown', fecharComEscape)
  }, [drawerAberto])

  const sair = () => {
    logout()
    window.location.assign('/')
  }

  return (
    <div className="min-h-screen bg-[#fbfaf5]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-neutral-200 bg-white px-4 py-6 lg:flex">
        <Link to="/app" className="mb-6 flex items-center justify-center rounded-xl bg-prece-cream/70 p-3" aria-label="PRECE, ir ao início">
          <img src={logo} alt="Movimento PRECE" className="h-14 w-auto object-contain" />
        </Link>
        <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{perfilLabel(perfil)}</div>
        <Navegacao perfil={perfil} />
        <div className="mt-auto border-t border-neutral-200 pt-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <Link to="/app/perfil" aria-label="Abrir meu perfil" className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-prece-green-soft font-bold text-prece-green-ink">{user?.fotoPerfil ? <img src={user.fotoPerfil} alt="" className="h-full w-full object-cover" /> : nome.slice(0, 1)}</Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-800">{user?.nome ?? 'Usuário'}</p>
              <p className="text-xs text-neutral-500">{perfilLabel(perfil)}</p>
            </div>
          </div>
          <button type="button" onClick={sair} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-neutral-600 hover:bg-neutral-100">
            <LogOut className="h-5 w-5" aria-hidden="true" /> Sair da conta
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-prece-red px-4 text-white shadow-sm lg:h-16 lg:bg-white lg:px-8 lg:text-neutral-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
              aria-label={drawerAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={drawerAberto}
              aria-controls="menu-mobile"
              onClick={() => setDrawerAberto((aberto) => !aberto)}
            >
              {drawerAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <span className="font-semibold lg:hidden">PRECE</span>
            <h1 className="hidden text-lg font-semibold lg:block">{tituloAtual}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-neutral-500 sm:inline">Olá, {nome}</span>
            <Link to="/app/perfil" aria-label="Abrir meu perfil" className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-prece-green/30 bg-prece-green-soft font-semibold text-prece-green-ink">{user?.fotoPerfil ? <img src={user.fotoPerfil} alt="" className="h-full w-full object-cover" /> : nome.slice(0, 1)}</Link>
          </div>
        </header>

        {drawerAberto && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button className="absolute inset-0 h-full w-full bg-black/40" aria-label="Fechar menu" onClick={() => setDrawerAberto(false)} />
            <aside id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu principal" className="relative flex h-full w-[min(20rem,calc(100vw-3rem))] flex-col bg-white p-4 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
                <Link to="/app" className="rounded-lg bg-prece-cream p-2" aria-label="PRECE, ir ao início">
                  <img src={logo} alt="Movimento PRECE" className="h-10 w-auto" />
                </Link>
                <button type="button" className="grid h-11 w-11 place-items-center rounded-xl text-neutral-600 hover:bg-neutral-100" aria-label="Fechar menu" onClick={() => setDrawerAberto(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{perfilLabel(perfil)}</div>
              <Navegacao perfil={perfil} aoNavegar={() => setDrawerAberto(false)} />
              <div className="mt-auto border-t border-neutral-200 pt-4">
                <p className="mb-3 px-3 text-sm font-medium text-neutral-700">{user?.nome}</p>
                <button type="button" onClick={sair} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-neutral-600 hover:bg-neutral-100">
                  <LogOut className="h-5 w-5" aria-hidden="true" /> Sair da conta
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <p role="note" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            Tarefas, materiais, grupos, metas, reflexões, relatórios e mural ainda usam dados de demonstração locais. Seu perfil e acesso são gerenciados pelo servidor.
          </p>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
