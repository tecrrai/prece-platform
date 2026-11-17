import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { listarEventos } from '@/api/eventos'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WEEKDAYS, buildMonth, groupByDate, tituloDoMes } from './calendarUtils'

const MAX_CHIPS = 2

export default function MonthCalendar({ reloadKey = 0 }) {
  const [month, setMonth] = useState(() => dayjs().startOf('month'))
  const [eventos, setEventos] = useState([])
  const [erro, setErro] = useState(false)

  // Carrega os eventos do mes visivel (mesma ideia do calendario semanal do projeto original)
  useEffect(() => {
    let cancelado = false
    setErro(false)
    listarEventos(month.format('YYYY-MM-DD'), month.endOf('month').format('YYYY-MM-DD'))
      .then((data) => !cancelado && setEventos(data))
      .catch(() => {
        if (!cancelado) {
          setEventos([])
          setErro(true)
        }
      })
    return () => {
      cancelado = true
    }
  }, [month, reloadKey])

  const { days, offset } = useMemo(() => buildMonth(month), [month])
  const porData = useMemo(() => groupByDate(eventos), [eventos])

  return (
    <section aria-labelledby="calendario-titulo">
      <h1 id="calendario-titulo" className="flex items-center gap-3 text-2xl font-bold text-prece-red">
        <CalendarDays className="h-6 w-6" aria-hidden="true" />
        Calendário
      </h1>

      <div className="mt-6 flex items-center gap-3">
        <Button size="sm" onClick={() => setMonth(dayjs().startOf('month'))}>
          Hoje
        </Button>
        <Button variant="ghost" size="icon" aria-label="Mês anterior" onClick={() => setMonth((m) => m.subtract(1, 'month'))}>
          <ChevronLeft className="h-5 w-5 text-neutral-900" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Próximo mês" onClick={() => setMonth((m) => m.add(1, 'month'))}>
          <ChevronRight className="h-5 w-5 text-neutral-900" />
        </Button>
        <h2 className="text-2xl font-bold text-neutral-400" aria-live="polite">
          {tituloDoMes(month)}
        </h2>
      </div>

      {erro && (
        <p role="alert" className="mt-3 text-sm text-prece-red">
          Não foi possível carregar os eventos deste mês.
        </p>
      )}

      <div className="mt-4 overflow-x-auto">
        <div className="grid grid-cols-7 border border-prece-red-soft bg-white shadow-sm">
          {WEEKDAYS.map((nome) => (
            <div key={nome} aria-label={nome} className="border border-prece-red-soft px-0.5 py-2 text-center text-[10px] font-bold text-prece-red sm:px-2 sm:py-3 sm:text-sm">
              <span className="sm:hidden">{nome.slice(0, 1)}</span><span className="hidden sm:inline">{nome}</span>
            </div>
          ))}

          {days.map((d, i) => {
            const doDia = porData[d.date] ?? []
            return (
              <div
                key={d.date}
                data-testid={`dia-${d.date}`}
                style={i === 0 ? { gridColumnStart: offset + 1 } : undefined}
                className="flex min-h-[62px] flex-col items-center gap-0.5 border border-prece-red-soft p-0.5 sm:min-h-[96px] sm:gap-1 sm:p-2"
              >
                <span
                  className={cn(
                    'mt-1 text-xs font-bold text-neutral-600 sm:mt-3 sm:text-lg',
                    d.isToday && 'rounded-full bg-prece-red px-2.5 py-0.5 text-white',
                  )}
                  aria-current={d.isToday ? 'date' : undefined}
                >
                  {d.label}
                </span>

                {doDia.slice(0, MAX_CHIPS).map((ev) => (
                  <div key={ev.id} className="flex w-full justify-center sm:block">
                    <span className="h-1.5 w-1.5 rounded-full bg-prece-green sm:hidden" aria-label={ev.titulo} title={ev.titulo} />
                    <span title={ev.titulo} className="hidden w-full truncate rounded-full bg-prece-green-soft px-2 py-0.5 text-center text-xs font-semibold text-prece-green-ink sm:block">{ev.titulo}</span>
                  </div>
                ))}
                {doDia.length > MAX_CHIPS && (
                  <span className="text-xs font-medium text-neutral-500">+{doDia.length - MAX_CHIPS} mais</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
