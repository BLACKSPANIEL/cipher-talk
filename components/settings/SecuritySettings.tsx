'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, RefreshCw, Copy, CheckCircle, Shield, Monitor, Smartphone, Loader2 } from 'lucide-react';
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
      className="w-full flex flex-col gap-10"
    >
      {/* E2EE Key Section */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <KeyRound className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Сквозное шифрование (E2EE)</h3>
            <p className="text-xs text-gray-500 mt-1">Ваш секретный ключ AES-256</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          Все сообщения шифруются на клиенте. Никто, кроме вас, не имеет доступа к содержимому.
          <br />
          <span className="text-amber-400 font-medium">⚠ Никому не сообщайте этот ключ.</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Публичный ключ
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={e2eeKey}
                readOnly
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <motion.button
                onClick={onCopyKey}
                className="px-5 py-3.5 rounded-2xl border border-white/10 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {keyCopied ? <CheckCircle className="w-5 h-5 text-cyan-400" /> : <Copy className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          <motion.button
            onClick={onGenerateNewKey}
            className="w-full py-4 rounded-2xl border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-500/10 transition-all duration-200 flex items-center justify-center gap-2.5"
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Сгенерировать новый ключ
          </motion.button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.15)]">
            <Shield className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Активные сессии</h3>
            <p className="text-xs text-gray-500 mt-1">Устройства, где вы авторизованы</p>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${
                session.active
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'bg-white/[0.02] border-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  session.active ? 'bg-emerald-500/15' : 'bg-white/5'
                }`}>
                  {session.type === 'mobile' ? (
                    <Smartphone className={`w-7 h-7 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                  ) : (
                    <Monitor className={`w-7 h-7 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{session.device}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{session.os} · {session.location}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{session.time}</p>
                </div>
              </div>
              {session.active ? (
                <span className="px-4 py-2 rounded-xl text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Активна
                </span>
              ) : (
                <motion.button
                  className="px-4 py-2 rounded-xl text-[10px] font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Завершить
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.button
          className="w-full mt-2 py-4 rounded-2xl border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all duration-200"
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Завершить другие сессии
        </motion.button>
      </div>
    </motion.div>
  );
}

export default SecuritySettings;