import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn('mb-1 block text-base text-neutral-900', className)} {...props} />
))
Label.displayName = 'Label'

export { Label }
