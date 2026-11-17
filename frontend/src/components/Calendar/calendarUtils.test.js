import dayjs from 'dayjs'
import { buildMonth, groupByDate, tituloDoMes } from './calendarUtils'

describe('calendarUtils', () => {
  it('monta novembro de 2026 (comeca no domingo, 30 dias)', () => {
    const { days, offset } = buildMonth(dayjs('2026-11-01'), dayjs('2026-11-08'))
    expect(days).toHaveLength(30)
    expect(offset).toBe(0)
    expect(days[0].label).toBe('1 nov')
    expect(days[1].label).toBe('2')
    expect(days.find((d) => d.isToday).date).toBe('2026-11-08')
  })

  it('calcula o deslocamento da primeira coluna', () => {
    // 1 de dezembro de 2026 e terca-feira
    expect(buildMonth(dayjs('2026-12-01')).offset).toBe(2)
  })

  it('nao marca "hoje" em outro mes', () => {
    const { days } = buildMonth(dayjs('2026-12-01'), dayjs('2026-11-08'))
    expect(days.some((d) => d.isToday)).toBe(false)
  })

  it('agrupa eventos por data', () => {
    const grupos = groupByDate([
      { id: '1', titulo: 'Finados', data: '2026-11-02' },
      { id: '2', titulo: 'Reuniao', data: '2026-11-02' },
      { id: '3', titulo: 'Proclamacao', data: '2026-11-15' },
    ])
    expect(grupos['2026-11-02']).toHaveLength(2)
    expect(grupos['2026-11-15']).toHaveLength(1)
  })

  it('formata o titulo do mes', () => {
    expect(tituloDoMes(dayjs('2026-11-01'))).toBe('Novembro de 2026')
  })
})
