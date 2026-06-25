'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Key, Trash2, Loader2, Check, AlertTriangle } from 'lucide-react';

interface AccountSettingsProps {
  username: string;
  email: string;
  onUpdate: (field: string, value: string) => Promise<void>;
}

export function AccountSettings({ username, email, onUpdate }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveEmail = async () => {
    setIsSaving(true);
    await onUpdate('email', newEmail);
    setIsSaving(false);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-6"
    >
      {/* Account Info Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Информация об аккаунте</h3>
            <p className="text-xs text-gray-400 mt-1">Основные данные вашего аккаунта</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {/* Username */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Имя пользователя
            </label>
            <div className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-medium backdrop-blur-sm">
              {username}
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Email адрес
            </label>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-3 w-full"
                >
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-sm"
                  />
                  <motion.button
                    onClick={handleSaveEmail}
                    disabled={isSaving}
                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all disabled:opacity-50 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : 'Сохранить'}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center justify-between w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm group hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-white text-sm font-medium">{email}</span>
                  </div>
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Изменить
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Безопасность</h3>
            <p className="text-xs text-gray-400 mt-1">Дополнительные опции защиты</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <motion.button 
            className="flex items-center justify-between w-full p-5 rounded-2xl bg-black/20 border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200 group"
            whileHover={{ scale: 1.01, x: 4 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                <Key className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Двухфакторная аутентификация</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Дополнительный уровень защиты</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium px-3 py-1.5 rounded-lg bg-white/5">Отключено</span>
          </motion.button>

          <motion.button 
            className="flex items-center justify-between w-full p-5 rounded-2xl bg-black/20 border border-white/[0.06] hover:border-red-500/30 transition-all duration-200 group"
            whileHover={{ scale: 1.01, x: 4 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/15 transition-colors">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Удалить аккаунт</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Безвозвратное удаление</p>
              </div>
            </div>
            <span className="text-xs text-red-400 font-bold px-3 py-1.5 rounded-lg bg-red-500/10">Удалить</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default AccountSettings;