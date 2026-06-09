'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, LogOut, Camera, Loader2, Check, Shield, Globe, Lock, Sparkles, Crown } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { TierBadge } from './TierBadge';
import { useLanguage, LOCALES, type Locale } from '@/lib/i18n';

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

type Tab = 'profile' | 'security' | 'language';

const tabsList: { value: Tab; key: 'settings.tab.profile' | 'settings.tab.security' | 'settings.tab.language'; icon: React.ReactNode }[] = [
  { value: 'profile', key: 'settings.tab.profile', icon: <UserIcon className="w-4 h-4" /> },
  { value: 'security', key: 'settings.tab.security', icon: <Shield className="w-4 h-4" /> },
  { value: 'language', key: 'settings.tab.language', icon: <Globe className="w-4 h-4" /> },
];

export function SettingsModal({ isOpen, onClose, profile, onProfileUpdated }: SettingsModalProps) {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

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
      setActiveTab('profile');
    }
  }, [isOpen, profile]);

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

  const handleSelectLocale = (l: Locale) => {
    setLocale(l);
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
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-glass-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white text-base tracking-wide">{t('settings.title')}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
                title="Закрыть"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 pt-4 border-b border-zinc-800/60 flex-shrink-0">
              {tabsList.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-t-xl border-b-2 transition ${
                      isActive
                        ? 'text-emerald-300 border-emerald-400 bg-zinc-800/30'
                        : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/30'
                    }`}
                  >
                    {tab.icon}
                    <span>{t(tab.key)}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 min-h-0">
              {activeTab === 'profile' && (
                <>
                  {/* Avatar */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t('settings.avatar')}</label>
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
                          {t('settings.upload_photo')}
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
                            {t('settings.remove_avatar')}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">{t('settings.avatar_presets')}</p>
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

                  {/* Nickname */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t('settings.nickname')}</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={t('settings.nickname_placeholder')}
                      className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-800/80 transition"
                    />
                  </div>

                  {/* Tier — read-only display */}
                  {profile && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t('settings.tier')}</label>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800/60">
                        <TierBadge tier={profile.tier ?? 'free'} size="md" />
                        <span className="text-xs text-zinc-500">{t('settings.tier_desc')}</span>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/60 transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                      <Check className="w-4 h-4" />
                    ) : null}
                    {isSaving ? t('common.saving') : saved ? t('common.saved') : t('common.save_changes')}
                  </button>
                </>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="px-4 py-5 rounded-2xl bg-zinc-800/40 border border-zinc-800/60">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-semibold text-white">E2EE</h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{t('settings.security_desc')}</p>
                  </div>
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
                    {isLoggingOut ? t('common.logging_out') : t('common.logout')}
                  </button>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">{t('settings.language_desc')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LOCALES.map((loc) => {
                      const isActive = locale === loc.value;
                      return (
                        <button
                          key={loc.value}
                          onClick={() => handleSelectLocale(loc.value)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition text-left ${
                            isActive
                              ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.20)]'
                              : 'border-zinc-800 bg-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800/60'
                          }`}
                        >
                          <span className="text-2xl">{loc.flag}</span>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isActive ? 'text-emerald-300' : 'text-white'}`}>{loc.label}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{loc.value}</p>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
