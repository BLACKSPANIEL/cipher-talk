'use client';

import { motion } from 'framer-motion';
import { Shield, ArrowRight, Sparkles } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

interface HeroSectionProps {
  onOpenMessenger: () => void;
  onScrollToHowItWorks: () => void;
}

export function HeroSection({ onOpenMessenger, onScrollToHowItWorks }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-neon-green/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-neon-green/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-green/3 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Конфиденциальный мессенджер с открытым исходным кодом</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-neon-green via-green-300 to-neon-green bg-clip-text text-transparent">
              Cipher Talk
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Конфиденциальный мессенджер с открытым исходным кодом и сквозным шифрованием
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={onOpenMessenger}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-green text-black font-semibold text-lg hover:bg-neon-dark-green transition-all shadow-neon-glow-lg hover:shadow-neon-glow"
            >
              <span>Открыть мессенджер</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onScrollToHowItWorks}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-neon-green/40 text-neon-green font-semibold text-lg hover:border-neon-green hover:bg-neon-green/5 transition-all"
            >
              <Shield className="w-5 h-5" />
              <span>Узнать, как это работает</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-8"
          >
            {[
              { value: '100%', label: 'E2EE' },
              { value: '0', label: 'Логов' },
              { value: '∞', label: 'Приватность' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-neon-green/20 rounded-xl p-4 bg-surface-dark/30 backdrop-blur"
              >
                <div className="text-3xl font-bold text-neon-green">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}