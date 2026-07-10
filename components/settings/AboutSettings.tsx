'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info, Heart, Github, ExternalLink, Shield, Zap, Sparkles, Globe, Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function AboutSettings() {
  const { t } = useLanguage();
  const features = [
    { icon: <Shield className="w-5 h-5" />, label: t('settings.about.feature1'), desc: t('settings.about.feature1_desc') },
    { icon: <Zap className="w-5 h-5" />, label: t('settings.about.feature2'), desc: t('settings.about.feature2_desc') },
    { icon: <Sparkles className="w-5 h-5" />, label: t('settings.about.feature3'), desc: t('settings.about.feature3_desc') },
    { icon: <Globe className="w-5 h-5" />, label: t('settings.about.feature4'), desc: t('settings.about.feature4_desc') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-6"
    >
      {/* About Card — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-6 md:p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.15)]">
            <Info className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{t('settings.about.title')}</h3>
            <p className="text-xs text-gray-400 mt-1">{t('settings.about.desc')}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          {t('settings.about.desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <motion.div 
              key={feature.label} 
              className="p-5 rounded-2xl bg-black/20 border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors flex-shrink-0">
                  <span className="text-emerald-400">{feature.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{feature.label}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Links Card — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-6 md:p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.15)]">
            <Heart className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{t('settings.about.links')}</h3>
            <p className="text-xs text-gray-400 mt-1">{t('settings.about.support')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <motion.a
            href="https://github.com/BLACKSPANIEL/cipher-talk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-black/20 border border-white/[0.06] hover:border-emerald-500/30 text-white font-bold text-sm transition-all duration-200 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5 text-emerald-400" />
            {t('settings.about.github')}
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          <motion.a
            href="https://github.com/BLACKSPANIEL/cipher-talk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-black/20 border border-white/[0.06] hover:border-pink-500/30 text-white font-bold text-sm transition-all duration-200 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5 text-pink-400" />
            {t('settings.about.support')}
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </div>
      </div>

      {/* Credits — Premium */}
      <div className="w-full p-6 rounded-2xl bg-black/20 border border-white/5 text-center">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          {t('settings.about.made_with')}<br />
          {t('settings.about.copyright')}
        </p>
      </div>
    </motion.div>
  );
}

export default AboutSettings;