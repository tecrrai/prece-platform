import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const dateIn = (offset = 0) => dayjs().add(offset, 'day').format('YYYY-MM-DD')

export const COLLECTIONS = {
  tasks: 'prece.demo.tasks.v1',
  submissions: 'prece.demo.submissions.v1',
  materials: 'prece.demo.materials.v1',
  groups: 'prece.demo.groups.v1',
  goals: 'prece.demo.goals.v1',
  reflections: 'prece.demo.reflections.v1',
  users: 'prece.demo.users.v1',
  announcements: 'prece.demo.announcements.v1',
}

export const SEEDS = {
  [COLLECTIONS.tasks]: [
    { id: 't1', titulo: 'Observar células vegetais no microscópio', materia: 'Biologia', tipo: 'Experimento / Laboratório', alvo: 'Ana Clara da Silva', prazo: dateIn(), dataFim: dateIn(2), horario: '10:30', diaSemana: ['Terça-feira'], status: 'CONCLUIDA', descricao: 'Registrar as observações do experimento e conversar com o grupo.', urlMaterial: 'https://www.todamateria.com.br/celula-vegetal/' },
    { id: 't2', titulo: 'Divulgar informações para engajar os colegas', materia: 'Projeto coletivo', tipo: 'Comitê de comunicação', alvo: 'Célula Aurora', prazo: dateIn(-1), dataFim: dateIn(-1), horario: '13:30', diaSemana: ['Segunda-feira'], status: 'ATRASADO', descricao: 'Divulgar os próximos projetos, incentivando o engajamento e a participação dos alunos.' },
    { id: 't3', titulo: 'Resolução da lista de Matemática', materia: 'Matemática', tipo: 'Estudo individual', alvo: 'João Pereira', prazo: dateIn(), dataFim: dateIn(), horario: '17:30', diaSemana: ['Quinta-feira'], status: 'ANDAMENTO', descricao: 'Resolver a lista de frações e revisar a tabuada.' },
    { id: 't4', titulo: 'Organizar a horta da escola', materia: 'Projeto coletivo', tipo: 'Momento de autonomia', alvo: 'Célula Aurora', prazo: dateIn(2), dataFim: dateIn(2), horario: '15:00', diaSemana: ['Quarta-feira'], status: 'PENDENTE', descricao: 'Combinar as etapas da atividade com a Célula Aurora.' },
    { id: 't5', titulo: 'Ler o guia de estudos da semana', materia: 'Orientação', tipo: 'Estudo individual', alvo: 'Turma completa', prazo: dateIn(-2), dataFim: dateIn(-2), horario: '08:30', diaSemana: ['Sexta-feira'], status: 'CONCLUIDA', descricao: 'Marcar uma prioridade para a próxima mentoria.' },
  ],
  [COLLECTIONS.submissions]: [
    { id: 's1', aluno: 'João Pereira', atividade: 'Relato do experimento de Biologia', enviadoEm: dateIn(), status: 'AGUARDANDO', evidencia: 'Relato digitado', feedback: '' },
    { id: 's2', aluno: 'Ana Clara da Silva', atividade: 'Plano de estudos semanal', enviadoEm: dateIn(-1), status: 'AGUARDANDO', evidencia: 'Plano da semana', feedback: '' },
    { id: 's3', aluno: 'Rafael Lima', atividade: 'Registro de momento de autonomia', enviadoEm: dateIn(-1), status: 'APROVADA', evidencia: 'Leitura concluída', feedback: 'Boa organização da rotina.' },
  ],
  [COLLECTIONS.materials]: [
    { id: 'm1', titulo: 'Guia de funções trigonométricas', materia: 'Matemática', tipo: 'PDF', publico: 'Turma completa', atualizadoEm: dateIn(-1), url: 'https://www.todamateria.com.br/trigonometria/' },
    { id: 'm2', titulo: 'Roteiro de observação celular', materia: 'Biologia', tipo: 'Atividade', publico: 'Célula Aurora', atualizadoEm: dateIn(-2), url: 'https://www.todamateria.com.br/celula-vegetal/' },
    { id: 'm3', titulo: 'Como planejar uma semana de estudos', materia: 'Orientação', tipo: 'Vídeo', publico: 'Turma completa', atualizadoEm: dateIn(-4), url: 'https://www.youtube.com/' },
  ],
  [COLLECTIONS.groups]: [
    { id: 'g1', nome: 'Célula Aurora', foco: 'Ciências da natureza', integrantes: ['João Pereira', 'Ana Clara da Silva', 'Rafael Lima', 'Maria Eduarda', 'Caio Santos'], meta: 'Preparar a apresentação de Biologia até sexta-feira.', progresso: 60 },
    { id: 'g2', nome: 'Círculo de Redação', foco: 'Linguagens', integrantes: ['João Pereira', 'Luiza Costa', 'Pedro Nunes'], meta: 'Produzir e revisar uma redação por semana.', progresso: 35 },
  ],
  [COLLECTIONS.goals]: [
    { id: 'o1', titulo: 'Estudar Matemática 30 minutos', categoria: 'Acadêmica', frequencia: 'Diária', responsavel: 'João Pereira', progresso: 2, alvo: 5, status: 'ATIVA' },
    { id: 'o2', titulo: 'Escrever uma redação', categoria: 'Acadêmica', frequencia: 'Semanal', responsavel: 'Turma 2026', progresso: 1, alvo: 2, status: 'ATIVA' },
    { id: 'o3', titulo: 'Planejar a semana com o grupo', categoria: 'Coletiva', frequencia: 'Semanal', responsavel: 'Célula Aurora', progresso: 3, alvo: 4, status: 'ATIVA' },
  ],
  [COLLECTIONS.reflections]: [
    { id: 'r1', aluno: 'João Pereira', periodo: 'Semana atual', foco: 'Organização do tempo', nota: 'Consegui estudar em grupo e reservar um horário para Matemática. Ainda preciso planejar melhor os dias de laboratório.', bemEstar: 4, status: 'AGUARDANDO', feedback: '' },
    { id: 'r2', aluno: 'Ana Clara da Silva', periodo: 'Semana atual', foco: 'Participação no grupo', nota: 'Ajudei a dividir as tarefas do experimento e ouvi as ideias das outras pessoas.', bemEstar: 5, status: 'AGUARDANDO', feedback: '' },
  ],
  [COLLECTIONS.users]: [
    { id: 'u1', nome: 'Pedro Lucca', email: 'pedro.gestor@prece.org', perfil: 'ADMIN', status: 'ATIVO' },
    { id: 'u2', nome: 'Alice Costa', email: 'alice.costa@prece.org', perfil: 'PROFESSOR', status: 'ATIVO' },
    { id: 'u3', nome: 'João Pereira', email: 'joao.pereira@aluno.prece.org', perfil: 'ALUNO', status: 'ATIVO' },
    { id: 'u4', nome: 'Ana Clara da Silva', email: 'ana.clara@aluno.prece.org', perfil: 'ALUNO', status: 'ATIVO' },
  ],
  [COLLECTIONS.announcements]: [
    { id: 'a1', titulo: 'Semana de simulados', categoria: 'Acadêmico', publicadoEm: dateIn(-1), destaque: true, texto: 'Confira os horários das avaliações e organize seus momentos de estudo.' },
    { id: 'a2', titulo: 'Encontro de aprendizagem cooperativa', categoria: 'Comunidade', publicadoEm: dateIn(-3), destaque: false, texto: 'Na sexta-feira, teremos atividades de integração entre as células de estudo.' },
  ],
}

export function useCollection(key) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : (SEEDS[key] ?? [])
    } catch {
      return SEEDS[key] ?? []
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items))
  }, [items, key])

  return [items, setItems]
}

export function novoId(prefixo) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function hojeISO() {
  return dateIn()
}

export function tarefasDoAluno(tasks, nome, groups = []) {
  const grupos = groups.filter((group) => group.integrantes.includes(nome)).map((group) => group.nome)
  return tasks.filter((task) => !task.alvo || task.alvo === 'Turma completa' || task.alvo === nome || grupos.includes(task.alvo))
}

export const dataCurta = (value) => dayjs(value).format('DD/MM')
