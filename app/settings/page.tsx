'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { getAesKey, generateRandomAesKey, clearKeys } from '@/lib/cryptoUtils';
import { SettingsLayout, type SettingsTab } from '@/components/settings/SettingsLayout';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { useSettingsStore } from '@/stores/useSettingsStore';

const SESSIONS = [
  { id: 1, device: 'Windows Desktop', os: 'Windows 11', location: 'Москва, RU', time: 'Сейчас', active: true, type: 'desktop' as const },
  { id: 2, device: 'Chrome Browser', os: 'Windows 11', location: 'Москва, RU', time: '2 часа назад', active: false, type: 'desktop' as const },
  { id: 3, device: 'Mobile App', os: 'iOS 17', location: 'Санкт-Петербург, RU', time: '1 день назад', active: false, type: 'mobile' as const },
];

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<string>('online');
  const [e2eeKey, setE2eeKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [language, setLanguage] = useState('ru');
  const { theme, accentColor, glassIntensity, setTheme, setAccentColor, setGlassIntensity } = useSettingsStore();

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
        setProfile(data);
        setUsername(data.username);
        setStatus(data.status);
        setBio(data.bio || '');
      }

      const key = await getAesKey();
      const exported = await crypto.subtle.exportKey('raw', key);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
      setE2eeKey(base64);
      setIsLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSaveProfile = async (newUsername: string, newBio: string, newStatus: string) => {
    setSaveMessage(null);

    if (!profile || !newUsername.trim()) return;

    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername.trim(), bio: newBio, status: newStatus })
      .eq('id', profile.id);

    setIsSaving(false);

    if (error) {
      setSaveMessage({ type: 'error', text: 'Ошибка сохранения: ' + error.message });
      return;
    }

    setUsername(newUsername.trim());
    setBio(newBio);
    setStatus(newStatus);
    setSaveMessage({ type: 'success', text: 'Профиль обновлён' });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleGenerateNewKey = async () => {
    const newKey = generateRandomAesKey();
    const key = await crypto.subtle.importKey('raw', new Uint8Array(newKey.match(/.{2}/g)!.map((b) => parseInt(b, 16))), { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const exported = await crypto.subtle.exportKey('raw', key);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    localStorage.setItem('cipher-talk-e2ee-key', base64);
    setE2eeKey(base64);
    setSaveMessage({ type: 'success', text: 'Новый ключ E2EE сгенерирован' });
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(e2eeKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
        <SettingsLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
      username={username}
      status={status}
      tier={profile?.tier}
      onLogout={handleLogout}
    >
      {activeTab === 'profile' && (
        <ProfileSettings
          profile={profile}
          onProfileUpdated={(updated) => {
            setProfile(updated);
            setUsername(updated.username);
            setBio(updated.bio || '');
            setStatus(updated.status);
          }}
        />
      )}

      {activeTab === 'security' && (
        <SecuritySettings
          e2eeKey={e2eeKey}
          keyCopied={keyCopied}
          onGenerateNewKey={handleGenerateNewKey}
          onCopyKey={handleCopyKey}
          sessions={SESSIONS}
        />
      )}

      {activeTab === 'language' && (
        <LanguageSettings
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />
      )}

      {activeTab === 'appearance' && (
        <AppearanceSettings
          onUpdate={(key: string, value: string | number | boolean) => {
            if (key === 'theme') setTheme(value as 'dark' | 'light' | 'system');
            if (key === 'accentColor') setAccentColor(value as string);
            if (key === 'glassIntensity') setGlassIntensity(value as number);
          }}
        />
      )}
    </SettingsLayout>
  );
}