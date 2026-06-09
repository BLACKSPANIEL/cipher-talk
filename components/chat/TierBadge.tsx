'use client';

import { Sparkles, Crown } from 'lucide-react';

type Tier = 'free' | 'pro' | 'elite' | undefined;

interface TierBadgeProps {
  tier?: Tier;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const styles: Record<NonNullable<Tier>, { label: string; classes: string; icon: React.ReactNode }> = {
  free: {
    label: 'FREE',
    classes: 'border-zinc-700/60 bg-zinc-800/50 text-zinc-400',
    icon: null,
  },
  pro: {
    label: 'PRO',
    classes: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    icon: <Sparkles className="w-3 h-3" />,
  },
  elite: {
    label: 'ELITE',
    classes: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    icon: <Crown className="w-3 h-3" />,
  },
};

/** Neon tier badge — emerald for PRO, amber for ELITE. Read-only display. */
export function TierBadge({ tier, size = 'sm', showLabel = true }: TierBadgeProps) {
  const effective = (tier ?? 'free') as NonNullable<Tier>;
  const s = styles[effective];
  if (effective === 'free' && !showLabel) return null;

  const sizeClasses = size === 'md'
    ? 'px-2.5 py-1 text-xs'
    : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wider ${s.classes} ${sizeClasses}`}
      style={
        effective === 'pro'
          ? { boxShadow: '0 0 8px rgba(16,185,129,0.25)' }
          : effective === 'elite'
          ? { boxShadow: '0 0 8px rgba(245,158,11,0.30)' }
          : undefined
      }
    >
      {s.icon}
      {showLabel && s.label}
    </span>
  );
}
