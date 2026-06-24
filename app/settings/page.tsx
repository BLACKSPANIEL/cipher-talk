'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  LogOut,
  Camera,
  Loader2,
  Check,
  Shield,
  Globe,
  Lock,
  Monitor,
  Smartphone,
  Trash2,
  Bell,
  Palette,
  Info,
} from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { TierBadge } from '@/components/chat/TierBadge';
import { useLanguage, LOCALES } from '@/lib/i18n';
import { SettingsLayout, type SettingsTab } from '@/components/settings/SettingsLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { DevicesSettings } from '@/components/settings/DevicesSettings';
import { StorageSettings } from '@/components/settings/StorageSettings';
import { AboutSettings } from '@/components/settings/AboutSettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { useSettingsStore } from '@/stores/useSettingsStore';

const PRESET_AVATARS = [
  '🧑', '👨', '👩', '🧑‍💻', '🧑‍🚀', '🧑‍🎨', '🧑‍🔬', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🐺', '🦄', '🐲',
  '🤖', '👾', '🎮', '🎲', '💎', '🔥', '⚡', '🌙', '☀️', '🍀', '🎯', '🚀', '🛸', '👻', '🎭', '🃏',
  '😀', '😂', '🥰', '😎',
];

export default function SettingsPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
  const { theme, accentColor, glassIntensity, setTheme, setAccentColor, setGlassIntensity } = useSettingsStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile tab
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security tab
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);

  // Storage tab
  const [cacheSize, setCacheSize] = useState('0 MB');
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobileDevice = /Mobi|Android|iPhone/i.test(userAgent);

  // Auth guard + load profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setNickname(data.username);
        setAvatar((data as { avatar_url?: string | null }).avatar_url || '');
      }

      setIsLoading(false);
    };

    loadProfile();
  }, [router]);

  // Calculate local storage usage
  useEffect(() => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += (localStorage.getItem(key)?.length || 0) * 2; // UTF-16
        }
      }
      if (total > 1024 * 1024) {
        setCacheSize((total / 1024 / 1024).toFixed(1) + ' MB');
      } else if (total > 1024) {
        setCacheSize((total / 1024).toFixed(1) + ' KB');
      } else {
        setCacheSize(total + ' B');
      }
    } catch {
      setCacheSize('0 MB');
    }
  }, []);

  // ─── Handlers ────────────────────────────────────────────

  const handleSaveProfile = async () => {
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

    if (data) setProfile(data as Profile);
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

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      localStorage.clear();
      setCacheSize('0 B');
      setCacheCleared(true);
    } catch {
      // ignore
    }
    setTimeout(() => {
      setClearingCache(false);
      setCacheCleared(false);
    }, 1500);
  };

  const handleAppearanceUpdate = (key: string, value: string | number | boolean) => {
    if (key === 'theme') setTheme(value as 'dark' | 'light' | 'system');
    if (key === 'accentColor') setAccentColor(value as string);
    if (key === 'glassIntensity') setGlassIntensity(value as number);
  };

  // ─── Loading state ───────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
            {t('common.loading')}
          </span>
        </div>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────

  return (
    <SettingsLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      username={profile?.username || ''}
      status="online"
      tier={profile?.tier}
      onLogout={handleLogout}
      isModal={false}
    >
      {/* ═══ PROFILE ═══ */}
      {activeTab === 'profile' && (
        <>
          {/* Avatar section */}
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

            {/* Preset avatars grid */}
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

          {/* Nickname */}
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

          {/* Tier badge */}
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

          {/* Error */}
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] active:scale-[0.98]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
            {isSaving ? t('common.saving') : saved ? t('common.saved') : t('common.save_changes')}
          </button>
        </>
      )}

      {/* ═══ ACCOUNT ═══ */}
      {activeTab === 'account' && (
        <AccountSettings
          username={profile?.username || ''}
          email={(profile as { email?: string } | null)?.email || ''}
          onUpdate={async (field, value) => {
            if (!profile) return;
            await supabase.from('profiles').update({ [field]: value }).eq('id', profile.id);
            if (field === 'username' && profile) {
              setNickname(value as string);
            }
          }}
        />
      )}

      {/* ═══ SECURITY ═══ */}
      {activeTab === 'security' && (
        <div className="space-y-5 md:space-y-6">
          {/* E2EE Info */}
          <div className="px-4 md:px-5 py-5 rounded-2xl bg-black/30 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">E2EE End-to-End Encryption</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{t('settings.security_desc')}</p>
          </div>

          {/* Active Sessions */}
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

          {/* Logout (mobile only) */}
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

      {/* ═══ NOTIFICATIONS ═══ */}
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

      {/* ═══ APPEARANCE ═══ */}
      {activeTab === 'appearance' && (
        <AppearanceSettings onUpdate={handleAppearanceUpdate} />
      )}

      {/* ═══ LANGUAGE ═══ */}
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

      {/* ═══ DEVICES ═══ */}
      {activeTab === 'devices' && (
        <DevicesSettings
          devices={[
            { id: 1, name: 'Windows Desktop', type: 'desktop', os: 'Windows 11', location: 'Москва, RU', lastActive: 'сейчас', current: true },
            { id: 2, name: 'Chrome Browser', type: 'desktop', os: 'Windows 11', location: 'Москва, RU', lastActive: '2 часа назад', current: false },
            { id: 3, name: 'iPhone 15 Pro', type: 'mobile', os: 'iOS 17', location: 'Санкт-Петербург, RU', lastActive: '1 день назад', current: false },
          ]}
          onRevoke={async (id) => { console.log('Revoke device:', id); }}
        />
      )}

      {/* ═══ STORAGE ═══ */}
      {activeTab === 'storage' && (
        <StorageSettings
          onClearCache={handleClearCache}
          onExportData={async () => { console.log('Export data'); }}
        />
      )}

      {/* ═══ ABOUT ═══ */}
      {activeTab === 'about' && <AboutSettings />}

      {/* Bottom spacer for mobile */}
      <div className="h-6" />
    </SettingsLayout>
  );
}