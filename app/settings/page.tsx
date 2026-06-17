'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { getEncryptionKey, setEncryptionKey, generateRandomKey } from '@/lib/cryptoUtils';
import {
  User, Lock, Globe, ArrowLeft, Save, Loader2,
  RefreshCw, Copy, CheckCircle, Camera, KeyRound, LogOut,
  Shield, Monitor, Smartphone, Crown, Check
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'language';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
  { id: 'security', label: 'Безопасность', icon: <Lock className="w-4 h-4" /> },
  { id: 'language', label: 'Язык / Language', icon: <Globe className="w-4 h-4" /> },
];

const STATUS_EMOJIS = ['🟢', '🟡', '🔴', '🌙', '⚡', '🔥', '💤', '🎮'];

const SESSIONS = [
  { id: 1, device: 'Windows Desktop', os: 'Windows 11', location: 'Москва, RU', time: 'Сейчас', active: true, type: 'desktop' },
  { id: 2, device: 'Chrome Browser', os: 'Windows 11', location: 'Москва, RU', time: '2 часа назад', active: false, type: 'desktop' },
  { id: 3, device: 'Mobile App', os: 'iOS 17', location: 'Санкт-Петербург, RU', time: '1 день назад', active: false, type: 'mobile' },
];

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<Profile['status']>('online');
  const [statusEmoji, setStatusEmoji] = useState('🟢');
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

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);

    if (!profile || !username.trim()) return;

    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim(), bio, status })
      .eq('id', profile.id);

    setIsSaving(false);

    if (error) {
      setSaveMessage({ type: 'error', text: 'Ошибка сохранения: ' + error.message });
      return;
    }

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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center p-4">
      {/* Main Glass Container */}
      <div className="backdrop-blur-xl bg-[#0e0f12]/90 border border-white/[0.08] shadow-[0_25px_50px_rgba(0,0,0,0.7)] rounded-2xl flex overflow-hidden min-h-[550px] w-full max-w-4xl">
        
        {/* Left Sidebar */}
        <div className="w-72 border-r border-white/[0.05] bg-black/20 backdrop-blur-xl p-5 flex flex-col">
          {/* Profile Block */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full border border-emerald-500/30 bg-black/40 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{username || 'Пользователь'}</p>
                <p className="text-[10px] text-gray-500 capitalize">{status}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-white/[0.03] text-neutral-300'
                }`}
              >
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-emerald-400 rounded-r-full"
                    style={{ boxShadow: '0 0 10px rgba(16,245,181,0.8)' }}
                  />
                )}
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Выйти из аккаунта</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[550px] custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(16,245,181,0.25)]">
                      <User className="w-16 h-16 text-emerald-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      <Camera className="w-10 h-10 text-white" />
                      <span className="text-[10px] text-white font-medium">Изменить</span>
                    </div>
                  </div>
                </div>

                {/* Status Emoji Grid */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Эмодзи статуса
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar p-3 rounded-xl bg-black/30 border border-white/5">
                    {STATUS_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setStatusEmoji(emoji)}
                        className={`w-10 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center text-lg ${
                          statusEmoji === emoji
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-110'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Username Input */}
                <div>
                  <label htmlFor="settings-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Никнейм
                  </label>
                  <input
                    id="settings-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                  />
                </div>

                {/* Bio Input */}
                <div>
                  <label htmlFor="settings-bio" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    О себе
                  </label>
                  <textarea
                    id="settings-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm resize-none"
                  />
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Статус
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'online', label: 'Online', emoji: '🟢' },
                      { value: 'away', label: 'Away', emoji: '🟡' },
                      { value: 'offline', label: 'Offline', emoji: '🔴' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(opt.value as Profile['status'])}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all flex-1 justify-center ${
                          status === opt.value
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                            : 'border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <span>{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ELITE Tier Badge */}
                {profile?.tier && profile.tier !== 'free' && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-400">Тариф {profile.tier.toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500">Назначен администратором</p>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Сохранить изменения
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* E2EE Key Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Сквозное шифрование (E2EE)</h3>
                      <p className="text-[10px] text-gray-500">Ваш секретный ключ AES-256</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">
                    Все сообщения шифруются на клиенте. Никто, кроме вас, не имеет доступа к содержимому.
                    <br />
                    <span className="text-yellow-400">⚠ Никому не сообщайте этот ключ.</span>
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Публичный ключ
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={e2eeKey}
                          readOnly
                          className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-cyan-400 font-mono text-xs focus:outline-none"
                        />
                        <button
                          onClick={handleCopyKey}
                          className="px-4 py-3 rounded-lg border border-white/10 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                        >
                          {keyCopied ? <CheckCircle className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateNewKey}
                      className="w-full py-3 rounded-xl border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Сгенерировать новый ключ
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Активные сессии</h3>
                      <p className="text-[10px] text-gray-500">Устройства, где вы авторизованы</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {SESSIONS.map((session) => (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          session.active
                            ? 'border-emerald-500/20 bg-emerald-500/5'
                            : 'bg-white/[0.02] border-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            session.active ? 'bg-emerald-500/15' : 'bg-white/5'
                          }`}>
                            {session.type === 'mobile' ? (
                              <Smartphone className={`w-6 h-6 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                            ) : (
                              <Monitor className={`w-6 h-6 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{session.device}</p>
                            <p className="text-[10px] text-gray-500">{session.os} · {session.location}</p>
                            <p className="text-[10px] text-gray-600">{session.time}</p>
                          </div>
                        </div>
                        {session.active ? (
                          <span className="px-3 py-1 rounded-lg text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Активна
                          </span>
                        ) : (
                          <button className="px-3 py-1.5 rounded-lg text-[10px] font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                            Завершить
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-3 rounded-xl border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all duration-200">
                    Завершить другие сессии
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'language' && (
              <motion.div
                key="language"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Язык / Language</h3>
                      <p className="text-[10px] text-gray-500">Выбор локализации</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 'ru', label: 'Русский', native: 'Русский' },
                      { id: 'en', label: 'English', native: 'English' },
                      { id: 'de', label: 'Deutsch', native: 'Deutsch' },
                      { id: 'fr', label: 'Français', native: 'Français' },
                      { id: 'es', label: 'Español', native: 'Español' },
                      { id: 'zh', label: '中文', native: '中文' },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          language === lang.id
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : 'border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🌐</span>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">{lang.native}</p>
                            <p className="text-[10px] text-gray-500">{lang.label}</p>
                          </div>
                        </div>
                        {language === lang.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-black" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}