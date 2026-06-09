'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, LogOut, Camera, Loader2, Check } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onProfileUpdated?: (profile: Profile) => void;
}

const PRESET_AVATARS = [
  '🧑', '👨', '👩', '🧑‍💻', '🧑‍🚀', '🧑‍🎨', '🧑‍🔬', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🐺', '🦄', '🐲',
  '🤖', '👾', '🎮', '🎲', '💎', '🔥', '⚡', '🌙', '☀️', '🍀', '🎯', '🚀', '🛸', '👻', '🎭', '🃏',
];

export function SettingsModal({ isOpen, onClose, profile, onProfileUpdated }: SettingsModalProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.username);
      setAvatar((profile as any).avatar_url || '');
      setSaved(false);
      setError(null);
    }
  }, [isOpen, profile]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!profile) return;
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('Nickname не может быть пустым');
      return;
    }
    setIsSaving(true);
    setError(null);
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ username: trimmed, avatar_url: avatar || null })
      .eq('id', profile.id)
      .select('*')
      .single();
    setIsSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    if (data && onProfileUpdated) onProfileUpdated(data as Profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Выберите изображение');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Файл больше 2 МБ');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/85 backdrop-blur-2xl shadow-glass-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-neon-green" />
                <h3 className="font-semibold text-white text-base">Настройки профиля</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 overflow-y-auto">
              {/* Avatar section */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Аватар</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {avatar ? (
                      avatar.startsWith('data:') || avatar.startsWith('http') ? (
                        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">{avatar}</span>
                      )
                    ) : (
                      <UserIcon className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-700/50 bg-zinc-800/40 text-zinc-200 hover:bg-zinc-800/70 hover:border-zinc-600 transition text-sm"
                    >
                      <Camera className="w-4 h-4" />
                      Загрузить фото
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    {avatar && (
                      <button
                        onClick={() => setAvatar('')}
                        className="w-full px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition"
                      >
                        Удалить аватар
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset emoji avatars */}
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Или выберите из эмодзи</p>
                  <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-zinc-800/30 border border-zinc-800/50 max-h-32 overflow-y-auto">
                    {PRESET_AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setAvatar(emoji)}
                        className={`text-xl w-8 h-8 rounded-lg flex items-center justify-center transition ${
                          avatar === emoji
                            ? 'bg-neon-green/20 ring-1 ring-neon-green/50'
                            : 'hover:bg-zinc-700/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nickname section */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ваш nickname"
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-neon-green/50 focus:bg-zinc-800/80 transition"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green/15 border border-neon-green/40 text-neon-green hover:bg-neon-green/25 hover:border-neon-green/60 transition-all text-sm font-medium disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <Check className="w-4 h-4" />
                ) : null}
                {isSaving ? 'Сохранение...' : saved ? 'Сохранено!' : 'Сохранить изменения'}
              </button>

              {/* Divider */}
              <div className="border-t border-zinc-800/60" />

              {/* Logout button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition text-sm font-medium disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {isLoggingOut ? 'Выход...' : 'Выйти из аккаунта'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
