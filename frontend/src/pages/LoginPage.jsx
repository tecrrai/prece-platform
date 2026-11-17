import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, X } from 'lucide-react'
import foto from '@/assets/login-photo.jpg'
import logo from '@/assets/logo-login.png'
import { mensagemDeErro } from '@/api/http'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { email: '', senha: '' } })

  async function onSubmit({ email, senha }) {
    setErro('')
    try {
      const usuario = await login(email, senha)
      navigate(location.state?.from ?? '/app', { replace: true })
    } catch (e) {
      setErro(e?.response?.status === 401 ? 'Email ou senha inválidos' : mensagemDeErro(e, 'Não foi possível entrar. Tente novamente.'))
    }
  }

  return (
    <div className="grid min-h-screen bg-prece-cream md:grid-cols-2">
      <main className="relative flex flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-10">
        <Link to="/" aria-label="Voltar ao calendário" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-xl text-prece-red hover:bg-prece-red/10"><X className="h-5 w-5" /></Link>
        <Link to="/" aria-label="Movimento PRECE, início" className="w-fit rounded-lg"><img src={logo} alt="Movimento PRECE" className="h-16 w-auto sm:h-20" /></Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <h1 className="text-center text-3xl font-bold tracking-tight text-prece-red sm:text-4xl">Entrar no <span className="text-prece-green">PRECE</span></h1>
          <p className="mt-2 text-center text-sm text-neutral-600">Acesse suas atividades, materiais e datas da escola.</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7">
            <Label htmlFor="email" className="text-neutral-700">Email</Label>
            <Input id="email" type="email" variant="white" placeholder="Seu e-mail" autoComplete="email" icon={<Mail className="h-5 w-5" aria-hidden="true" fill="currentColor" stroke="white" />} aria-invalid={!!errors.email} {...register('email', { required: 'Informe seu email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' } })} />
            {errors.email && <p className="mt-1 text-sm text-prece-red">{errors.email.message}</p>}
            <Label htmlFor="senha" className="mt-5 text-neutral-700">Senha</Label>
            <div className="relative">
              <button type="button" onClick={() => setMostrarSenha((value) => !value)} aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'} className="absolute left-4 top-1/2 z-10 grid h-11 w-8 -translate-y-1/2 place-items-center text-prece-red">{mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              <Input id="senha" type={mostrarSenha ? 'text' : 'password'} variant="white" autoComplete="current-password" placeholder="Sua senha" className="pl-14 pr-3" aria-invalid={!!errors.senha} {...register('senha', { required: 'Informe sua senha' })} />
            </div>
            {errors.senha && <p className="mt-1 text-sm text-prece-red">{errors.senha.message}</p>}
            <Link to="/recuperar-senha" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-prece-red underline underline-offset-2">Esqueceu a senha?</Link>
            {erro && <p role="alert" className="mt-3 rounded-xl bg-prece-red/10 px-3 py-2.5 text-sm text-prece-red">{erro}</p>}
            <Button type="submit" variant="red" size="lg" className="mt-5 w-full" disabled={isSubmitting}>{isSubmitting ? 'Entrando…' : 'Entrar'}</Button>
          </form>
        </div>
        <p className="text-center text-xs text-neutral-500">Uma comunidade que aprende em cooperação.</p>
      </main>

      <aside className="relative hidden min-h-screen overflow-hidden md:block">
        <img src={foto} alt="Estudantes estudando juntos sob uma árvore" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/55 via-neutral-900/30 to-neutral-900/70" />
        <div className="relative flex h-full flex-col items-center justify-center px-8 py-10 text-center text-white">
          <h2 className="text-4xl font-bold lg:text-5xl">Bem-vindo!</h2>
          <p className="mt-4 max-w-sm text-lg leading-7 text-white/90">Sua rotina escolar em um só lugar, com espaço para aprender junto.</p>
          <div className="mt-auto w-full max-w-sm rounded-2xl bg-black/15 p-6"><p className="text-lg font-semibold">Acesso à comunidade PRECE</p><p className="mt-2 text-sm text-white/90">Solicite suas credenciais à administração da escola.</p></div>
        </div>
      </aside>
    </div>
  )
}
