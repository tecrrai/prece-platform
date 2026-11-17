import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import logo from '@/assets/logo-login.png'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/WorkspaceUI'

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const solicitar = (event) => {
    event.preventDefault()
    setEnviado(true)
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-8">
      <Link to="/" aria-label="PRECE, voltar ao calendário" className="mb-8 w-fit rounded-lg"><img src={logo} alt="Movimento PRECE" className="h-16 w-auto" /></Link>
      <div className="prece-surface p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-prece-green-ink">Acesso à plataforma</p>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">Recuperar senha</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">Informe o e-mail usado no cadastro para consultar as opções de recuperação.</p>
        <form onSubmit={solicitar} className="mt-5 space-y-4">
          <TextField label="E-mail" type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setEnviado(false) }} placeholder="voce@exemplo.org" />
          {!enviado ? <Button type="submit" variant="red" className="w-full"><Mail className="mr-2 h-4 w-4" />Consultar recuperação</Button> : <p role="status" className="rounded-xl bg-prece-cream px-4 py-3 text-sm leading-5 text-neutral-700">A recuperação automática ainda não está conectada. Peça apoio à coordenação para atualizar seu acesso.</p>}
        </form>
        <Button asChild variant="ghost" className="mt-3 -ml-3"><Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" />Voltar ao login</Link></Button>
      </div>
    </main>
  )
}
