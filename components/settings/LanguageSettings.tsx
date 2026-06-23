'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export interface Locale {
  value: string;
  label: string;
  flag: string;
  nativeName: string;
}

export const LOCALES: Locale[] = [
  { value: 'ru', label: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { value: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { value: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { value: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { value: 'uk', label: 'Українська', flag: '🇺🇦', nativeName: 'Українська' },
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
  { value: 'la', label: 'Lingua Latina', flag: '🏛️', nativeName: 'Lingua Latina' },
  { value: 'ja', label: '日本語', flag: '🇯🇵', nativeName: '日本語' },
  { value: 'tt', label: 'Татарча', flag: '🇷🇺', nativeName: 'Татарча' },
];

interface LanguageSettingsProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguageSettings({ selectedLanguage, onLanguageChange }: LanguageSettingsProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <Globe className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Язык интерфейса</h3>
            <p className="text-xs text-gray-500 mt-1">Выберите предпочитаемый язык</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {LOCALES.map((locale) => {
            const isActive = selectedLanguage === locale.value;
            return (
              <motion.button
                key={locale.value}
                onClick={() => onLanguageChange(locale.value)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 text-left ${
                  isActive
                    ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_24px_rgba(16,185,129,0.15)]'
                    : 'border-white/[0.06] bg-black/20 hover:border-white/10 hover:bg-white/[0.02]'
                }`}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">{locale.flag}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                    {locale.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{locale.nativeName}</p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 text-black" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="w-full p-5 rounded-2xl bg-black/20 border border-white/5">
        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          Язык интерфейса изменится автоматически. Некоторые элементы могут обновляться с задержкой.
        </p>
      </div>
    </motion.div>
  );
}

export default LanguageSettings;