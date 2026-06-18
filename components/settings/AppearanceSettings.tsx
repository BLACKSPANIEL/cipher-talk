'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Sliders, Sparkles } from 'lucide-react';

interface AppearanceSettingsProps {
  theme: 'dark' | 'light';
  glassIntensity: number;
  accentColor: string;
  onUpdate: (key: string, value: string | number) => void;
}

const ACCENT_COLORS = [
  { id: 'emerald', color: 'bg-emerald-400', label: 'Emerald' },
  { id: 'cyan', color: 'bg-cyan-400', label: 'Cyan' },
  { id: 'violet', color: 'bg-violet-400', label: 'Violet' },
  { id: 'amber', color: 'bg-amber-400', label: 'Amber' },
  { id: 'rose', color: 'bg-rose-400', label: 'Rose' },
];

export function AppearanceSettings({ theme, glassIntensity, accentColor, onUpdate }: AppearanceSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Theme Selection */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Тема оформления</h3>
            <p className="text-[10px] text-gray-500">Выберите светлую или тёмную тему</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onUpdate('theme', 'dark')}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              theme === 'dark'
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
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
            onClick={() => onUpdate('theme', 'light')}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              theme === 'light'
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
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
                <p className="text-[10px] text-gray-500">Скоро</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Glass Intensity Slider */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Интенсивность Glassmorphism</h3>
            <p className="text-[10px] text-gray-500">Настройте эффект размытия фона</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-white">Размытие фона</p>
                <p className="text-[10px] text-gray-500">Blur: {glassIntensity}px</p>
              </div>
            </div>
          </div>

          <div className="px-2">
            <input
              type="range"
              min="0"
              max="40"
              value={glassIntensity}
              onChange={(e) => onUpdate('glassIntensity', parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400"
              style={{
                background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${(glassIntensity / 40) * 100}%, rgba(255,255,255,0.1) ${(glassIntensity / 40) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-gray-600">0px</span>
              <span className="text-[10px] text-gray-600">40px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
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
              onClick={() => onUpdate('accentColor', color.id)}
              className={`relative p-3 rounded-xl border transition-all duration-200 ${
                accentColor === color.id
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${color.color} ${
                  accentColor === color.id ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-black' : ''
                }`} />
                <span className={`text-[10px] font-medium ${
                  accentColor === color.id ? 'text-emerald-400' : 'text-gray-400'
                }`}>
                  {color.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default AppearanceSettings;