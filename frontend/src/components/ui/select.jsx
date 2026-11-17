import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Select nativo (acessivel e compativel com react-hook-form) com o botao verde do prototipo. */
const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        'h-11 w-full appearance-none rounded-lg border-2 border-prece-green bg-white pl-3 pr-14 text-base outline-none focus-visible:ring-2 focus-visible:ring-prece-green/40 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-[6px] bg-prece-green text-white"
    >
      <ChevronDown className="h-5 w-5" />
    </span>
  </div>
))
Select.displayName = 'Select'

export { Select }
