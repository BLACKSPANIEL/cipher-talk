'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Key, Trash2, AlertTriangle, Check, Loader2, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabaseClient';

interface AccountSettingsProps {
  username?: string;
  email?: string;
  onUpdate?: (field: string, value: string) => Promise<void>;
}

export function AccountSettings({ username = '', email: initialEmail = 'user@ciphertalk.app', onUpdate }: AccountSettingsProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState(initialEmail);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleChangeEmail = async () => {
    setIsChangingEmail(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChangingEmail(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Email Settings */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center ring-1 ring-cyan-500/30"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
            <Mail className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Email</h3>
            <p className="text-xs text-zinc-500">Управление адресом электронной почты</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-2 font-medium">Текущий email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleChangeEmail}
            disabled={isChangingEmail}
            className="w-full py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isChangingEmail ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Отправка подтверждения...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Изменить email</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Password Settings */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center ring-1 ring-violet-500/30"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
            <Key className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Пароль</h3>
            <p className="text-xs text-zinc-500">Измените пароль для входа</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleChangePassword}
          disabled={isChangingPassword}
          className="w-full py-3 rounded-xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isChangingPassword ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              <span className="text-sm font-semibold text-violet-400">Отправка ссылки...</span>
            </>
          ) : (
            <>
              <Key className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">Изменить пароль</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl p-6 border border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-600/5 backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 30px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-white">Опасная зона</h3>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">Удалить аккаунт</h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Это действие необратимо. Все ваши данные, сообщения и медиафайлы будут удалены навсегда.
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-colors"
                >
                  Удалить аккаунт
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Indicator */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Сохранено!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl p-6 border border-red-500/30 bg-[#0a0f17] backdrop-blur-2xl max-w-sm w-full"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Удалить аккаунт?</h3>
                  <p className="text-xs text-zinc-400">Это необратимо</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mb-6">
                Все ваши данные будут удалены навсегда. Это действие нельзя отменить.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Отмена
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-400 transition-colors text-sm font-bold disabled:opacity-50"
                >
                  {isDeleting ? 'Удаление...' : 'Удалить'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}