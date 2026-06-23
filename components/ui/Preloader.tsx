'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Zap } from 'lucide-react';

interface PreloaderProps {
  isLoading: boolean;
}

export function Preloader({ isLoading }: PreloaderProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 bg-neutral-950 z-[9999] flex flex-col items-center justify-center"
        >
          {/* Ambient background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.08] blur-[120px]"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px]"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Main loader content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated logo/icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-emerald-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 w-20 h-20 rounded-full border border-cyan-500/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* Center icon */}
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center backdrop-blur-xl"
                style={{ boxShadow: '0 0 60px rgba(16,245,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 60px rgba(16,245,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    '0 0 80px rgba(16,245,181,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                    '0 0 60px rgba(16,245,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield className="w-10 h-10 text-emerald-400" />
              </motion.div>

              {/* Floating particles */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-emerald-400/60"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-2 h-2 rounded-full bg-cyan-400/60"
                animate={{ 
                  y: [0, 10, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--accent-color)] to-cyan-500 rounded-full"
                style={{ 
                  '--accent-color': 'var(--accent-color, #10b981)'
                } as React.CSSProperties}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            {/* Status text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.p
                className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Connecting to Cipher Network
              </motion.p>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-500/50" />
                <span className="text-[9px] text-zinc-600 font-mono">E2EE ACTIVE</span>
                <Zap className="w-3 h-3 text-cyan-500/50" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;