import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '@/assets/logo-header.png'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/app/tarefas', label: 'Tarefas' },
  { to: '/app/materiais', label: 'Materiais' },
  { to: '/app/grupos', label: 'Grupos' },
  { to: '/app/metas', label: 'Metas' },
  { to: '/app/reflexoes', label: 'Autoavaliação' },
  { to: '/app/perfil', label: 'Meu perfil' },
]
const PUBLIC_LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
]

export default function Header() {
  const [aberto, setAberto] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const student = user?.perfil === 'ALUNO'
  const links = student ? LINKS : PUBLIC_LINKS
  const sair = () => { logout(); window.location.assign('/') }
  useEffect(() => setAberto(false), [location.pathname])
  useEffect(() => {
    if (!aberto) return undefined
    const fechar = (event) => event.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', fechar)
    return () => window.removeEventListener('keydown', fechar)
  }, [aberto])

  return (
    <header className="relative flex min-h-16 items-center justify-between gap-4 py-3 lg:min-h-24 lg:py-5">
      <Link to="/" aria-label="PRECE - calendário escolar" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prece-green">
        <img src={logo} alt="Movimento PRECE" className="h-12 w-auto sm:h-14" />
      </Link>

      <nav aria-label="Navegação principal" className="hidden min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto lg:flex xl:justify-center">
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('shrink-0 rounded-lg px-2 py-2 text-xs font-medium text-prece-red hover:bg-prece-red/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prece-red xl:px-3 xl:text-sm', isActive && 'font-semibold underline underline-offset-4')}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:flex lg:items-center lg:gap-2">{student ? <Button variant="outlineRed" onClick={sair}>Sair</Button> : <Button asChild size="lg" className="min-w-32"><Link to="/login">Entrar</Link></Button>}</div>

      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-xl text-prece-red hover:bg-prece-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prece-red lg:hidden"
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={aberto}
        aria-controls="menu-publico-mobile"
        onClick={() => setAberto((value) => !value)}
      >
        {aberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 h-full w-full bg-black/40" aria-label="Fechar menu" onClick={() => setAberto(false)} />
          <aside id="menu-publico-mobile" role="dialog" aria-modal="true" aria-label="Menu de navegação" className="relative flex h-full w-[min(20rem,calc(100vw-3rem))] flex-col bg-white p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
              <img src={logo} alt="Movimento PRECE" className="h-11 w-auto" />
              <button type="button" aria-label="Fechar menu" className="grid h-11 w-11 place-items-center rounded-xl text-neutral-600 hover:bg-neutral-100" onClick={() => setAberto(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Navegação principal" className="space-y-1.5">
              {links.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} onClick={() => setAberto(false)} className={({ isActive }) => cn('flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-neutral-700 hover:bg-prece-red/10', isActive && 'bg-prece-red/10 font-semibold text-prece-red')}>
                  {label}
                </NavLink>
              ))}
            </nav>
            {student ? <Button size="lg" className="mt-auto w-full" onClick={sair}>Sair da conta</Button> : <Button asChild size="lg" className="mt-auto w-full"><Link to="/login" onClick={() => setAberto(false)}>Entrar na plataforma</Link></Button>}
          </aside>
        </div>
      )}
    </header>
  )
}
