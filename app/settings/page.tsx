'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut, Loader2, Check } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { TierBadge } from '@/components/chat/TierBadge';
import { useLanguage, LOCALES } from '@/lib/i18n';
import { SettingsLayout, type SettingsTab } from '@/components/settings/SettingsLayout';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { DevicesSettings } from '@/components/settings/DevicesSettings';
import { StorageSettings } from '@/components/settings/StorageSettings';
import { AboutSettings } from '@/components/settings/AboutSettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { useSettingsStore } from '@/stores/useSettingsStore';

const PRESET_AVATARS = [
  '🧑', '👨', '👩', '🧑‍💻', '🧑‍🚀', '🧑‍🎨', '🧑‍🔬', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🐺', '🦄', '🐲',
  '🤖', '👾', '🎮', '🎲', '💎', '🔥', '⚡', '🌙', '☀️', '🍀', '🎯', '🚀', '🛸', '👻', '🎭', '🃏',
  '😀', '😂', '🥰', '😎',
];

export default function SettingsPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme, accentColor, setAccentColor, glassIntensity, setGlassIntensity } = useSettingsStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile state
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security state
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);
  const [e2eeKey, setE2eeKey] = useState('aes256-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  const [keyCopied, setKeyCopied] = useState(false);

  // Storage state
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
          total += (localStorage.getItem(key)?.length || 0) * 2;
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

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(e2eeKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleGenerateNewKey = () => {
    setE2eeKey('aes256-' + Math.random().toString(36).substring(2, 15) + '-' + Math.random().toString(36).substring(2, 15));
  };

  const sessions = [
    { id: 1, device: isMobileDevice ? 'Mobile Device' : 'Desktop Browser', os: userAgent.slice(0, 30) + '...', location: 'Москва, RU', time: 'сейчас', active: true, type: isMobileDevice ? 'mobile' as const : 'desktop' as const },
    { id: 2, device: 'Chrome on Windows', os: 'Windows 11', location: 'Санкт-Петербург, RU', time: '2 часа назад', active: false, type: 'desktop' as const },
    { id: 3, device: 'Safari on iPhone', os: 'iOS 17', location: 'Казань, RU', time: '1 день назад', active: false, type: 'mobile' as const },
  ];

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
    <div className="min-h-screen bg-[#05070d] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        <SettingsLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          username={profile?.username || ''}
          status="online"
          tier={profile?.tier}
          onLogout={handleLogout}
          isModal={false}
        >
          <AnimatePresence mode="wait">
            {/* ═══ PROFILE ═══ */}
            {activeTab === 'profile' && (
              <ProfileSettings
                key="profile"
                profile={profile}
                onProfileUpdated={(updated) => {
                  setProfile(updated);
                  setNickname(updated.username);
                  setAvatar(updated.avatar_url || '');
                }}
              />
            )}

            {/* ═══ ACCOUNT ═══ */}
            {activeTab === 'account' && (
              <AccountSettings
                key="account"
                username={profile?.username || ''}
                email={(profile as { email?: string } | null)?.email || ''}
                onUpdate={async (field, value) => {
                  if (!profile) return;
                  await supabase.from('profiles').update({ [field]: value }).eq('id', profile.id);
                  if (field === 'username') {
                    setNickname(value as string);
                  }
                }}
              />
            )}

            {/* ═══ SECURITY ═══ */}
            {activeTab === 'security' && (
              <SecuritySettings
                key="security"
                e2eeKey={e2eeKey}
                keyCopied={keyCopied}
                onGenerateNewKey={handleGenerateNewKey}
                onCopyKey={handleCopyKey}
                sessions={sessions}
              />
            )}

            {/* ═══ NOTIFICATIONS ═══ */}
            {activeTab === 'notifications' && (
              <NotificationsSettings
                key="notifications"
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
              <AppearanceSettings
                key="appearance"
                onUpdate={handleAppearanceUpdate}
              />
            )}

            {/* ═══ LANGUAGE ═══ */}
            {activeTab === 'language' && (
              <LanguageSettings
                key="language"
                selectedLanguage={locale}
                onLanguageChange={setLocale}
              />
            )}

            {/* ═══ DEVICES ═══ */}
            {activeTab === 'devices' && (
              <DevicesSettings
                key="devices"
                devices={[
                  { id: '1', name: 'Windows Desktop', type: 'desktop', os: 'Windows 11', location: 'Москва, RU', lastActive: 'сейчас', isCurrent: true, isTrusted: true, ip: '192.168.1.1' },
                  { id: '2', name: 'Chrome Browser', type: 'desktop', os: 'Windows 11', location: 'Москва, RU', lastActive: '2 часа назад', isCurrent: false, isTrusted: true, ip: '192.168.1.2' },
                  { id: '3', name: 'iPhone 15 Pro', type: 'mobile', os: 'iOS 17', location: 'Санкт-Петербург, RU', lastActive: '1 день назад', isCurrent: false, isTrusted: false, ip: '192.168.1.3' },
                ]}
                onRevoke={async (id) => { console.log('Revoke device:', id); }}
              />
            )}

            {/* ═══ STORAGE ═══ */}
            {activeTab === 'storage' && (
              <StorageSettings
                key="storage"
                onClearCache={handleClearCache}
                onExportData={async () => { console.log('Export data'); }}
              />
            )}

            {/* ═══ ABOUT ═══ */}
            {activeTab === 'about' && (
              <AboutSettings
                key="about"
              />
            )}
          </AnimatePresence>

          {/* Bottom spacer for mobile */}
          <div className="h-6" />
        </SettingsLayout>
      </div>
    </div>
  );
}