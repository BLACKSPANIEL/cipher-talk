'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

interface LanguageSettingsProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { id: 'ru', label: 'Русский', native: 'Русский' },
  { id: 'en', label: 'English', native: 'English' },
  { id: 'de', label: 'Deutsch', native: 'Deutsch' },
  { id: 'fr', label: 'Français', native: 'Français' },
  { id: 'es', label: 'Español', native: 'Español' },
  { id: 'zh', label: '中文', native: '中文' },
];

export function LanguageSettings({
  selectedLanguage,
  onLanguageChange,
}: LanguageSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Язык / Language</h3>
            <p className="text-[10px] text-gray-500">Выбор локализации</p>
          </div>
        </div>

        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                selectedLanguage === lang.id
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-white/[0.06] hover:border-white/10'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🌐</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{lang.native}</p>
                  <p className="text-[10px] text-gray-500">{lang.label}</p>
                </div>
              </div>
              {selectedLanguage === lang.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default LanguageSettings;