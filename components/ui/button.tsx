import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-cyan-400 to-violet-400 text-slate-950 shadow-glow hover:brightness-110',
  secondary:
    'border border-white/10 text-white/90 hover:bg-white/5',
  ghost: 'text-white/80 hover:text-white'
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
