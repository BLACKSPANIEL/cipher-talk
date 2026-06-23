'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Key, Trash2, Loader2 } from 'lucide-react';

interface AccountSettingsProps {
  username: string;
  email: string;
  onUpdate: (field: string, value: string) => Promise<void>;
}

export function AccountSettings({ username, email, onUpdate }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState(email);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveEmail = async () => {
    setIsSaving(true);
    await onUpdate('email', newEmail);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      {/* Account Info Card */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Информация об аккаунте</h3>
            <p className="text-xs text-gray-500 mt-1">Основные данные вашего аккаунта</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {/* Username */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Имя пользователя
            </label>
            <div className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-medium">
              {username}
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Email адрес
            </label>
            {isEditing ? (
              <div className="flex gap-3 w-full">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <motion.button
                  onClick={handleSaveEmail}
                  disabled={isSaving}
                  className="px-6 py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all text-sm font-bold disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
                </motion.button>
              </div>
            ) : (
              <motion.div 
                className="flex items-center justify-between w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4"
                whileHover={{ borderColor: 'rgba(16,245,181,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-white text-sm font-medium">{email}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                >
                  Изменить
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Безопасность</h3>
            <p className="text-xs text-gray-500 mt-1">Дополнительные опции защиты</p>
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
            <span className="text-xs text-gray-500 font-medium">Отключено</span>
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
            <span className="text-xs text-red-400 font-bold">Удалить</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default AccountSettings;