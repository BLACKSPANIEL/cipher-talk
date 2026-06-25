'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Sliders, Sparkles, Check, Eye, RotateCcw, ToggleLeft, Droplets, Zap, Layout } from 'lucide-react';
import { useSettingsStore, getThemeClass } from '@/stores/useSettingsStore';

interface AppearanceSettingsProps {
  onUpdate: (key: string, value: string | number | boolean) => void;
}

const ACCENT_COLORS = [
  { id: 'emerald', color: 'bg-emerald-400', label: 'Emerald', hex: '#10b981' },
  { id: 'cyan', color: 'bg-cyan-400', label: 'Cyan', hex: '#22d3ee' },
  { id: 'violet', color: 'bg-violet-400', label: 'Violet', hex: '#a78bfa' },
  { id: 'amber', color: 'bg-amber-400', label: 'Amber', hex: '#fbbf24' },
  { id: 'rose', color: 'bg-rose-400', label: 'Rose', hex: '#fb7185' },
  { id: 'blue', color: 'bg-blue-400', label: 'Blue', hex: '#60a5fa' },
  { id: 'purple', color: 'bg-purple-400', label: 'Purple', hex: '#c084fc' },
  { id: 'pink', color: 'bg-pink-400', label: 'Pink', hex: '#f472b6' },
  { id: 'orange', color: 'bg-orange-400', label: 'Orange', hex: '#fb923c' },
  { id: 'teal', color: 'bg-teal-400', label: 'Teal', hex: '#2dd4bf' },
];

