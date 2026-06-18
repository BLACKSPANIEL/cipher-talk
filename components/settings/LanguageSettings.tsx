'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
];

interface LanguageSettingsProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguageSettings({ selectedLanguage, onLanguageChange }: LanguageSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-xl">🌍</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Язык интерфейса</h3>
            <p className="text-[10px] text-gray-500">Выберите предпочитаемый язык</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {LOCALES.map((locale) => {
            const isActive = selectedLanguage === locale.value;
            return (
              <motion.button
                key={locale.value}
                onClick={() => onLanguageChange(locale.value)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all text-left ${
                  isActive
                    ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'border-white/[0.06] bg-black/20 hover:border-white/10 hover:bg-white/[0.02]'
                }`}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl md:text-3xl">{locale.flag}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                    {locale.label}
                  </p>
                  <p className="text-[10px] text-gray-500">{locale.nativeName}</p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-black" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-xl bg-black/20 border border-white/5">
        <p className="text-[10px] text-gray-500 text-center">
          Язык интерфейса изменится автоматически. Некоторые элементы могут обновляться с задержкой.
        </p>
      </div>
    </motion.div>
  );
}

export default LanguageSettings;