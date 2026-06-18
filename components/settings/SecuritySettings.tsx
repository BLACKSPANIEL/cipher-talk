'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, RefreshCw, Copy, CheckCircle, Shield, Monitor, Smartphone, Loader2 } from 'lucide-react';

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
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* E2EE Key Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Сквозное шифрование (E2EE)</h3>
            <p className="text-[10px] text-gray-500">Ваш секретный ключ AES-256</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Все сообщения шифруются на клиенте. Никто, кроме вас, не имеет доступа к содержимому.
          <br />
          <span className="text-yellow-400">⚠ Никому не сообщайте этот ключ.</span>
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Публичный ключ
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={e2eeKey}
                readOnly
                className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-cyan-400 font-mono text-xs focus:outline-none"
              />
              <button
                onClick={onCopyKey}
                className="px-4 py-3 rounded-lg border border-white/10 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
              >
                {keyCopied ? <CheckCircle className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={onGenerateNewKey}
            className="w-full py-3 rounded-xl border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Сгенерировать новый ключ
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Активные сессии</h3>
            <p className="text-[10px] text-gray-500">Устройства, где вы авторизованы</p>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                session.active
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'bg-white/[0.02] border-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  session.active ? 'bg-emerald-500/15' : 'bg-white/5'
                }`}>
                  {session.type === 'mobile' ? (
                    <Smartphone className={`w-6 h-6 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                  ) : (
                    <Monitor className={`w-6 h-6 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{session.device}</p>
                  <p className="text-[10px] text-gray-500">{session.os} · {session.location}</p>
                  <p className="text-[10px] text-gray-600">{session.time}</p>
                </div>
              </div>
              {session.active ? (
                <span className="px-3 py-1 rounded-lg text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Активна
                </span>
              ) : (
                <button className="px-3 py-1.5 rounded-lg text-[10px] font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                  Завершить
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 rounded-xl border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all duration-200">
          Завершить другие сессии
        </button>
      </div>
    </motion.div>
  );
}

export default SecuritySettings;