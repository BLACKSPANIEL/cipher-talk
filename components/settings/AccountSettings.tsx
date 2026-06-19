'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Key, Trash2 } from 'lucide-react';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-8"
    >
      {/* Account Info Card */}
      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Информация об аккаунте</h3>
            <p className="text-[10px] text-gray-500">Основные данные вашего аккаунта</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Username */}
          <div className="w-full">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Имя пользователя
            </label>
            <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
              {username}
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Email адрес
            </label>
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  onClick={handleSaveEmail}
                  disabled={isSaving}
                  className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all text-sm"
                >
                  {isSaving ? '...' : 'Сохранить'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-white text-sm">{email}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Изменить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Безопасность</h3>
            <p className="text-[10px] text-gray-500">Дополнительные опции защиты</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button className="flex items-center justify-between w-full p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Двухфакторная аутентификация</p>
                <p className="text-[10px] text-gray-500">Дополнительный уровень защиты</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Отключено</span>
          </button>

          <button className="flex items-center justify-between w-full p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-red-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Удалить аккаунт</p>
                <p className="text-[10px] text-gray-500">Безвозвратное удаление</p>
              </div>
            </div>
            <span className="text-xs text-red-400">Удалить</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AccountSettings;