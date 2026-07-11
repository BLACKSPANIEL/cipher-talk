'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Moon, Sun, Monitor, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

type ThemeMode = 'dark' | 'light' | 'system';
type AccentColor = 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose';

const accentColors = [
  { id: 'emerald', label: 'Изумрудный', value: '#10f5b5', gradient: 'from-emerald-400 to-emerald-600' },
  { id: 'cyan', label: 'Циан', value: '#06b6d4', gradient: 'from-cyan-400 to-cyan-600' },
  { id: 'violet', label: 'Фиолетовый', value: '#8b5cf6', gradient: 'from-violet-400 to-violet-600' },
  { id: 'amber', label: 'Янтарный', value: '#f59e0b', gradient: 'from-amber-400 to-amber-600' },
  { id: 'rose', label: 'Розовый', value: '#f43f5e', gradient: 'from-rose-400 to-rose-600' },
] as const;

interface AppearanceSettingsProps {
  onUpdate?: (key: string, value: string | number | boolean) => void;
}

export function AppearanceSettings({ onUpdate }: AppearanceSettingsProps) {
  const { t } = useLanguage();
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('emerald');
  const [fontSize, setFontSize] = useState(14);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    onUpdate?.('theme', theme);
    onUpdate?.('accentColor', accentColor);
    onUpdate?.('fontSize', fontSize);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Theme Mode */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center ring-1 ring-violet-500/30"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
            <Palette className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Тема оформления</h3>
            <p className="text-xs text-zinc-500">Выберите режим отображения</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Тёмная', icon: Moon, desc: 'Для ночи' },
            { id: 'light', label: 'Светлая', icon: Sun, desc: 'Для дня' },
            { id: 'system', label: 'Система', icon: Monitor, desc: 'Авто' },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = theme === mode.id;
            return (
              <motion.button
                key={mode.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(mode.id as ThemeMode)}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-violet-500/40 bg-violet-500/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-violet-400' : 'text-zinc-400'}`} />
                <div className="text-sm font-semibold text-white mb-0.5">{mode.label}</div>
                <div className="text-[10px] text-zinc-500">{mode.desc}</div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 mx-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center ring-1 ring-cyan-500/30"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Акцентный цвет</h3>
            <p className="text-xs text-zinc-500">Выберите основной цвет интерфейса</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {accentColors.map((color) => {
            const isActive = accentColor === color.id;
            return (
              <motion.button
                key={color.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccentColor(color.id)}
                className={`relative p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${color.gradient} mb-2`}
                  style={isActive ? { boxShadow: `0 0 20px ${color.value}40` } : undefined} />
                <div className="text-[10px] text-zinc-400 text-center font-medium">{color.label}</div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                  >
                    <Check className="w-2.5 h-2.5 text-black" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Font Size */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Размер шрифта</h3>
            <p className="text-xs text-zinc-500">Настройка читаемости</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-sm font-bold text-cyan-400">{fontSize}px</span>
          </div>
        </div>
        <input
          type="range"
          min="12"
          max="18"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((fontSize - 12) / 6) * 100}%, rgba(255,255,255,0.1) ${((fontSize - 12) / 6) * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-[10px] text-zinc-500">
          <span>Мелкий</span>
          <span>Средний</span>
          <span>Крупный</span>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-sm hover:from-violet-400 hover:to-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}
      >
        {isSaving ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Сохранение...
          </>
        ) : showSaved ? (
          <>
            <Check className="w-5 h-5" />
            Сохранено!
          </>
        ) : (
          'Сохранить настройки'
        )}
      </motion.button>
    </motion.div>
  );
}