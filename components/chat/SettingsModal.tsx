'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, LogOut, Camera, Loader2, Check, Shield, Globe, Lock, Monitor, Smartphone, Trash2 } from 'lucide-react';
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
  'ЁЯзС', 'ЁЯСи', 'ЁЯСй', 'ЁЯзСтАНЁЯТ╗', 'ЁЯзСтАНЁЯЪА', 'ЁЯзСтАНЁЯОи', 'ЁЯзСтАНЁЯФм', 'ЁЯжК', 'ЁЯР▒', 'ЁЯР╢', 'ЁЯР╝', 'ЁЯжБ', 'ЁЯРп', 'ЁЯР║', 'ЁЯжД', 'ЁЯР▓',
  'ЁЯдЦ', 'ЁЯС╛', 'ЁЯОо', 'ЁЯО▓', 'ЁЯТО', 'ЁЯФе', 'тЪб', 'ЁЯМЩ', 'тШАя╕П', 'ЁЯНА', 'ЁЯОп', 'ЁЯЪА', 'ЁЯЫ╕', 'ЁЯС╗', 'ЁЯОн', 'ЁЯГП',
];

type Tab = 'profile' | 'security' | 'language';

const tabsList: { value: Tab; key: string; icon: React.ReactNode }[] = [
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

  const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.username);
      setAvatar((profile as any).avatar_url || '');
      setSaved(false);
      setError(null);
      setActiveTab('profile');
      setSignedOutOthers(false);
    }
  }, [isOpen, profile]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!profile) return;
    const trimmed = nickname.trim();
    if (!trimmed) { setError(t('settings.nickname_empty') as string || 'Nickname ╨╜╨╡ ╨╝╨╛╨╢╨╡╤В ╨▒╤Л╤В╤М ╨┐╤Г╤Б╤В╤Л╨╝'); return; }
    setIsSaving(true); setError(null);
    const { data, error: updateError } = await supabase
      .from('profiles').update({ username: trimmed, avatar_url: avatar || null }).eq('id', profile.id).select('*').single();
    setIsSaving(false);
    if (updateError) { setError(updateError.message); return; }
    if (data && onProfileUpdated) onProfileUpdated(data as Profile);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('╨Т╤Л╨▒╨╡╤А╨╕╤В╨╡ ╨╕╨╖╨╛╨▒╤А╨░╨╢╨╡╨╜╨╕╨╡'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('╨д╨░╨╣╨╗ ╨▒╨╛╨╗╤М╤И╨╡ 2 ╨Ь╨С'); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => { setIsLoggingOut(true); await supabase.auth.signOut(); router.push('/login'); };
  const handleSignOutOthers = async () => { setIsSigningOutOthers(true); try { await supabase.auth.signOut({ scope: 'others' }); setSignedOutOthers(true); } catch {} setTimeout(() => setIsSigningOutOthers(false), 1000); };

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
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: '40%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '30%', scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-w-4xl md:h-[80vh] h-[95vh] md:rounded-2xl rounded-t-2xl border md:border-zinc-800 border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md shadow-glass-lg overflow-hidden flex flex-col md:flex-row"
          >
            {/* тФАтФА Mobile: Fixed Top Bar + Tab Bar тФАтФА */}
            <div className="md:hidden flex-shrink-0">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="font-semibold text-white text-sm tracking-wide">{t('settings.title')}</h3>
                <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition active:scale-95">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1 px-3 pb-3 border-b border-zinc-800/60 overflow-x-auto">
                {tabsList.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap active:scale-95 ${
                        isActive ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.10)]' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}>
                      {tab.icon}<span>{t(tab.key as any)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* тФАтФА Desktop: Vertical Tab Sidebar тФАтФА */}
            <div className="hidden md:flex w-56 flex-shrink-0 border-r border-zinc-800/80 bg-zinc-900/50 flex-col">
              <div className="px-4 pt-5 pb-4 border-b border-zinc-800/60">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><UserIcon className="w-4 h-4 text-emerald-400" /></div>
                  <h3 className="font-semibold text-white text-sm tracking-wide">{t('settings.title')}</h3>
                </div>
                {profile && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {avatar ? (avatar.startsWith('data:') || avatar.startsWith('http') ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-xl">{avatar}</span>) : <UserIcon className="w-5 h-5 text-zinc-600" />}
                    </div>
                    <div className="min-w-0"><p className="text-sm font-medium text-white truncate">{profile.username}</p><TierBadge tier={profile.tier ?? 'free'} size="sm" /></div>
                  </div>
                )}
              </div>
              <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {tabsList.map((tab) => {
                  const isTabActive = activeTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isTabActive
                          ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                      }`}
                    >
                      {tab.icon}
                      <span>{t(tab.key as any)}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-zinc-800/60">
                <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition text-xs font-medium disabled:opacity-50">
                  {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}{isLoggingOut ? t('common.logging_out') : t('common.logout')}
                </button>
              </div>
            </div>

            {/* тФАтФА Content Area тАФ scrollable тФАтФА */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Desktop top bar */}
              <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-zinc-800/60 flex-shrink-0 bg-zinc-900/30">
                <h4 className="text-sm font-semibold text-white">{t(`settings.tab.${activeTab}` as any)}</h4>
                <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"><X className="w-4 h-4" /></button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-5 md:space-y-6 scroll-smooth">
                {activeTab === 'profile' && (
                  <>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-3">{t('settings.avatar')}</label>
                      <div className="flex items-start gap-4 md:gap-5">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {avatar ? (avatar.startsWith('data:') || avatar.startsWith('http') ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-4xl md:text-5xl">{avatar}</span>) : <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-zinc-600" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 md:py-2.5 rounded-xl border border-zinc-700/50 bg-zinc-800/40 text-zinc-200 hover:bg-zinc-800/70 hover:border-zinc-600 transition text-sm active:scale-[0.98]"><Camera className="w-4 h-4" />{t('settings.upload_photo')}</button>
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                          {avatar && <button onClick={() => setAvatar('')} className="w-full px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition">{t('settings.remove_avatar')}</button>}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">{t('settings.avatar_presets')}</p>
                        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 p-2.5 rounded-xl bg-zinc-800/30 border border-zinc-800/50 max-h-28 md:max-h-36 overflow-y-auto">
                          {PRESET_AVATARS.map((emoji) => (
                            <button key={emoji} onClick={() => setAvatar(emoji)} className={`text-lg md:text-xl w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition active:scale-90 ${avatar === emoji ? 'bg-neon-green/20 ring-1 ring-neon-green/50' : 'hover:bg-zinc-700/50'}`}>{emoji}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t('settings.nickname')}</label>
                      <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={t('settings.nickname_placeholder')} className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3.5 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-800/80 transition" />
                    </div>

                    {profile && (
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t('settings.tier')}</label>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-800/60"><TierBadge tier={profile.tier ?? 'free'} size="md" /><span className="text-xs text-zinc-500">{t('settings.tier_desc')}</span></div>
                      </div>
                    )}

                    {error && <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">{error}</div>}

                    <button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/60 transition-all text-sm font-medium disabled:opacity-50 active:scale-[0.98]">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}{isSaving ? t('common.saving') : saved ? t('common.saved') : t('common.save_changes')}
                    </button>
                  </>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-5 md:space-y-6">
                    <div className="px-4 md:px-5 py-5 rounded-2xl bg-zinc-800/40 border border-zinc-800/60">
                      <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-emerald-400" /><h4 className="text-sm font-semibold text-white">E2EE End-to-End Encryption</h4></div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{t('settings.security_desc')}</p>
                    </div>

                    <div className="rounded-2xl bg-zinc-800/40 border border-zinc-800/60 overflow-hidden">
                      <div className="px-4 md:px-5 py-4 border-b border-zinc-800/60">
                        <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-neon-green" /><h4 className="text-sm font-semibold text-white">{t('settings.active_sessions') || '╨Р╨║╤В╨╕╨▓╨╜╤Л╨╡ ╤Б╨╡╤Б╤Б╨╕╨╕'}</h4></div>
                        <p className="text-[10px] text-zinc-500 mt-1">{t('settings.sessions_desc') || '╨г╨┐╤А╨░╨▓╨╗╨╡╨╜╨╕╨╡ ╤Г╤Б╤В╤А╨╛╨╣╤Б╤В╨▓╨░╨╝╨╕'}</p>
                      </div>
                      <div className="p-4 md:p-5 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">{isMobileDevice ? <Smartphone className="w-5 h-5 text-emerald-400" /> : <Monitor className="w-5 h-5 text-emerald-400" />}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><p className="text-sm text-white font-medium">{isMobileDevice ? 'Mobile' : 'Desktop'}</p><span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">{t('settings.session_current') || 'Current'}</span></div>
                            <p className="text-[10px] text-zinc-500 mt-0.5 font-mono truncate">{userAgent.slice(0, 60)}тАж</p>
                          </div>
                        </div>
                        <button onClick={handleSignOutOthers} disabled={isSigningOutOthers || signedOutOthers}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 active:scale-[0.98] ${signedOutOthers ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50'}`}>
                          {isSigningOutOthers ? <Loader2 className="w-4 h-4 animate-spin" /> : signedOutOthers ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          {isSigningOutOthers ? '╨Ч╨░╨▓╨╡╤А╤И╨╡╨╜╨╕╨╡тАж' : signedOutOthers ? '╨б╨╡╤Б╤Б╨╕╨╕ ╨╖╨░╨▓╨╡╤А╤И╨╡╨╜╤Л!' : '╨Ч╨░╨▓╨╡╤А╤И╨╕╤В╤М ╨┤╤А╤Г╨│╨╕╨╡ ╤Б╨╡╤Б╤Б╨╕╨╕'}
                        </button>
                      </div>
                    </div>

                    {/* Mobile logout */}
                    <button onClick={handleLogout} disabled={isLoggingOut} className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition text-sm font-medium disabled:opacity-50 active:scale-[0.98]">
                      {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}{isLoggingOut ? t('common.logging_out') : t('common.logout')}
                    </button>
                  </div>
                )}

                {activeTab === 'language' && (
                  <div className="space-y-5">
                    <p className="text-xs text-zinc-400 leading-relaxed">{t('settings.language_desc')}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {LOCALES.map((loc) => {
                        const isActive = locale === loc.value;
                        return (
                          <button key={loc.value} onClick={() => setLocale(loc.value)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all text-left active:scale-[0.98] ${isActive ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.20)]' : 'border-zinc-800 bg-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800/60'}`}>
                            <span className="text-2xl md:text-3xl">{loc.flag}</span>
                            <div className="flex-1"><p className={`text-sm font-medium ${isActive ? 'text-emerald-300' : 'text-white'}`}>{loc.label}</p><p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{loc.value}</p></div>
                            {isActive && <Check className="w-5 h-5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="h-6 md:hidden" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
