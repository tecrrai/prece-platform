import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, Flag, School, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MetricCard, PageHeading, SectionCard, StatusBadge } from '@/components/WorkspaceUI'
import { COLLECTIONS, dataCurta, tarefasDoAluno, useCollection } from '@/data/collections'
import { useAuth } from '@/context/AuthContext'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function SemanaAtual() {
  const inicio = dayjs().startOf('week')
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Dias desta semana">
      {Array.from({ length: 7 }, (_, index) => {
        const data = inicio.add(index, 'day')
        const hoje = data.isSame(dayjs(), 'day')
        return (
          <div key={data.format('YYYY-MM-DD')} className={`min-w-14 flex-1 rounded-xl px-2 py-3 text-center ${hoje ? 'bg-prece-red text-white' : 'bg-prece-cream text-neutral-700'}`}>
            <p className={`text-lg font-bold ${hoje ? 'text-white' : 'text-prece-green-ink'}`}>{data.format('D')}</p>
            <p className="mt-0.5 text-xs">{DIAS[data.day()]}</p>
          </div>
        )
      })}
    </div>
  )
}

export function StudentDashboard({ nome }) {
  const [tasks, setTasks] = useCollection(COLLECTIONS.tasks)
  const [goals] = useCollection(COLLECTIONS.goals)
  const [groups] = useCollection(COLLECTIONS.groups)
  const tarefasDoUsuario = tarefasDoAluno(tasks, nome, groups)
  const tarefasHoje = tarefasDoUsuario.filter((task) => task.prazo === dayjs().format('YYYY-MM-DD'))
  const concluidas = tarefasHoje.filter((task) => task.status === 'CONCLUIDA').length
  const metasAtivas = goals.filter((goal) => goal.status === 'ATIVA').length
  const atualizarStatus = (task) => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status: item.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA' } : item))

  return (
    <>
      <PageHeading eyebrow="Sua rotina de aprendizagem" title={`Olá, ${nome}. Vamos organizar o dia?`} description="Veja o que precisa de atenção e avance no seu ritmo, com apoio dos colegas e professores." />
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <SectionCard title="Esta semana" description="Uma visão simples para ajudar você a planejar seus momentos de autonomia.">
          <SemanaAtual />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-prece-cream/70 px-4 py-3">
            <div><p className="text-sm font-semibold text-neutral-800">Prioridade de hoje</p><p className="mt-0.5 text-sm text-neutral-600">{tarefasHoje.length - concluidas} atividade(s) para concluir</p></div>
            <span className="text-xs font-medium text-neutral-500">Confira suas atividades aqui no início.</span>
          </div>
        </SectionCard>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Concluídas hoje" value={`${concluidas}/${tarefasHoje.length}`} detail="Seu avanço de hoje" icon={CheckCircle2} accent="green" />
          <MetricCard label="Metas ativas" value={metasAtivas} detail="Pessoais e coletivas" icon={Flag} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Atividades do dia" description="Marque cada atividade quando concluir.">
          {tarefasHoje.length === 0 ? <p className="text-sm text-neutral-500">Você está em dia. Confira as próximas tarefas.</p> : (
            <div className="divide-y divide-neutral-100">
              {tarefasHoje.map((task) => (
                <article key={task.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0"><p className="font-medium text-neutral-800">{task.titulo}</p><p className="mt-1 text-xs text-neutral-500">{task.materia} · {task.tipo}</p></div>
                  <div className="flex items-center gap-2"><StatusBadge status={task.status} /><button type="button" onClick={() => atualizarStatus(task)} aria-label={task.status === 'CONCLUIDA' ? `Reabrir ${task.titulo}` : `Concluir ${task.titulo}`} className="grid h-11 w-11 place-items-center rounded-xl border border-neutral-200 text-prece-green-ink hover:bg-prece-green/10">{task.status === 'CONCLUIDA' ? <CheckCircle2 className="h-5 w-5" /> : <span className="h-5 w-5 rounded-full border-2 border-current" />}</button></div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
        <div className="space-y-4">
          <SectionCard title="Seu grupo" description="Aprender em parceria fortalece o percurso de todo mundo.">
            {groups.slice(0, 1).map((group) => (
              <div key={group.id} className="rounded-xl bg-prece-cream/70 p-4">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-prece-green/10 text-prece-green-ink"><Users className="h-5 w-5" /></span><div><p className="font-semibold text-neutral-800">{group.nome}</p><p className="text-xs text-neutral-500">{group.integrantes.length} estudantes</p></div></div>
                <p className="mt-3 text-sm leading-5 text-neutral-600">{group.meta}</p>
                <div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-prece-green" style={{ width: `${group.progresso}%` }} /></div>
                <div className="mt-2 flex justify-between text-xs text-neutral-500"><span>Progresso coletivo</span><span>{group.progresso}%</span></div>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </>
  )
}

function TeacherDashboard() {
  const [submissions] = useCollection(COLLECTIONS.submissions)
  const [tasks] = useCollection(COLLECTIONS.tasks)
  const [groups] = useCollection(COLLECTIONS.groups)
  const aguardando = submissions.filter((item) => item.status === 'AGUARDANDO')
  return (
    <>
      <PageHeading eyebrow="Acompanhamento pedagógico" title="Visão geral da turma" description="Acompanhe rotinas e grupos, valide os registros enviados e reserve mais tempo para a mentoria." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Envios para validar" value={aguardando.length} detail="Rotinas e evidências aguardando retorno" icon={ClipboardCheck} accent="amber" />
        <MetricCard label="Atividades planejadas" value={tasks.length} detail="Itens no banco de atividades" icon={CheckCircle2} />
        <MetricCard label="Grupos de estudo" value={groups.length} detail="Com metas coletivas ativas" icon={Users} accent="green" />
        <MetricCard label="Materiais publicados" value="3" detail="Disponíveis para estudantes" icon={BookOpen} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Envios recentes" description="Dê retorno sobre a rotina de cada estudante.">
          {aguardando.slice(0, 3).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 py-3 last:border-0"><div><p className="font-medium text-neutral-800">{item.aluno}</p><p className="mt-1 text-sm text-neutral-500">{item.atividade} · Enviado em {dataCurta(item.enviadoEm)}</p></div><StatusBadge status={item.status} /></div>)}
          {aguardando.length === 0 && <p className="text-sm text-neutral-500">Não há envios aguardando validação.</p>}
          <Button asChild variant="outlineRed" size="sm" className="mt-3"><Link to="/app/tarefas">Abrir fila de validação <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </SectionCard>
        <SectionCard title="Acompanhamento pedagógico" description="As ferramentas de planejamento e acompanhamento estão sendo preparadas.">
          <p className="text-sm leading-6 text-neutral-600">Os indicadores e registros disponíveis no momento aparecem nos cartões desta página inicial.</p>
        </SectionCard>
      </div>
    </>
  )
}

function AdminDashboard() {
  const [users] = useCollection(COLLECTIONS.users)
  const [notices] = useCollection(COLLECTIONS.announcements)
  return (
    <>
      <PageHeading eyebrow="Gestão escolar" title="Visão geral da comunidade" description="Centralize os cadastros, os avisos e as datas que precisam chegar a toda a escola." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pessoas cadastradas" value={users.length} detail="Estudantes, professores e equipe" icon={Users} accent="green" />
        <MetricCard label="Professores" value={users.filter((item) => item.perfil === 'PROFESSOR').length} detail="Com acesso pedagógico" icon={ClipboardCheck} />
        <MetricCard label="Estudantes" value={users.filter((item) => item.perfil === 'ALUNO').length} detail="Com acesso à rotina escolar" icon={School} accent="green" />
        <MetricCard label="Avisos publicados" value={notices.length} detail="Comunicados no mural geral" icon={CalendarDays} accent="amber" />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <SectionCard title="Acesso rápido" description="Mantenha os dados e os canais da escola em dia.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/app/pessoas" className="rounded-xl border border-neutral-200 p-4 hover:border-prece-red/40"><Users className="mb-3 h-5 w-5 text-prece-red" /><p className="font-medium">Gerenciar pessoas</p><p className="mt-1 text-xs leading-5 text-neutral-500">Perfis, cadastros e situação de acesso</p></Link>
          </div>
        </SectionCard>
        <SectionCard title="Últimos comunicados" description="O que está em destaque para a comunidade.">
          {notices.slice(0, 3).map((item) => <div key={item.id} className="border-b border-neutral-100 py-3 last:border-0"><div className="flex items-center justify-between gap-3"><p className="font-medium text-neutral-800">{item.titulo}</p><span className="text-xs text-neutral-500">{dataCurta(item.publicadoEm)}</span></div><p className="mt-1 text-sm text-neutral-500">{item.texto}</p></div>)}
        </SectionCard>
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const nome = useMemo(() => user?.nome?.split(' ')[0] ?? 'estudante', [user])
  if (user?.perfil === 'ADMIN') return <AdminDashboard />
  if (user?.perfil === 'PROFESSOR') return <TeacherDashboard />
  return <StudentDashboard nome={nome} />
}
