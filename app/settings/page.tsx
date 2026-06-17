'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { getEncryptionKey, setEncryptionKey, generateRandomKey } from '@/lib/cryptoUtils';
import {
  Shield, ArrowLeft, Save, Loader2, RefreshCw, Copy, CheckCircle,
  User, Wifi, WifiOff, Clock, Camera, KeyRound, Bell, Info,
  LogOut, ChevronRight, ShieldCheck
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'about';

const STATUS_OPTIONS: { value: Profile['status']; label: string; icon: React.ReactNode }[] = [
  { value: 'online', label: 'Online', icon: <Wifi className="w-3.5 h-3.5 text-emerald-400" /> },
  { value: 'away', label: 'Away', icon: <Clock className="w-3.5 h-3.5 text-yellow-400" /> },
  { value: 'offline', label: 'Offline', icon: <WifiOff className="w-3.5 h-3.5 text-gray-500" /> },
];

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
  { id: 'security', label: 'Безопасность', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
  { id: 'about', label: 'О приложении', icon: <Info className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<Profile['status']>('online');
  const [e2eeKey, setE2eeKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

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
      .update({ username: username.trim(), status })
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
    setSaveMessage({ type: 'success', text: 'Новый ключ E2EE сгенерирован и сохранён' });
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
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-500/[0.03] blur-[80px]" />
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
        <div className="w-64 border-r border-white/[0.06] bg-black/20 backdrop-blur-md p-4 flex flex-col">
          <div className="mb-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,245,181,0.15)]">
                <User className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
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
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Мой Профиль</h2>
                      <p className="text-[10px] text-gray-500">Управляйте своей информацией</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label htmlFor="settings-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Имя пользователя
                      </label>
                      <input
                        id="settings-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Статус
                      </label>
                      <div className="flex gap-3">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setStatus(opt.value)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all flex-1 justify-center ${
                              status === opt.value
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                : 'border-white/10 text-gray-400 hover:border-white/20'
                            }`}
                          >
                            {opt.icon}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-sm hover:from-emerald-400 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(16,245,181,0.2)] flex items-center justify-center gap-2"
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

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Крипто-защита E2EE</h2>
                      <p className="text-[10px] text-gray-500">Управление ключами шифрования</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">
                    Ваш секретный ключ AES-256. Все сообщения шифруются на клиенте этим ключом.
                    <br />
                    <span className="text-yellow-400">⚠ Никому не сообщайте этот ключ.</span>
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Текущий ключ
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
                      className="w-full py-3 rounded-xl border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Сгенерировать новый ключ
                    </button>
                  </div>
                </div>

                {/* Sessions card */}
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
                    {[
                      { device: 'Windows Desktop', location: 'Москва, RU', time: 'Сейчас', active: true },
                      { device: 'Chrome Browser', location: 'Москва, RU', time: '2 часа назад', active: false },
                    ].map((session, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          session.active
                            ? 'border-emerald-500/20 bg-emerald-500/5'
                            : 'border-white/[0.06] bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            session.active ? 'bg-emerald-500/15' : 'bg-white/5'
                          }`}>
                            <Shield className={`w-5 h-5 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{session.device}</p>
                            <p className="text-[10px] text-gray-500">{session.location} · {session.time}</p>
                          </div>
                        </div>
                        {session.active && (
                          <span className="px-2 py-1 rounded-lg text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Активна
                          </span>
                        )}
                      </div>
                    ))}
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
                      <h2 className="text-lg font-bold text-white">Уведомления</h2>
                      <p className="text-[10px] text-gray-500">Настройка push-уведомлений</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'messages', label: 'Новые сообщения', desc: 'Уведомления о новых сообщениях в чатах', enabled: true },
                      { id: 'online', label: 'Статус пользователей', desc: 'Когда пользователь выходит в онлайн', enabled: true },
                      { id: 'updates', label: 'Обновления приложения', desc: 'Новые версии и функции', enabled: false },
                    ].map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{notif.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{notif.desc}</p>
                        </div>
                        <button
                          className={`relative w-11 h-6 rounded-full transition-colors ${
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

            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Info className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">О приложении</h2>
                      <p className="text-[10px] text-gray-500">Версия и лицензия</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                      <span className="text-sm text-gray-400">Версия</span>
                      <span className="text-sm font-mono text-emerald-400">0.1.0</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                      <span className="text-sm text-gray-400">Фреймворк</span>
                      <span className="text-sm text-white">Neutralino.js + Next.js</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                      <span className="text-sm text-gray-400">Лицензия</span>
                      <span className="text-sm text-white">MIT</span>
                    </div>
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