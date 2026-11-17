import { Check, Clock3, MessageSquareText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeading({ eyebrow, title, description, action, icon: Icon }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-prece-green-ink">{eyebrow}</p>}
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {Icon && <Icon className="h-6 w-6 text-prece-red" aria-hidden="true" />}
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function MetricCard({ label, value, detail, icon: Icon, accent = 'red' }) {
  const colors = accent === 'green' ? 'bg-prece-green/10 text-prece-green-ink' : accent === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-prece-red/10 text-prece-red'
  return (
    <article className="prece-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-600">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{value}</p>
        </div>
        {Icon && <span className={cn('grid h-10 w-10 place-items-center rounded-xl', colors)}><Icon className="h-5 w-5" aria-hidden="true" /></span>}
      </div>
      {detail && <p className="mt-3 text-xs leading-5 text-neutral-500">{detail}</p>}
    </article>
  )
}

export function StatusBadge({ status }) {
  const config = {
    PENDENTE: { label: 'Pendente', className: 'bg-amber-100 text-amber-900', icon: Clock3 },
    ATRASADO: { label: 'Atrasada', className: 'bg-prece-red/10 text-prece-red', icon: Clock3 },
    ANDAMENTO: { label: 'Em andamento', className: 'bg-blue-100 text-blue-900', icon: Clock3 },
    CONCLUIDA: { label: 'Concluída', className: 'bg-prece-green-soft text-prece-green-ink', icon: Check },
    AGUARDANDO: { label: 'Aguardando validação', className: 'bg-amber-100 text-amber-900', icon: Clock3 },
    APROVADA: { label: 'Validada', className: 'bg-prece-green-soft text-prece-green-ink', icon: Check },
    RECUSADA: { label: 'Precisa de ajuste', className: 'bg-prece-red/10 text-prece-red', icon: X },
    ATIVA: { label: 'Ativa', className: 'bg-prece-green-soft text-prece-green-ink', icon: Check },
  }
  const item = config[status] ?? { label: status, className: 'bg-neutral-100 text-neutral-700', icon: MessageSquareText }
  const Icon = item.icon
  return <span className={cn('inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', item.className)}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{item.label}</span>
}

export function SectionCard({ title, description, action, children, className }) {
  return (
    <section className={cn('prece-surface p-4 sm:p-5', className)}>
      {(title || description || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="prece-section-title">{title}</h2>}
            {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 px-5 py-8 text-center">
      <p className="font-semibold text-neutral-800">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-neutral-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function TextField({ label, className, ...props }) {
  return (
    <label className={cn('block', className)}>
      <span className="prece-label">{label}</span>
      <input className="prece-field" {...props} />
    </label>
  )
}

export function SelectField({ label, children, className, ...props }) {
  return (
    <label className={cn('block', className)}>
      <span className="prece-label">{label}</span>
      <select className="prece-field" {...props}>{children}</select>
    </label>
  )
}

export function TextAreaField({ label, className, ...props }) {
  return (
    <label className={cn('block', className)}>
      <span className="prece-label">{label}</span>
      <textarea className="prece-field min-h-28 resize-y py-3" {...props} />
    </label>
  )
}
