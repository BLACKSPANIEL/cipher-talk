'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, LogOut, Camera, Loader2, Check, Shield, Globe, Lock, Monitor, Smartphone, Trash2, Settings, Bell, Palette, Info } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { TierBadge } from './TierBadge';
import { useLanguage, LOCALES } from '@/lib/i18n';
import { SettingsLayout, type SettingsTab } from '@/components/settings/SettingsLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { DevicesSettings } from '@/components/settings/DevicesSettings';
import { StorageSettings } from '@/components/settings/StorageSettings';
import { AboutSettings } from '@/components/settings/AboutSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onProfileUpdated?: (profile: Profile) => void;
}

const PRESET_AVATARS = [
  '🧑', '👨', '👩', '🧑‍💻', '🧑‍🚀', '🧑‍🎨', '🧑‍🔬', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🐺', '🦄', '🐲',
  '🤖', '👾', '🎮', '🎲', '💎', '🔥', '⚡', '🌙', '☀️', '🍀', '🎯', '🚀', '🛸', '👻', '🎭', '🃏',
  '😀', '😂', '🥰', '😎',
];


const tabsList = [
  { value: 'profile' as const, key: 'settings.tab.profile' as const, icon: <UserIcon className="w-4 h-4" /> },
  { value: 'account' as const, key: 'settings.tab.account' as const, icon: <UserIcon className="w-4 h-4" /> },
  { value: 'security' as const, key: 'settings.tab.security' as const, icon: <Shield className="w-4 h-4" /> },
  { value: 'notifications' as const, key: 'settings.tab.notifications' as const, icon: <Bell className="w-4 h-4" /> },
  { value: 'appearance' as const, key: 'settings.tab.appearance' as const, icon: <Palette className="w-4 h-4" /> },
  { value: 'language' as const, key: 'settings.tab.language' as const, icon: <Globe className="w-4 h-4" /> },
  { value: 'devices' as const, key: 'settings.tab.devices' as const, icon: <Monitor className="w-4 h-4" /> },
  { value: 'about' as const, key: 'settings.tab.about' as const, icon: <Info className="w-4 h-4" /> },
];

