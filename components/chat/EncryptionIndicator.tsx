'use client';

import { motion } from 'framer-motion';
import { Lock, Shield, Key, Check, AlertCircle } from 'lucide-react';

interface EncryptionIndicatorProps {
  type: 'e2ee' | 'encrypted' | 'decrypted' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function EncryptionIndicator({ type, size = 'md', showText = true }: EncryptionIndicatorProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variants = {
    e2ee: {
      icon: Shield,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'E2EE',
      glow: '0 0 15px rgba(16,245,181,0.4)',
    },
    encrypted: {
      icon: Lock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'Зашифровано',
      glow: '0 0 12px rgba(6,182,212,0.3)',
    },
    decrypted: {
      icon: Key,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'Расшифровано',
      glow: '0 0 12px rgba(139,92,246,0.3)',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'Ошибка',
      glow: '0 0 12px rgba(239,68,68,0.3)',
    },
  };

  const config = variants[type];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${config.border} ${config.bg}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className={`${sizeClasses[size]} ${config.color}`} style={{ filter: `drop-shadow(${config.glow})` }} />
      </motion.div>
      {showText && (
        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
          {config.text}
        </span>
      )}
    </div>
  );
}

// Animated lock for message bubbles
export function AnimatedLock({ isLocked = true }: { isLocked?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: isLocked ? 0 : 180 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className="inline-flex items-center justify-center"
    >
      {isLocked ? (
        <Lock className="w-3.5 h-3.5 text-emerald-400" style={{ filter: 'drop-shadow(0 0 8px rgba(16,245,181,0.5))' }} />
      ) : (
        <Key className="w-3.5 h-3.5 text-violet-400" style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5))' }} />
      )}
    </motion.div>
  );
}

// Security badge for chat header
export function SecurityBadge({ isE2ee = true }: { isE2ee?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
        isE2ee 
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
          : 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400'
      }`}
      style={{ boxShadow: isE2ee ? '0 0 20px rgba(16,245,181,0.15)' : 'none' }}
    >
      {isE2ee ? <Shield className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
      {isE2ee ? 'E2EE' : 'Защищён'}
    </motion.div>
  );
}