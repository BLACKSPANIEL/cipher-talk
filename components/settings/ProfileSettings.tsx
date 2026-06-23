'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, Loader2, Crown, Check, User, X } from 'lucide-react';
import { TierBadge } from '@/components/chat/TierBadge';
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

const STATUS_OPTIONS = [
  { value: 'online', labelKey: 'settings.status.online', emoji: '🟢', color: 'emerald', descKey: 'settings.status.online' },
  { value: 'ingame', labelKey: 'settings.status.ingame', emoji: '🎮', color: 'violet', descKey: 'settings.status.ingame' },
  { value: 'dnd', labelKey: 'settings.status.dnd', emoji: '🔴', color: 'red', descKey: 'settings.status.dnd' },
  { value: 'custom', labelKey: 'settings.status.custom', emoji: '✨', color: 'amber', descKey: 'settings.status.custom' },
];

const MAX_BIO_LENGTH = 150;

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
  const [localUsername, setLocalUsername] = useState(username);
  const [localBio, setLocalBio] = useState(bio);
  const [localStatus, setLocalStatus] = useState(status);
  const [customStatus, setCustomStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(localUsername, localBio, localStatus);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
  };

  const getStatusColorClasses = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
      emerald: {
        border: isSelected ? 'border-emerald-500/50' : 'border-white/10',
        bg: isSelected ? 'bg-emerald-500/10' : 'bg-black/40',
        text: isSelected ? 'text-emerald-400' : 'text-gray-400',
        dot: 'bg-emerald-500',
      },
      violet: {
        border: isSelected ? 'border-violet-500/50' : 'border-white/10',
        bg: isSelected ? 'bg-violet-500/10' : 'bg-black/40',
        text: isSelected ? 'text-violet-400' : 'text-gray-400',
        dot: 'bg-violet-500',
      },
      red: {
        border: isSelected ? 'border-red-500/50' : 'border-white/10',
        bg: isSelected ? 'bg-red-500/10' : 'bg-black/40',
        text: isSelected ? 'text-red-400' : 'text-gray-400',
        dot: 'bg-red-500',
      },
      amber: {
        border: isSelected ? 'border-amber-500/50' : 'border-white/10',
        bg: isSelected ? 'bg-amber-500/10' : 'bg-black/40',
        text: isSelected ? 'text-amber-400' : 'text-gray-400',
        dot: 'bg-amber-500',
      },
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      {/* Profile Card — двухколоночный */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Профиль</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ваше публичное представление в сети</p>
          </div>
        </div>

        {/* Two-column layout: avatar (left 1/3) + fields (right 2/3) */}
        <div className="grid grid-cols-3 gap-8 w-full items-start">
          {/* Left: Avatar */}
          <div className="flex flex-col items-center gap-5">
            <motion.div
              className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 transition-all duration-300 flex items-center justify-center shadow-[0_0_60px_rgba(16,245,181,0.25)] ${
                isDragging 
                  ? 'border-emerald-400 shadow-[0_0_80px_rgba(16,245,181,0.4)] scale-105' 
                  : 'border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_70px_rgba(16,245,181,0.35)]'
              }`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-7xl">🎮</span>
                )}
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                <Camera className="w-12 h-12 text-white" />
                <span className="text-xs text-white font-medium">{t('settings.upload_photo')}</span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="avatar-upload"
              />
            </motion.div>
            {avatarPreview && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={clearAvatar}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
              >
                <X className="w-3 h-3" />
                Удалить фото
              </motion.button>
            )}
          </div>

          {/* Right: Fields */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Username */}
            <div>
              <label htmlFor="settings-username" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t('settings.nickname')}
              </label>
              <input
                id="settings-username"
                type="text"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="settings-bio" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t('settings.bio')}
              </label>
              <textarea
                id="settings-bio"
                value={localBio}
                onChange={(e) => setLocalBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
                rows={3}
                placeholder={t('settings.bio_placeholder')}
                maxLength={MAX_BIO_LENGTH}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm resize-none"
              />
              <div className="flex justify-between mt-2.5">
                <p className="text-[10px] text-gray-500">{t('settings.bio_limit').replace('{max}', String(MAX_BIO_LENGTH))}</p>
                <p className={`text-[10px] font-medium ${localBio.length >= MAX_BIO_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                  {localBio.length}/{MAX_BIO_LENGTH}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emoji Grid — на всю ширину карточки */}
        <div className="w-full">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t('settings.avatar_presets')}
          </p>
          <div className="grid grid-cols-10 gap-2.5 w-full p-4 rounded-2xl bg-black/30 border border-white/5">
            {['🧑','👨','👩','🧑‍💻','🧑‍🚀','🧑‍🎨','🦊','🐱','🐶','🐼','🦁','🐯','🐺','🦄','🐲','🤖','👾','🎮','🎲','💎','🔥','⚡','🌙','☀️','🍀','🎯','🚀','🛸','👻','🎭','🃏','😀','😂','🥰','😎'].map((emoji, index) => (
              <motion.button
                key={`${emoji}-${index}`}
                onClick={() => setAvatarPreview(emoji)}
                className="w-full aspect-square rounded-xl flex items-center justify-center text-xl hover:bg-white/5 transition active:scale-90"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Status + Tier + Save Card */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Status Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t('settings.status')}
          </label>
          <div className="grid grid-cols-2 gap-3 w-full">
            {STATUS_OPTIONS.map((option) => {
              const colorClasses = getStatusColorClasses(option.color, localStatus === option.value);
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalStatus(option.value)}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border text-sm transition-all duration-200 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.text}`}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <div className="text-left flex-1">
                    <p className="font-semibold">{t(option.labelKey as any)}</p>
                  </div>
                  {localStatus === option.value && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2.5 h-2.5 rounded-full ${colorClasses.dot} shadow-[0_0_10px_currentColor]`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ELITE Tier Badge */}
        {tier && tier !== 'free' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-amber-400">{t('settings.tier')} {tier.toUpperCase()}</p>
                <TierBadge tier={tier as any} size="sm" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{t('settings.tier_desc')}</p>
            </div>
          </motion.div>
        )}

        {/* Save Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className={`p-4 rounded-2xl text-sm flex items-center gap-3 ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {saveMessage.type === 'success' && <Check className="w-4 h-4" />}
              {saveMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button */}
        <motion.button
          type="submit"
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-sm hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_24px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_32px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2.5 relative overflow-hidden group"
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('settings.saving')}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t('settings.save_changes')}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProfileSettings;