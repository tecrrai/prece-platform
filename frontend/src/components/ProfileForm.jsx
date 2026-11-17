import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageHeading, SectionCard, SelectField, TextField } from '@/components/WorkspaceUI'
import { useAuth } from '@/context/AuthContext'
import { mensagemDeErro } from '@/api/http'

const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,72}$/
export default function ProfileForm({ onboarding = false }) {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: user?.nome ?? '', endereco: user?.endereco ?? '', cep: user?.cep ?? '', municipio: user?.municipio ?? '', uf: user?.uf ?? '', telefone: user?.telefone ?? '', nascimento: user?.nascimento ?? '', fotoPerfil: user?.fotoPerfil ?? '', senhaAtual: '', novaSenha: '', confirmar: '' })
  const [erro, setErro] = useState(''); const [salvo, setSalvo] = useState(false); const [busy, setBusy] = useState(false)
  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }))
  const foto = (event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/') || file.size > 4 * 1024 * 1024) { setErro('Escolha uma imagem de até 4 MB.'); return } const reader = new FileReader(); reader.onload = () => set('fotoPerfil', reader.result); reader.readAsDataURL(file) }
  async function submit(event) {
    event.preventDefault(); setErro(''); setSalvo(false)
    if (onboarding && !strong.test(form.novaSenha)) { setErro('Use pelo menos 12 caracteres, uma letra maiúscula, um número e um caractere especial.'); return }
    if (form.novaSenha && (form.novaSenha !== form.confirmar || !strong.test(form.novaSenha))) { setErro('Confirme a nova senha e use 12 caracteres, maiúscula, número e caractere especial.'); return }
    setBusy(true)
    try { const { confirmar, ...payload } = form; await updateProfile(payload); setSalvo(true); if (onboarding) navigate('/app', { replace: true }) }
    catch (e) { setErro(mensagemDeErro(e, 'Não foi possível salvar seu perfil.')) } finally { setBusy(false) }
  }
  return <><PageHeading eyebrow={onboarding ? 'Primeiro acesso' : 'Sua conta'} title={onboarding ? 'Complete seu perfil' : 'Meu perfil'} description={onboarding ? 'Complete as informações solicitadas e defina uma senha pessoal antes de continuar.' : 'Atualize seus dados pessoais, foto e senha.'} /><SectionCard title="Informações pessoais" description="Os campos marcados são necessários para concluir seu acesso.">
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-4 sm:col-span-2"><img src={form.fotoPerfil || '/icons/prece-icon.png'} alt="Foto do perfil" className="h-20 w-20 rounded-full border border-neutral-200 object-cover"/><TextField label="Foto de perfil (imagem até 4 MB)" type="file" accept="image/*" onChange={foto}/></div>
      <TextField label="Nome completo" required value={form.nome} onChange={e=>set('nome',e.target.value)}/><TextField label="Email" type="email" value={user?.email ?? ''} disabled />
      <TextField label="Endereço" required={onboarding} value={form.endereco} onChange={e=>set('endereco',e.target.value)}/><TextField label="CEP" required={onboarding} value={form.cep} onChange={e=>set('cep',e.target.value)}/>
      <TextField label="Município" required={onboarding} value={form.municipio} onChange={e=>set('municipio',e.target.value)}/><SelectField label="Estado" required={onboarding} value={form.uf} onChange={e=>set('uf',e.target.value)}><option value="">Selecione</option>{'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').map(x=><option key={x}>{x}</option>)}</SelectField>
      <TextField label="Telefone" required={onboarding} value={form.telefone} onChange={e=>set('telefone',e.target.value)}/><TextField label="Data de nascimento" type="date" value={form.nascimento} onChange={e=>set('nascimento',e.target.value)}/>
      {!onboarding && <TextField label="Senha atual (para alterá-la)" type="password" autoComplete="current-password" value={form.senhaAtual} onChange={e=>set('senhaAtual',e.target.value)}/>}
      <TextField label={onboarding ? 'Nova senha pessoal' : 'Nova senha (opcional)'} type="password" autoComplete="new-password" required={onboarding} value={form.novaSenha} onChange={e=>set('novaSenha',e.target.value)} />
      <TextField label="Confirme a nova senha" type="password" autoComplete="new-password" required={onboarding} value={form.confirmar} onChange={e=>set('confirmar',e.target.value)}/>
      <p className="text-xs leading-5 text-neutral-500 sm:col-span-2">A senha precisa ter no mínimo 12 caracteres, uma letra maiúscula, um número e um caractere especial.</p>
      {erro && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">{erro}</p>}{salvo && <p role="status" className="text-sm text-green-800 sm:col-span-2">Perfil salvo.</p>}
      <div className="sm:col-span-2"><Button type="submit" variant="red" disabled={busy}>{busy ? 'Salvando…' : onboarding ? 'Salvar e continuar' : 'Salvar perfil'}</Button></div>
    </form></SectionCard></>
}
