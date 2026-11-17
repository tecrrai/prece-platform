import { useEffect, useState } from 'react'
import { Clipboard, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, MetricCard, PageHeading, SectionCard, SelectField, TextField } from '@/components/WorkspaceUI'
import { createUser, listUsers } from '@/api/auth'
import { mensagemDeErro } from '@/api/http'

const ROLE = { ADMIN: 'Administrador', PROFESSOR: 'Professor', ALUNO: 'Estudante' }
export default function AdminPage() {
  const [users, setUsers] = useState([]); const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [created, setCreated] = useState(null)
  const [form, setForm] = useState({ nome: '', email: '', perfil: 'ALUNO' })
  const load = () => listUsers().then(setUsers).catch((e) => setError(mensagemDeErro(e, 'Não foi possível carregar as contas.')))
  useEffect(() => { load() }, [])
  async function submit(e) { e.preventDefault(); setError(''); setCreated(null); setBusy(true); try { const result = await createUser(form); setCreated(result); setForm({ nome: '', email: '', perfil: 'ALUNO' }); setOpen(false); await load() } catch (err) { setError(mensagemDeErro(err, 'Não foi possível criar a conta.')) } finally { setBusy(false) } }
  async function copy() { await navigator.clipboard.writeText(`Email: ${created.usuario.email}\nSenha temporária: ${created.senhaTemporaria}`) }
  return <>
    <PageHeading eyebrow="Gestão de acessos" title="Pessoas e perfis" description="Crie contas reais para estudantes e professores. A senha temporária é exibida uma única vez para você copiar e enviar com o email." action={<Button variant="red" onClick={() => { setOpen(!open); setCreated(null) }}><Plus className="mr-2 h-4 w-4"/>Criar conta</Button>}/>
    <div className="mb-5 grid gap-3 sm:grid-cols-3"><MetricCard label="Estudantes" value={users.filter(x=>x.perfil==='ALUNO').length} detail="Contas registradas" icon={Users} accent="green"/><MetricCard label="Professores" value={users.filter(x=>x.perfil==='PROFESSOR').length} detail="Contas registradas" icon={Users}/><MetricCard label="Acessos ativos" value={users.filter(x=>x.ativo).length} detail="Contas habilitadas" icon={Users} accent="green"/></div>
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {created && <SectionCard title="Conta criada — copie a senha agora" description="Por segurança, a senha temporária não poderá ser consultada novamente. O usuário deverá trocá-la no primeiro acesso." className="mb-5"><div className="grid gap-2 rounded-xl bg-prece-cream p-4 text-sm"><p>Email: <strong>{created.usuario.email}</strong></p><p>Senha temporária: <code className="select-all rounded bg-white px-2 py-1 font-bold">{created.senhaTemporaria}</code></p></div><Button className="mt-3" onClick={copy}><Clipboard className="mr-2 h-4 w-4"/>Copiar email e senha</Button></SectionCard>}
    {open && <SectionCard title="Nova conta" description="O sistema gera uma senha aleatória forte. Nunca reutilize a senha temporária." className="mb-5"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><TextField label="Nome completo" required value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/><TextField label="Email de acesso" required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><SelectField label="Perfil" value={form.perfil} onChange={e=>setForm({...form,perfil:e.target.value})}><option value="ALUNO">Estudante</option><option value="PROFESSOR">Professor</option></SelectField><div className="flex items-end gap-2"><Button type="submit" variant="red" disabled={busy}>{busy?'Criando…':'Criar conta'}</Button><Button type="button" variant="ghost" onClick={()=>setOpen(false)}>Cancelar</Button></div></form></SectionCard>}
    <SectionCard title="Contas da comunidade" description="Contas conectadas ao backend PRECE.">{!users.length ? <EmptyState title="Nenhuma conta carregada" description="Verifique a conexão com o servidor."/> : <div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead><tr className="border-b text-xs uppercase text-neutral-500"><th className="px-3 py-3">Pessoa</th><th className="px-3 py-3">Perfil</th><th className="px-3 py-3">Acesso</th></tr></thead><tbody>{users.map(u=><tr key={u.id} className="border-b border-neutral-100"><td className="px-3 py-3"><strong>{u.nome}</strong><div className="text-xs text-neutral-500">{u.email}</div></td><td className="px-3 py-3">{ROLE[u.perfil]}</td><td className="px-3 py-3">{u.ativo?'Ativo':'Suspenso'}{u.primeiroAcesso?' · Primeiro acesso pendente':''}</td></tr>)}</tbody></table></div>}</SectionCard>
  </>
}
