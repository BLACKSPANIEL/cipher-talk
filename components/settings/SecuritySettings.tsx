'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Copy, RefreshCw, Check, AlertTriangle, Monitor, Smartphone, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface SecuritySettingsProps {
  e2eeKey: string;
  keyCopied: boolean;
  onGenerateNewKey: () => void;
  onCopyKey: () => void;
  sessions: Array<{
    id: number;
    device: string;
    os: string;
    location: string;
    time: string;
    active: boolean;
    type: 'desktop' | 'mobile';
  }>;
}

export function SecuritySettings({
  e2eeKey,
  keyCopied,
  onGenerateNewKey,
  onCopyKey,
  sessions,
}: SecuritySettingsProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-6"
    >
      {/* E2EE Key Card — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <Key className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">E2EE Ключ шифрования</h3>
            <p className="text-xs text-gray-400 mt-1">Ваш персональный ключ для сквозного шифрования</p>
          </div>
        </div>

        {/* Key Display */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Ваш ключ (AES-256)
          </label>
          <div className="relative">
            <div className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 font-mono text-xs text-emerald-400 break-all backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {e2eeKey || 'Загрузка...'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCopyKey}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              {keyCopied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Никогда не передавайте этот ключ третьим лицам
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGenerateNewKey}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200 flex items-center justify-center gap-2.5"
            style={{ boxShadow: '0 0 30px rgba(16,245,181,0.3)' }}
          >
            <RefreshCw className="w-4 h-4" />
            Сгенерировать новый ключ
          </motion.button>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-400 font-semibold mb-1">Внимание</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Генерация нового ключа приведёт к потере доступа к старым зашифрованным сообщениям.
              Убедитесь, что вы сохранили старый ключ.
            </p>
          </div>
        </div>
      </div>

      {/* Sessions Card — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Активные сессии</h3>
            <p className="text-xs text-gray-400 mt-1">Устройства, где вы авторизованы</p>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`relative p-4 rounded-2xl border transition-all duration-200 ${
                session.active
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,245,181,0.1)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  session.type === 'desktop'
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30'
                    : 'bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30'
                }`}>
                  {session.type === 'desktop' ? (
                    <Monitor className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Smartphone className="w-6 h-6 text-purple-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-white font-semibold truncate">{session.device}</p>
                    {session.active && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Активно
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{session.os} · {session.location}</p>
                  <p className="text-[11px] text-gray-600 mt-1">{session.time}</p>
                </div>

                {/* Action */}
                {!session.active && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
                  >
                    Завершить
                  </motion.button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}