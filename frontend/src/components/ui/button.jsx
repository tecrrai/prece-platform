import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-prece-cream disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        green: 'bg-prece-green text-white shadow hover:bg-prece-green-dark focus-visible:ring-prece-green',
        red: 'bg-prece-red text-white shadow-md hover:bg-prece-red-dark focus-visible:ring-prece-red',
        cancel: 'bg-prece-cancel text-white shadow hover:bg-red-600 focus-visible:ring-prece-cancel',
        outlineRed:
          'border-2 border-prece-red bg-transparent text-prece-red hover:bg-prece-red/10 focus-visible:ring-prece-red',
        ghost: 'text-prece-red hover:bg-prece-red/10',
      },
      size: {
        sm: 'min-h-11 px-4',
        default: 'min-h-11 px-5',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'green', size: 'default' },
  },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
