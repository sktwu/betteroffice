import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-doc-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-doc-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-doc-primary text-doc-on-primary hover:bg-doc-primary-hover',
        destructive: 'bg-doc-error text-doc-on-primary hover:bg-doc-error',
        outline: 'border border-doc-border-input bg-doc-surface hover:bg-doc-bg-hover hover:text-doc-text',
        secondary: 'bg-doc-bg text-doc-text hover:bg-doc-bg-hover',
        ghost: 'hover:bg-doc-bg-hover hover:text-doc-text',
        link: 'text-doc-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
