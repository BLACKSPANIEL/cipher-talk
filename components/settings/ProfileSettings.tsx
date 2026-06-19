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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-8"
    >
      {/* Profile Card — двухколоночный */}
      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Профиль</h3>
            <p className="text-[10px] text-gray-500">Ваше публичное представление</p>
          </div>
        </div>

        {/* Two-column layout: avatar (left 1/3) + fields (right 2/3) */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {/* Left: Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div
              className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 transition-all duration-300 flex items-center justify-center shadow-[0_0_50px_rgba(16,245,181,0.25)] ${
                isDragging 
                  ? 'border-emerald-400 shadow-[0_0_70px_rgba(16,245,181,0.4)]' 
                  : 'border-emerald-500/20 hover:border-emerald-500/40'
              }`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-6xl">🎮</span>
                )}
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
                <Camera className="w-10 h-10 text-white" />
                <span className="text-[10px] text-white font-medium">{t('settings.upload_photo')}</span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="avatar-upload"
              />
            </div>
            {avatarPreview && (
              <button
                onClick={clearAvatar}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Удалить фото
              </button>
            )}
          </div>

          {/* Right: Fields */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Username */}
            <div>
              <label htmlFor="settings-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('settings.nickname')}
              </label>
              <input
                id="settings-username"
                type="text"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="settings-bio" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('settings.bio')}
              </label>
              <textarea
                id="settings-bio"
                value={localBio}
                onChange={(e) => setLocalBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
                rows={3}
                placeholder={t('settings.bio_placeholder')}
                maxLength={MAX_BIO_LENGTH}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm resize-none"
              />
              <div className="flex justify-between mt-1.5">
                <p className="text-[10px] text-gray-500">{t('settings.bio_limit').replace('{max}', String(MAX_BIO_LENGTH))}</p>
                <p className={`text-[10px] ${localBio.length >= MAX_BIO_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                  {localBio.length}/{MAX_BIO_LENGTH}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emoji Grid — на всю ширину карточки */}
        <div className="w-full">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            {t('settings.avatar_presets')}
          </p>
          <div className="grid grid-cols-10 gap-3 w-full p-3 rounded-xl bg-black/30 border border-white/5">
            {['🧑','👨','👩','🧑‍💻','🧑‍🚀','🧑‍🎨','🦊','🐱','🐶','🐼','🦁','🐯','🐺','🦄','🐲','🤖','👾','🎮','🎲','💎','🔥','⚡','🌙','☀️','🍀','🎯','🚀','🛸','👻','🎭','🃏','😀','😂','🥰','😎'].map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => setAvatarPreview(emoji)}
                className="w-full aspect-square rounded-lg flex items-center justify-center text-lg hover:bg-white/5 transition active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status + Tier + Save Card */}
      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
        {/* Status Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            {t('settings.status')}
          </label>
          <div className="grid grid-cols-2 gap-3 w-full">
            {STATUS_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setLocalStatus(option.value)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-sm transition-all duration-200 ${
                  localStatus === option.value
                    ? `border-${option.color}-500/40 bg-${option.color}-500/10 text-${option.color}-400`
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{option.emoji}</span>
                <div className="text-left flex-1">
                  <p className="font-medium">{t(option.labelKey as any)}</p>
                </div>
                {localStatus === option.value && (
                  <div className={`w-2 h-2 rounded-full bg-${option.color}-500`} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ELITE Tier Badge */}
        {tier && tier !== 'free' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <Crown className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-amber-400">{t('settings.tier')} {tier.toUpperCase()}</p>
                <TierBadge tier={tier as any} size="sm" />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">{t('settings.tier_desc')}</p>
            </div>
          </div>
        )}

        {/* Save Message */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
              saveMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {saveMessage.type === 'success' && <Check className="w-4 h-4" />}
            {saveMessage.text}
          </motion.div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('settings.saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('settings.save_changes')}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default ProfileSettings;