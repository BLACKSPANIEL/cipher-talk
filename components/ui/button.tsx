import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-neon-green hover:bg-neon-dark-green text-black font-semibold shadow-neon-glow-lg hover:shadow-neon-glow',
  secondary:
    'border border-neon-green/40 text-neon-green hover:border-neon-green hover:bg-neon-green/5',
  ghost: 'text-white/80 hover:text-white'
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/60',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