export function SettingsModal({ isOpen, onClose, profile, onProfileUpdated }: SettingsModalProps) {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.username);
      setAvatar((profile as { avatar_url?: string | null }).avatar_url || '');
      setSaved(false);
      setError(null);
      setActiveTab('profile');
      setSignedOutOthers(false);
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
      setError(t('settings.nickname_empty'));
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
      setError(t('settings.upload_photo'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File > 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSignOutOthers = async () => {
    setIsSigningOutOthers(true);
    try {
      await supabase.auth.signOut({ scope: 'others' });
      setSignedOutOthers(true);
    } catch {
      // ignore
    }
    setTimeout(() => setIsSigningOutOthers(false), 1000);
  };

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobileDevice = /Mobi|Android|iPhone/i.test(userAgent);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: '40%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '30%', scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-w-5xl h-[95vh] md:h-[90vh] md:rounded-2xl rounded-t-2xl border border-white/[0.08] bg-[#0e0f12]/95 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row"
          >
            <SettingsLayout
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as any)}
              username={profile?.username || ''}
              status="online"
              tier={profile?.tier}
              onLogout={handleLogout}
              isModal={true}
              onClose={onClose}
            >
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-5 md:space-y-6 scroll-smooth">
                {activeTab === 'profile' && (
                  <>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-3">
                        {t('settings.avatar')}
                      </label>
                      <div className="flex items-start gap-4 md:gap-5">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black/40 border border-emerald-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-[0_0_30px_rgba(16,245,181,0.15)]">
                          {avatar ? (
                            avatar.startsWith('data:') || avatar.startsWith('http') ? (
                              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-4xl md:text-5xl">{avatar}</span>
                            )
                          ) : (
                            <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 md:py-2.5 rounded-xl border border-white/10 bg-black/40 text-white hover:bg-white/5 hover:border-emerald-500/30 transition text-sm active:scale-[0.98]"
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
                      <div className="mt-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                          {t('settings.avatar_presets')}
                        </p>
                        <div className="grid grid-cols-8 gap-2 p-3 rounded-xl bg-black/30 border border-white/5 max-h-36 overflow-y-auto justify-items-center">
                          {PRESET_AVATARS.map((emoji, index) => (
                            <button
                              key={`${emoji}-${index}`}
                              onClick={() => setAvatar(emoji)}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition active:scale-90 ${
                                avatar === emoji 
                                  ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                  : 'hover:bg-white/5'
                              }`}
                            >
                              <span className="text-lg">{emoji}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                        {t('settings.nickname')}
                      </label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder={t('settings.nickname_placeholder')}
                        className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-3.5 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition"
                      />
                    </div>

                    {profile && (
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                          {t('settings.tier')}
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-amber-500/20">
                          <TierBadge tier={profile.tier ?? 'free'} size="md" />
                          <span className="text-xs text-zinc-500">{t('settings.tier_desc')}</span>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] active:scale-[0.98]"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
                      {isSaving ? t('common.saving') : saved ? t('common.saved') : t('common.save_changes')}
                    </button>
                  </>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-5 md:space-y-6">
                    <div className="px-4 md:px-5 py-5 rounded-2xl bg-black/30 border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-semibold text-white">E2EE End-to-End Encryption</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{t('settings.security_desc')}</p>
                    </div>

                    <div className="rounded-2xl bg-black/30 border border-white/5 overflow-hidden">
                      <div className="px-4 md:px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-sm font-semibold text-white">{t('settings.active_sessions')}</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1">{t('settings.sessions_desc')}</p>
                      </div>
                      <div className="p-4 md:p-5 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            {isMobileDevice ? (
                              <Smartphone className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Monitor className="w-5 h-5 text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-white font-medium">
                                {isMobileDevice ? t('chat.device_mobile') : t('chat.device_desktop')}
                              </p>
                              <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                {t('settings.session_current')}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono truncate">
                              {userAgent.slice(0, 60)}…
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleSignOutOthers}
                          disabled={isSigningOutOthers || signedOutOthers}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 active:scale-[0.98] ${
                            signedOutOthers
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                              : 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50'
                          }`}
                        >
                          {isSigningOutOthers ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : signedOutOthers ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          {isSigningOutOthers
                            ? t('settings.signing_out_others')
                            : signedOutOthers
                              ? t('settings.others_signed_out')
                              : t('settings.sign_out_others')}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition text-sm font-medium disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                      {isLoggingOut ? t('common.logging_out') : t('common.logout')}
                    </button>
                  </div>
                )}

                {activeTab === 'account' && (
                  <AccountSettings
                    username={profile?.username || ''}
                    email={(profile as { email?: string } | null)?.email || ''}
                    onUpdate={async (field, value) => {
                      if (!profile) return;
                      await supabase.from('profiles').update({ [field]: value }).eq('id', profile.id);
                      if (field === 'username' && onProfileUpdated && profile) {
                        onProfileUpdated({ ...profile, username: value as string });
                      }
                    }}
                  />
                )}

                {activeTab === 'notifications' && (
                  <NotificationsSettings
                    settings={{
                      pushNotifications: true,
                      soundEnabled: true,
                      messagePreview: true,
                      emailNotifications: false,
                    }}
                    onUpdate={(key, value) => console.log('Update notification:', key, value)}
                  />
                )}

                {activeTab === 'appearance' && (
                  <AppearanceSettings
                    onUpdate={(key, value) => console.log('Update appearance:', key, value)}
                  />
                )}

                {activeTab === 'language' && (
                  <div className="space-y-5">
                    <p className="text-xs text-gray-400 leading-relaxed">{t('settings.language_desc')}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {LOCALES.map((loc) => {
                        const isActive = locale === loc.value;
                        return (
                          <button
                            key={loc.value}
                            onClick={() => setLocale(loc.value)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all text-left active:scale-[0.98] ${
                              isActive
                                ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                : 'border-white/[0.06] bg-black/20 hover:border-white/10 hover:bg-white/[0.02]'
                            }`}
                          >
                            <span className="text-2xl md:text-3xl">{loc.flag}</span>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                                {loc.label}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{loc.value}</p>
                            </div>
                            {isActive && <Check className="w-5 h-5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'devices' && (
                  <DevicesSettings
                    devices={[
                      { id: '1', name: 'Windows Desktop', type: 'desktop', os: 'Windows 11', location: 'Москва, RU', lastActive: 'сейчас', isCurrent: true, isTrusted: true, ip: '192.168.1.1' },
                      { id: '2', name: 'Chrome Browser', type: 'desktop', os: 'Windows 11', location: 'Москва, RU', lastActive: '2 часа назад', isCurrent: false, isTrusted: true, ip: '192.168.1.2' },
                      { id: '3', name: 'iPhone 15 Pro', type: 'mobile', os: 'iOS 17', location: 'Санкт-Петербург, RU', lastActive: '1 день назад', isCurrent: false, isTrusted: false, ip: '192.168.1.3' },
                    ]}
                    onRevoke={async (id) => { console.log('Revoke device:', id); }}
                  />
                )}

                {activeTab === 'storage' && (
                  <StorageSettings
                    onClearCache={async () => { console.log('Clear cache'); }}
                    onExportData={async () => { console.log('Export data'); }}
                  />
                )}

                {activeTab === 'about' && <AboutSettings />}

                <div className="h-6 md:hidden" />
              </div>
            </SettingsLayout>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}