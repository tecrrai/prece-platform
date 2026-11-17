import dayjs from 'dayjs'

export const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export const tituloDoMes = (month) => `${MESES[month.month()]} de ${month.year()}`

/**
 * Dias do mes + deslocamento (0-6) da primeira coluna, comecando no domingo.
 * Cada dia: { date: 'YYYY-MM-DD', day, label, isToday }
 * O dia 1 recebe rotulo com mes ("1 nov"), como no prototipo.
 */
export function buildMonth(month, today = dayjs()) {
  const first = month.startOf('month')
  const total = first.daysInMonth()
  const todayStr = today.format('YYYY-MM-DD')

  const days = Array.from({ length: total }, (_, i) => {
    const d = first.add(i, 'day')
    const date = d.format('YYYY-MM-DD')
    return {
      date,
      day: i + 1,
      label: i === 0 ? `1 ${MESES_CURTOS[d.month()]}` : String(i + 1),
      isToday: date === todayStr,
    }
  })

  return { days, offset: first.day() }
}

/** { 'YYYY-MM-DD': [evento, ...] } */
export function groupByDate(eventos = []) {
  return eventos.reduce((acc, ev) => {
    const key = typeof ev.data === 'string' ? ev.data.slice(0, 10) : dayjs(ev.data).format('YYYY-MM-DD')
    ;(acc[key] ||= []).push(ev)
    return acc
  }, {})
}
