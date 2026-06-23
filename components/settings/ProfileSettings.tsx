'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Loader2, Check, Crown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface ProfileSettingsProps {
  username: string;
  bio: string;
  status: string;
  tier?: string;
  onSave: (username: string, bio: string, status: string) => Promise<void>;
  isSaving: boolean;
  saveMessage: { type: 'success' | 'error'; text: string } | null;
}

export function ProfileSettings({
  username,
  bio,
  status,
  tier,
  onSave,
  isSaving,
  saveMessage,
}: ProfileSettingsProps) {
  const { t } = useLanguage();
  const [editUsername, setEditUsername] = useState(username);
  const [editBio, setEditBio] = useState(bio);
  const [editStatus, setEditStatus] = useState(status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(editUsername, editBio, editStatus);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      {/* Profile Card — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Профиль</h3>
            <p className="text-xs text-gray-500 mt-1">Управление личной информацией</p>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
          >
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_60px_rgba(16,245,181,0.3)]"
              style={{ boxShadow: '0 0 60px rgba(16,245,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
            >
              <User className="w-14 h-14 text-emerald-400" />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <p className="text-xs text-gray-500 mt-3">Нажмите для смены аватара</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Имя пользователя
            </label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Статус
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="online">🟢 Online</option>
              <option value="away">🟡 Away</option>
              <option value="busy">🔴 Busy</option>
              <option value="offline">⚫ Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              О себе
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              placeholder="Расскажите о себе..."
            />
          </div>

          {/* Save Button */}
          <motion.button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 0 30px rgba(16,245,181,0.3)' }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Сохранить изменения
              </>
            )}
          </motion.button>

          {/* Success Message */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-2xl ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {saveMessage.type === 'success' && <Check className="w-5 h-5" />}
              <p className="text-sm font-medium">{saveMessage.text}</p>
            </motion.div>
          )}
        </form>
      </div>

      {/* Tier Badge Card (if premium) */}
      {tier && tier !== 'free' && (
        <div className="w-full bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(251,191,36,0.15)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-400">Premium аккаунт</p>
              <p className="text-xs text-gray-400 mt-1">Все функции разблокированы</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ProfileSettings;