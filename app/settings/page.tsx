'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { getEncryptionKey, setEncryptionKey, generateRandomKey } from '@/lib/cryptoUtils';
import { Shield, ArrowLeft, Save, Loader2, RefreshCw, Copy, CheckCircle, User, Wifi, WifiOff, Clock } from 'lucide-react';

const STATUS_OPTIONS: { value: Profile['status']; label: string; icon: React.ReactNode }[] = [
  { value: 'online', label: 'Online', icon: <Wifi className="w-3.5 h-3.5 text-neon-green" /> },
  { value: 'away', label: 'Away', icon: <Clock className="w-3.5 h-3.5 text-yellow-400" /> },
  { value: 'offline', label: 'Offline', icon: <WifiOff className="w-3.5 h-3.5 text-gray-500" /> },
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

  // Загрузка профиля
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

      // Загружаем ключ E2EE из localStorage
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
      <div className="min-h-screen bg-bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neon-green/10 bg-surface-darker/80">
        <button
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-neon-green transition" />
          <span className="text-sm font-medium text-white group-hover:text-neon-green transition">
            Cipher Talk
          </span>
        </button>
        <span className="text-xs text-gray-500">Настройки</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          {/* Toast message */}
          {saveMessage && (
            <div
              className={`px-4 py-3 rounded-xl border text-sm ${
                saveMessage.type === 'success'
                  ? 'bg-neon-green/10 border-neon-green/20 text-neon-green'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {saveMessage.type === 'success' && <CheckCircle className="w-4 h-4 inline mr-2" />}
              {saveMessage.text}
            </div>
          )}

          {/* ── Блок "Мой Профиль" ── */}
          <div className="relative">
            <div className="absolute -inset-1 bg-neon-green/5 rounded-2xl blur-xl" />
            <div className="relative bg-surface-darker border border-neon-green/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-neon-green" />
                <h2 className="text-lg font-bold text-white">Мой Профиль</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Username */}
                <div>
                  <label htmlFor="settings-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Имя пользователя
                  </label>
                  <input
                    id="settings-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-neon-green/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition text-sm"
                  />
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
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
                            ? 'border-neon-green/40 bg-neon-green/10 text-neon-green'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-neon-green text-black font-semibold text-sm hover:bg-neon-dark-green disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
          </div>

          {/* ── Блок "Крипто-защита E2EE" ── */}
          <div className="relative">
            <div className="absolute -inset-1 bg-neon-green/5 rounded-2xl blur-xl" />
            <div className="relative bg-surface-darker border border-neon-green/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-neon-green" />
                <h2 className="text-lg font-bold text-white">Крипто-защита E2EE</h2>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Ваш секретный ключ AES-256. Все сообщения шифруются на клиенте этим ключом.
                <br />
                <span className="text-yellow-400">⚠ Никому не сообщайте этот ключ.</span>
              </p>

              <div className="space-y-4">
                {/* Key display */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Текущий ключ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={e2eeKey}
                      readOnly
                      className="flex-1 bg-black/40 border border-neon-green/20 rounded-xl px-4 py-3 text-neon-green font-mono text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleCopyKey}
                      className="px-4 py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-neon-green/40 hover:text-neon-green transition"
                      title="Скопировать ключ"
                    >
                      {keyCopied ? <CheckCircle className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Generate new key */}
                <button
                  onClick={handleGenerateNewKey}
                  className="w-full py-3 rounded-xl border border-neon-green/30 text-neon-green font-medium text-sm hover:bg-neon-green/10 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Сгенерировать новый ключ
                </button>
              </div>
            </div>
          </div>

          {/* ── Logout ── */}
          <div className="text-center pb-8">
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}