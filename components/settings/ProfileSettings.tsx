'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Save, Sparkles, Shield, Bell, Palette, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Profile } from '@/lib/supabaseClient';

interface ProfileSettingsProps {
  profile: Profile | null;
  onProfileUpdated: (updated: Profile) => void;
}

export function ProfileSettings({ profile, onProfileUpdated }: ProfileSettingsProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState(profile?.username || '');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 800));
    onProfileUpdated({
      ...profile!,
      username,
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
    });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClasses =
    'w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-sm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      {/* Avatar Section — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <User className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Профиль</h3>
            <p className="text-xs text-gray-500 mt-1">Ваши личные данные и аватар</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,245,181,0.2)] overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {username?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-2 border-[#0a0f17] flex items-center justify-center shadow-lg"
            >
              <Camera className="w-4 h-4 text-black" />
            </motion.button>
          </div>

          {/* Fields */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Отображаемое имя
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ваше имя"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            О себе
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите о себе..."
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>

      {/* Save Button — Premium */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-base hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 40px rgba(16,245,181,0.3)' }}
      >
        <AnimatePresence mode="wait">
          {isSaving ? (
            <motion.div
              key="saving"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Сохранение...
            </motion.div>
          ) : saved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Сохранено!
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Сохранить изменения
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}