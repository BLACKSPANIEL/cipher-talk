'use client';

import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

type Tier = 'free' | 'pro' | 'elite' | undefined;

interface TierBadgeProps {
  tier?: Tier;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

/** 
 * Красивый неоновый бейдж для тарифа 
 * FREE — серый, PRO — emerald, ELITE — amber/gold
 */
export function TierBadge({ 
  tier, 
  size = 'sm', 
  showLabel = true,
  className = '' 
}: TierBadgeProps) {
  
  const effectiveTier = (tier ?? 'free') as NonNullable<Tier>;

  const styles: Record<NonNullable<Tier>, { 
    label: string; 
    classes: string; 
    icon?: React.ReactNode;
    glow?: string;
  }> = {
    free: {
      label: 'FREE',
      classes: 'border-zinc-700/60 bg-zinc-900/80 text-zinc-400',
      icon: null,
      glow: 'none',
    },
    pro: {
      label: 'PRO',
      classes: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      glow: '0 0 12px rgba(16, 185, 129, 0.4)',
    },
    elite: {
      label: 'ELITE',
      classes: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
      icon: <Crown className="w-3.5 h-3.5" />,
      glow: '0 0 12px rgba(245, 158, 11, 0.5)',
    },
  };

  const s = styles[effectiveTier];

  const sizeClasses = size === 'md' 
    ? 'px-3 py-1 text-xs' 
    : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-semibold 
        uppercase tracking-wider transition-all duration-200
        ${s.classes} ${sizeClasses} ${className}
      `}
      style={{
        boxShadow: s.glow !== 'none' ? s.glow : undefined,
      }}
    >
      {s.icon}
      {showLabel && s.label}
    </span>
  );
}

// Экспорт по умолчанию для удобства
export default TierBadge;