function ToggleSwitch({ enabled, onChange, label, description, icon }: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <motion.button
        onClick={() => onChange(!enabled)}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
          enabled ? 'bg-emerald-500/30 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/10 border border-white/10'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={`absolute top-1 w-6 h-6 rounded-full ${enabled ? 'bg-emerald-400' : 'bg-gray-500'}`}
          animate={{ left: enabled ? 'calc(100% - 1.75rem)' : '0.25rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ boxShadow: enabled ? '0 0 10px rgba(16,245,181,0.5)' : 'none' }}
        />
      </motion.button>
    </div>
  );
}

export function AppearanceSettings({ onUpdate }: AppearanceSettingsProps) {
  const { theme, accentColor, glassIntensity, setTheme, setAccentColor, setGlassIntensity, resetSettings } = useSettingsStore();
  const [selectedColor, setSelectedColor] = useState(accentColor);
  const [customHex, setCustomHex] = useState('');
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);
  const [glassmorphicBackdrop, setGlassmorphicBackdrop] = useState(true);
  const [neonGlow, setNeonGlow] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setSelectedColor(accentColor);
  }, [accentColor]);

  const currentTheme = getThemeClass(theme, systemPrefersDark);

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    setCustomHex('');
    setAccentColor(colorId);
    onUpdate('accentColor', colorId);
  };

  const handleHexInput = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setAccentColor(hex);
      onUpdate('accentColor', hex);
    }
  };

  const getAccentGlow = () => {
    const color = ACCENT_COLORS.find(c => c.id === selectedColor);
    if (color) return color.hex;
    if (customHex && /^#[0-9A-F]{6}$/i.test(customHex)) return customHex;
    return '#10b981';
  };

  const accentGlow = getAccentGlow();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-6"
    >
      {/* Theme Selection Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
              <Palette className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Тема оформления</h3>
              <p className="text-xs text-gray-400 mt-1">Выберите светлую или тёмную тему</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${
            currentTheme === 'dark' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
          }`}>
            {currentTheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { id: 'dark', label: 'Тёмная', desc: 'Рекомендуется', icon: Moon, active: theme === 'dark' },
            { id: 'light', label: 'Светлая', desc: 'Чистая', icon: Sun, active: theme === 'light' },
            { id: 'system', label: 'Система', desc: 'Авто', icon: null, emoji: systemPrefersDark ? '🌙' : '☀️', active: theme === 'system' },
          ].map((option) => (
            <motion.button
              key={option.id}
              onClick={() => { setTheme(option.id as any); onUpdate('theme', option.id); }}
              className={`p-6 rounded-2xl border transition-all duration-200 w-full ${
                option.active
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  option.active ? 'bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5'
                }`}>
                  {option.icon ? (
                    <option.icon className={`w-7 h-7 ${option.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                  ) : (
                    <span className="text-3xl">{option.emoji}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${option.active ? 'text-emerald-400' : 'text-white'}`}>{option.label}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{option.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Visual Toggles Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <ToggleLeft className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Настройки интерфейса</h3>
            <p className="text-xs text-gray-400 mt-1">Управление визуальными эффектами</p>
          </div>
        </div>

        <div className="space-y-3">
          <ToggleSwitch
            enabled={glassmorphicBackdrop}
            onChange={(v) => { setGlassmorphicBackdrop(v); onUpdate('glassmorphicBackdrop', v); }}
            label="Размытие заднего плана (Glassmorphic Backdrop)"
            description="Эффект стекла и размытия фона"
            icon={<Droplets className="w-5 h-5" />}
          />
          <ToggleSwitch
            enabled={neonGlow}
            onChange={(v) => { setNeonGlow(v); onUpdate('neonGlow', v); }}
            label="Неоновое свечение элементов"
            description="Glow-эффекты вокруг активных элементов"
            icon={<Zap className="w-5 h-5" />}
          />
          <ToggleSwitch
            enabled={compactMode}
            onChange={(v) => { setCompactMode(v); onUpdate('compactMode', v); }}
            label="Компактный режим отображения чата"
            description="Уменьшенные отступы и более плотный интерфейс"
            icon={<Layout className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Glass Intensity Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <Sliders className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Интенсивность Glassmorphism</h3>
              <p className="text-xs text-gray-400 mt-1">Настройте эффект размытия фона</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-400">{glassIntensity}</p>
            <p className="text-[10px] text-gray-500">пикселей</p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="40"
              value={glassIntensity}
              onChange={(e) => { setGlassIntensity(parseInt(e.target.value)); onUpdate('glassIntensity', parseInt(e.target.value)); }}
              className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 relative z-10"
              style={{
                background: `linear-gradient(to right, rgb(34, 211, 238) 0%, rgb(34, 211, 238) ${(glassIntensity / 40) * 100}%, rgba(255,255,255,0.1) ${(glassIntensity / 40) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between mt-3">
              <span className="text-[10px] text-gray-600 font-medium">0px</span>
              <span className="text-[10px] text-gray-600 font-medium">40px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Color Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.15)]">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Акцентный цвет</h3>
            <p className="text-xs text-gray-400 mt-1">Выберите цвет интерфейса</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 w-full">
          {ACCENT_COLORS.map((color) => (
            <motion.button
              key={color.id}
              onClick={() => handleColorSelect(color.id)}
              className={`relative p-4 rounded-2xl border transition-all duration-200 w-full ${
                selectedColor === color.id
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_24px_rgba(16,185,129,0.4)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-3">
                <div 
                  className={`w-12 h-12 rounded-full ${color.color} transition-all ${
                    selectedColor === color.id ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-black scale-110' : ''
                  }`}
                  style={selectedColor === color.id ? { boxShadow: `0 0 24px ${color.hex}80, 0 0 48px ${color.hex}40` } : {}}
                />
                <span className={`text-[10px] font-bold ${selectedColor === color.id ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {color.label}
                </span>
              </div>
              {selectedColor === color.id && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-2 right-2"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 mt-6 w-full">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Или введите HEX-код</label>
          <div className="flex gap-3 w-full">
            <div className="flex-1 relative">
              <input
                type="text"
                value={customHex || (selectedColor.startsWith('#') ? selectedColor : '')}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#00FF9F"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <motion.button
              onClick={() => {
                if (customHex && /^#[0-9A-F]{6}$/i.test(customHex)) {
                  onUpdate('accentColor', customHex);
                }
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all text-sm font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Применить
            </motion.button>
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Eye className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Предпросмотр</h3>
            <p className="text-xs text-gray-400 mt-1">Как будет выглядеть интерфейс</p>
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl bg-black/40 border border-white/[0.1] backdrop-blur-xl w-full"
          style={{ boxShadow: `0 0 40px ${accentGlow}15, inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)` }}
        >
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentGlow}20` }}>
              <span className="text-lg">💬</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Чат</p>
              <p className="text-[10px] text-gray-500">В сети</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: `${accentGlow}30` }} />
              <div className="flex-1 p-3 rounded-xl border" style={{ backgroundColor: `${accentGlow}15`, borderColor: `${accentGlow}30` }}>
                <p className="text-xs font-medium" style={{ color: accentGlow }}>Привет! Как дела?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-300">Отлично, работаю над проектом!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <motion.button
        onClick={resetSettings}
        className="w-full py-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2.5 font-medium"
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <RotateCcw className="w-4 h-4" />
        Сбросить настройки по умолчанию
      </motion.button>
    </motion.div>
  );
}

export default AppearanceSettings;