import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * variant="green": borda verde (tela de Cadastro)
 * variant="white": campo branco com sombra, aceita icone a esquerda (tela de Login)
 */
const Input = React.forwardRef(({ className, variant = 'green', icon, type = 'text', ...props }, ref) => {
  const base =
    variant === 'white'
      ? 'h-12 w-full rounded-xl bg-white text-base shadow-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-prece-red'
      : 'h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base focus-visible:ring-2 focus-visible:ring-prece-green/40'

  const field = (
    <input
      ref={ref}
      type={type}
      className={cn(
        base,
        'outline-none disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'white' && (icon ? 'pl-14 pr-3' : 'px-3'),
        className,
      )}
      {...props}
    />
  )

  if (!icon) return field
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-prece-red">{icon}</span>
      {field}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
