'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Save, Sparkles, Upload, Trash2, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Profile } from '@/lib/supabaseClient';

interface ProfileSettingsProps {
  profile: Profile | null;
  onProfileUpdated: (updated: Profile) => void;
}

const EMOJIS = ['😀','😎','🚀','💻','🎮','🔥','💎','🌟','🌈','⚡','🦊','🐉','🦋','🌺','🍀','🎯','🏆','💪','🧠','👑','🎵','🎨','📸','🌊','🍕','🧊','🪐','⚔️','🛡️','🧩','🎭','📡','🔮','💿','🕹️','🎸','🥋','🏄','🧘','🎪'];

export function ProfileSettings({ profile, onProfileUpdated }: ProfileSettingsProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState(profile?.username || '');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('😎');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveAvatar = useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onProfileUpdated({
      ...profile!,
      username,
      display_name: displayName,
      bio,
      avatar_url: avatarPreview || avatarUrl,
    });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const displayAvatar = avatarPreview || avatarUrl || null;

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
      {/* Avatar Section with Drag & Drop */}
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

        <div className="flex flex-col sm:flex-row items-start gap-8">
          {/* Avatar with Drag & Drop Zone */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-32 h-32 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_40px_rgba(16,245,181,0.3)]'
                  : displayAvatar
                    ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/30 to-cyan-500/20'
                    : 'border-white/20 bg-white/[0.03] hover:border-emerald-500/30 hover:bg-emerald-500/5'
              }`}
              style={displayAvatar ? { boxShadow: '0 0 30px rgba(16,245,181,0.2)' } : {}}
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover rounded-[22px]" />
              ) : isDragOver ? (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Drop here</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8 text-gray-500" />
                  <span className="text-[9px] text-gray-500 font-medium text-center px-2">Drag & drop or click</span>
                </div>
              )}

              {/* Remove button */}
              {displayAvatar && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => { e.stopPropagation(); handleRemoveAvatar(); }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 border-2 border-[#0a0f17] flex items-center justify-center shadow-lg hover:bg-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            
            <div className="mt-3 text-center sm:text-left">
              <p className="text-[10px] text-gray-500">PNG, JPG, WEBP</p>
              <p className="text-[10px] text-gray-600">Max 5MB</p>
            </div>
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

        {/* Emoji Picker */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Выберите эмодзи статуса
          </label>
          <div ref={emojiGridRef} className="grid grid-cols-10 gap-2">
            {EMOJIS.map((emoji) => (
              <motion.button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,245,181,0.3)] scale-110'
                    : 'bg-white/[0.03] border border-transparent hover:bg-white/[0.06] hover:scale-105'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {emoji}
              </motion.button>
            ))}
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
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
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

export default ProfileSettings;