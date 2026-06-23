'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info, Heart, Github, ExternalLink, Shield, Zap, Sparkles } from 'lucide-react';

export function AboutSettings() {
  const features = [
    { icon: <Shield className="w-5 h-5" />, label: 'E2EE Шифрование', desc: 'AES-256 + XChaCha20' },
    { icon: <Zap className="w-5 h-5" />, label: 'Realtime', desc: 'Supabase Realtime' },
    { icon: <Sparkles className="w-5 h-5" />, label: 'Glassmorphism', desc: 'Премиум дизайн' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      {/* About Card */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.15)]">
            <Info className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">О Cipher Talk</h3>
            <p className="text-xs text-gray-500 mt-1">Версия 0.1.0</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          Cipher Talk — это премиальный мессенджер с сквозным шифрованием (E2EE), 
          созданный для тех, кто ценит приватность и безопасность. 
          Никаких логов, никаких компромиссов.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.label} className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                {feature.icon}
              </div>
              <p className="text-xs font-bold text-white mb-1">{feature.label}</p>
              <p className="text-[10px] text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.15)]">
            <Heart className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Поддержка проекта</h3>
            <p className="text-xs text-gray-500 mt-1">Star на GitHub помогает развитию</p>
          </div>
        </div>

        <motion.a
          href="https://github.com/BLACKSPANIEL/cipher-talk"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Github className="w-5 h-5" />
          GitHub Repository
          <ExternalLink className="w-4 h-4 opacity-50" />
        </motion.a>
      </div>

      {/* Credits */}
      <div className="w-full p-6 rounded-2xl bg-black/20 border border-white/5 text-center">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Сделано с <Heart className="w-3 h-3 inline text-pink-400" /> для приватности.<br />
          © 2024 CipherTalk. Open Source под MIT лицензией.
        </p>
      </div>
    </motion.div>
  );
}

export default AboutSettings;