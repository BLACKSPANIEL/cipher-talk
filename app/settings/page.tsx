'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { getEncryptionKey, setEncryptionKey, generateRandomKey } from '@/lib/cryptoUtils';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';

type SettingsTab = 'profile' | 'security' | 'language';

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
  const [status, setStatus] = useState<Profile['status']>('online');
  const [e2eeKey, setE2eeKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [language, setLanguage] = useState('ru');

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

      setE2eeKey(getEncryptionKey());
      setIsLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSaveProfile = async (newUsername: string, newBio: string, newStatus: Profile['status']) => {
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

  const handleGenerateNewKey = () => {
    const newKey = generateRandomKey();
    setEncryptionKey(newKey);
    setE2eeKey(newKey);
    setSaveMessage({ type: 'success', text: 'Новый ключ E2EE сгенерирован' });
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(e2eeKey);
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
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center p-4">
      {/* Main Glass Container */}
      <div className="backdrop-blur-xl bg-[#0e0f12]/90 border border-white/[0.08] shadow-[0_25px_50px_rgba(0,0,0,0.7)] rounded-2xl flex overflow-hidden min-h-[550px] w-full max-w-4xl">
        
        {/* Left Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          username={username}
          status={status}
          tier={profile?.tier}
          onLogout={handleLogout}
        />

        {/* Right Content Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[550px] custom-scrollbar">
          {activeTab === 'profile' && (
            <ProfileSettings
              username={username}
              bio={bio}
              status={status}
              tier={profile?.tier}
              onSave={handleSaveProfile}
              isSaving={isSaving}
              saveMessage={saveMessage}
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
        </div>
      </div>
    </div>
  );
}