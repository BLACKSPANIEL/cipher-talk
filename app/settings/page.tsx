'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { getEncryptionKey, setEncryptionKey, generateRandomKey } from '@/lib/cryptoUtils';
import {
  User, Lock, Bell, Palette, Globe, ArrowLeft, Save, Loader2,
  RefreshCw, Copy, CheckCircle, Camera, KeyRound, LogOut, ChevronRight,
  Shield, ShieldCheck, Monitor, Smartphone, Globe2, X, Check
} from 'lucide-react';

type SettingsTab = 'profile' | 'privacy' | 'notifications' | 'appearance' | 'language';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Мой профиль', icon: <User className="w-4 h-4" /> },
  { id: 'privacy', label: 'Конфиденциальность', icon: <Lock className="w-4 h-4" /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
  { id: 'appearance', label: 'Внешний вид', icon: <Palette className="w-4 h-4" /> },
  { id: 'language', label: 'Язык', icon: <Globe className="w-4 h-4" /> },
];

const STATUS_EMOJIS = ['🟢', '🟡', '🔴', '🌙', '⚡', '🔥', '💤', '🎮'];

const SESSIONS = [
  { id: 1, device: 'Windows Desktop', os: 'Windows 11', location: 'Москва, RU', time: 'Сейчас', active: true },
  { id: 2, device: 'Chrome Browser', os: 'Windows 11', location: 'Москва, RU', time: '2 часа назад', active: false },
  { id: 3, device: 'Mobile App', os: 'iOS 17', location: 'Санкт-Петербург, RU', time: '1 день назад', active: false },
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

  // Notifications state
  const [notifications, setNotifications] = useState({
    messages: true,
    online: true,
    updates: false,
    sounds: true,
  });

  // Appearance state
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Language state
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

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
        <button
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
          <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
            Cipher Talk
          </span>
        </button>
        <span className="text-xs text-gray-500">Настройки</span>
      </div>

      <div className="flex-1 flex relative">
        {/* ── Left Sidebar ── */}
        <div className="w-72 border-r border-white/[0.06] bg-black/20 backdrop-blur-xl p-4 flex flex-col">
          {/* Avatar */}
          <div className="mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(16,245,181,0.2)]">
                <User className="w-12 h-12 text-emerald-400" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-center text-sm font-medium text-white">{username || 'Пользователь'}</p>
            <p className="text-center text-[10px] text-gray-500">@{username || 'username'}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {/* Toast */}
            <AnimatePresence>
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {saveMessage.type === 'success' && <CheckCircle className="w-4 h-4" />}
                  <span>{saveMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Avatar & Status */}
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Мой профиль</h2>
                      <p className="text-[10px] text-gray-500">Управляйте своей информацией</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Avatar */}
                    <div className="flex justify-center">
                      <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(16,245,181,0.25)]">
                          <User className="w-16 h-16 text-emerald-400" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Status Emoji Picker */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Эмодзи статуса
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setStatusEmoji(emoji)}
                            className={`w-10 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center text-lg ${
                              statusEmoji === emoji
                                ? 'border-emerald-500/40 bg-emerald-500/10 scale-110'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label htmlFor="settings-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Никнейм
                      </label>
                      <input
                        id="settings-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="settings-bio" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        О себе
                      </label>
                      <textarea
                        id="settings-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm resize-none"
                      />
                    </div>

                    {/* Status */}
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

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-sm hover:from-emerald-400 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(16,245,181,0.2)] flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Сохранить профиль
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* E2EE Key */}
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Сквозное шифрование (E2EE)</h2>
                      <p className="text-[10px] text-gray-500">Ваш секретный ключ AES-256</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">
                    Все сообщения шифруются на клиенте. Никто, кроме вас, не имеет доступа к содержимому.
                    <br />
                    <span className="text-yellow-400">⚠ Никому не сообщайте этот ключ.</span>
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Публичный ключ
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={e2eeKey}
                          readOnly
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cyan-400 font-mono text-xs focus:outline-none"
                        />
                        <button
                          onClick={handleCopyKey}
                          className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                          title="Скопировать ключ"
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
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Активные сессии</h2>
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
                            : 'border-white/[0.06] bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            session.active ? 'bg-emerald-500/15' : 'bg-white/5'
                          }`}>
                            {session.device.includes('Mobile') ? (
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
                          <button className="px-3 py-1.5 rounded-lg text-[10px] font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                            Завершить
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Двухфакторная аутентификация</h2>
                      <p className="text-[10px] text-gray-500">Дополнительная защита аккаунта</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                    <div>
                      <p className="text-sm font-medium text-white">2FA</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Включите для повышенной безопасности</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-gray-700 transition-colors">
                      <motion.div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                        animate={{ left: 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Уведомления и звуки</h2>
                      <p className="text-[10px] text-gray-500">Настройка push-уведомлений</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'messages', label: 'Новые сообщения', desc: 'Уведомления о новых сообщениях в чатах', enabled: notifications.messages },
                      { id: 'online', label: 'Статус пользователей', desc: 'Когда пользователь выходит в онлайн', enabled: notifications.online },
                      { id: 'updates', label: 'Обновления приложения', desc: 'Новые версии и функции', enabled: notifications.updates },
                      { id: 'sounds', label: 'Звуки чата', desc: 'Звуковые уведомления в чатах', enabled: notifications.sounds },
                    ].map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{notif.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{notif.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotification(notif.id as keyof typeof notifications)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                            notif.enabled ? 'bg-emerald-500' : 'bg-gray-700'
                          }`}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                            animate={{ left: notif.enabled ? 24 : 4 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Внешний вид</h2>
                      <p className="text-[10px] text-gray-500">Настройка темы и отображения</p>
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                      Тема
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'dark', label: 'Тёмная', icon: '🌙' },
                        { id: 'light', label: 'Светлая', icon: '☀️' },
                        { id: 'system', label: 'Системная', icon: '💻' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as typeof theme)}
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            theme === t.id
                              ? 'border-emerald-500/40 bg-emerald-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="text-2xl mb-2">{t.icon}</div>
                          <p className="text-xs font-medium text-white">{t.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                      Размер шрифта
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'small', label: 'Маленький', size: 'text-xs' },
                        { id: 'medium', label: 'Средний', size: 'text-sm' },
                        { id: 'large', label: 'Большой', size: 'text-base' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setFontSize(s.id as typeof fontSize)}
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            fontSize === s.id
                              ? 'border-emerald-500/40 bg-emerald-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className={`${s.size} font-medium text-white mb-1`}>АаBbCc</p>
                          <p className="text-[10px] text-gray-500">{s.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Language Tab */}
            {activeTab === 'language' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Globe2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Язык / Language</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}