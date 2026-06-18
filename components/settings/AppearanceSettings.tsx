'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Sliders, Sparkles, Check, Eye, RotateCcw } from 'lucide-react';
import { useSettingsStore, getThemeClass } from '@/stores/useSettingsStore';

interface AppearanceSettingsProps {
  onUpdate: (key: string, value: string | number) => void;
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

export function AppearanceSettings({ onUpdate }: AppearanceSettingsProps) {
  const { theme, accentColor, glassIntensity, setTheme, setAccentColor, setGlassIntensity, resetSettings } = useSettingsStore();
  const [selectedColor, setSelectedColor] = useState(accentColor);
  const [customHex, setCustomHex] = useState('');
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Theme Selection */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Тема оформления</h3>
              <p className="text-[10px] text-gray-500">Выберите светлую или тёмную тему</p>
            </div>
          </div>
          
          {/* Current theme indicator */}
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            currentTheme === 'dark' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}>
            {currentTheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => { setTheme('dark'); onUpdate('theme', 'dark'); }}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              theme === 'dark'
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : 'border-white/10 bg-black/40 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-white/5'
              }`}>
                <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-white'}`}>
                  Тёмная
                </p>
                <p className="text-[10px] text-gray-500">Рекомендуется</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setTheme('light'); onUpdate('theme', 'light'); }}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              theme === 'light'
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : 'border-white/10 bg-black/40 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'light' ? 'bg-emerald-500/20' : 'bg-white/5'
              }`}>
                <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${theme === 'light' ? 'text-emerald-400' : 'text-white'}`}>
                  Светлая
                </p>
                <p className="text-[10px] text-gray-500">Чистая</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setTheme('system'); onUpdate('theme', 'system'); }}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              theme === 'system'
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : 'border-white/10 bg-black/40 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'system' ? 'bg-emerald-500/20' : 'bg-white/5'
              }`}>
                <span className="text-2xl">{systemPrefersDark ? '🌙' : '☀️'}</span>
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${theme === 'system' ? 'text-emerald-400' : 'text-white'}`}>
                  Система
                </p>
                <p className="text-[10px] text-gray-500">Авто</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Glass Intensity Slider */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Интенсивность Glassmorphism</h3>
              <p className="text-[10px] text-gray-500">Настройте эффект размытия фона</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-cyan-400">{glassIntensity}px</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="40"
              value={glassIntensity}
              onChange={(e) => { setGlassIntensity(parseInt(e.target.value)); onUpdate('glassIntensity', parseInt(e.target.value)); }}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400"
              style={{
                background: `linear-gradient(to right, rgb(34, 211, 238) 0%, rgb(34, 211, 238) ${(glassIntensity / 40) * 100}%, rgba(255,255,255,0.1) ${(glassIntensity / 40) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-gray-600">0px</span>
              <span className="text-[10px] text-gray-600">40px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Color Picker */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Акцентный цвет</h3>
            <p className="text-[10px] text-gray-500">Выберите цвет интерфейса</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color.id)}
              className={`relative p-3 rounded-xl border transition-all duration-200 ${
                selectedColor === color.id
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full ${color.color} ${
                    selectedColor === color.id ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={selectedColor === color.id ? { boxShadow: `0 0 20px ${color.hex}80` } : {}}
                />
                <span className={`text-[10px] font-medium ${
                  selectedColor === color.id ? 'text-emerald-400' : 'text-gray-400'
                }`}>
                  {color.label}
                </span>
              </div>
              {selectedColor === color.id && (
                <div className="absolute top-1 right-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Hex Color Input */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <label className="block text-xs text-gray-400 mb-2">Или введите HEX-код</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customHex || (selectedColor.startsWith('#') ? selectedColor : '')}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="#00FF9F"
              className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => {
                if (customHex && /^#[0-9A-F]{6}$/i.test(customHex)) {
                  onUpdate('accentColor', customHex);
                }
              }}
              className="px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all text-sm"
            >
              Применить
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Предпросмотр</h3>
            <p className="text-[10px] text-gray-500">Как будет выглядеть интерфейс</p>
          </div>
        </div>

        {/* Mini Chat Preview with dynamic accent color */}
        <div 
          className="p-4 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-xl"
          style={{ 
            boxShadow: `0 0 30px ${accentGlow}15, inset 0 1px 0 rgba(255,255,255,0.05)` 
          }}
        >
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${accentGlow}20` }}
            >
              <span className="text-sm">💬</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">Чат</p>
              <p className="text-[10px] text-gray-500">В сети</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div 
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: `${accentGlow}30` }}
              />
              <div 
                className="flex-1 p-2 rounded-lg border"
                style={{ 
                  backgroundColor: `${accentGlow}15`,
                  borderColor: `${accentGlow}30`
                }}
              >
                <p className="text-[10px]" style={{ color: accentGlow }}>Привет! Как дела?</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-300">Отлично, работаю над проектом!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetSettings}
        className="w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Сбросить настройки по умолчанию
      </button>
    </motion.div>
  );
}

export default AppearanceSettings;