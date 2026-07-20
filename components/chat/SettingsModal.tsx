'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Loader2, Settings2, Shield, Bell, Palette, Monitor, HardDrive, Globe, Info, Lock, User, Sparkles } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
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
import { useLanguage } from '@/lib/i18n';
import { ROLES, type UserRole } from '@/lib/roles';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onProfileUpdated?: (profile: Profile) => void;
}

export function SettingsModal({ isOpen, onClose, profile, onProfileUpdated }: SettingsModalProps) {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');

  // Security state
  const [e2eeKey, setE2eeKey] = useState('aes256-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  const [keyCopied, setKeyCopied] = useState(false);

  // Sync fresh profile data on every open — never stale
  const [syncedProfile, setSyncedProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (isOpen && profile) {
      setActiveTab('profile');
      setSyncedProfile(profile);
      fetchUserRole(profile.id);
    }
  }, [isOpen, profile]);

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data?.role) setUserRole(data.role as UserRole);
  };

  // Re-fetch profile silently on each open
  useEffect(() => {
    if (!isOpen || !profile) return;
    supabase.from('profiles').select('*').eq('id', profile.id).single().then(({ data }) => {
      if (data) {
        setSyncedProfile(data as Profile);
        onProfileUpdated?.(data as Profile);
      }
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(e2eeKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleGenerateNewKey = () => {
    setE2eeKey('aes256-' + Math.random().toString(36).substring(2, 15) + '-' + Math.random().toString(36).substring(2, 15));
  };

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobileDevice = /Mobi|Android|iPhone/i.test(userAgent);

  const sessions = [
    { id: 1, device: isMobileDevice ? 'Mobile Device' : 'Desktop Browser', os: userAgent.slice(0, 30) + '...', location: 'Москва, RU', time: 'сейчас', active: true, type: isMobileDevice ? 'mobile' as const : 'desktop' as const },
    { id: 2, device: 'Chrome on Windows', os: 'Windows 11', location: 'Санкт-Петербург, RU', time: '2 часа назад', active: false, type: 'desktop' as const },
    { id: 3, device: 'Safari on iPhone', os: 'iOS 17', location: 'Казань, RU', time: '1 день назад', active: false, type: 'mobile' as const },
  ];

  const roleConfig = ROLES[userRole];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-w-6xl h-[92vh] md:h-[88vh] md:rounded-[2rem] rounded-t-[2rem] border border-white/[0.12] bg-[#0a0f17]/[0.98] backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.85),0_0_100px_rgba(16,245,181,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Premium inner glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-cyan-500/[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            
            {/* Ambient glow orbs */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.07] blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[100px] pointer-events-none" />

            {/* Premium Header — visible on all screens */}
            <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl relative z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30"
                  style={{ boxShadow: '0 0 20px rgba(16,245,181,0.2)' }}>
                  <Settings2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Настройки</h2>
                  <p className="text-[10px] text-zinc-500">Управление аккаунтом</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop close button */}
            {onClose && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, borderColor: 'rgba(16,245,181,0.4)', boxShadow: '0 0 20px rgba(16,245,181,0.3)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="hidden md:flex absolute top-6 right-6 z-50 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/10 hover:border-emerald-500/30 items-center justify-center"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}

            {/* Version Badge */}
            <div className="absolute top-4 right-4 z-20 hidden md:block">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] text-gray-500 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm"
              >
                v2.1 Premium
              </motion.span>
            </div>

            <SettingsLayout
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as any)}
              username={syncedProfile?.username || profile?.username || ''}
              status="online"
              tier={syncedProfile?.tier || profile?.tier}
              onLogout={handleLogout}
              isModal={true}
              onClose={onClose}
            >
              <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-8 space-y-5 md:space-y-6 scroll-smooth">
                <AnimatePresence mode="wait">
                  {/* ═══ PROFILE ═══ */}
                  {activeTab === 'profile' && (
                    <ProfileSettings
                      key="modal-profile"
                      profile={syncedProfile || profile}
                      onProfileUpdated={(updated) => {
                        onProfileUpdated?.(updated);
                      }}
                    />
                  )}

                  {/* ═══ ACCOUNT ═══ */}
                  {activeTab === 'account' && (
                    <AccountSettings
                      key="modal-account"
                      username={syncedProfile?.username || profile?.username || ''}
                      email={(syncedProfile as { email?: string } | null)?.email || (profile as { email?: string } | null)?.email || ''}
                      onUpdate={async (field, value) => {
                        if (!profile) return;
                        await supabase.from('profiles').update({ [field]: value }).eq('id', profile.id);
                        if (field === 'username' && onProfileUpdated && profile) {
                          onProfileUpdated({ ...profile, username: value as string });
                        }
                      }}
                    />
                  )}

                  {/* ═══ SECURITY ═══ */}
                  {activeTab === 'security' && (
                    <SecuritySettings
                      key="modal-security"
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
                      key="modal-notifications"
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
                      key="modal-appearance"
                      onUpdate={(key, value) => console.log('Update appearance:', key, value)}
                    />
                  )}

                  {/* ═══ LANGUAGE ═══ */}
                  {activeTab === 'language' && (
                    <LanguageSettings
                      key="modal-language"
                      selectedLanguage={locale}
                      onLanguageChange={setLocale}
                    />
                  )}

                  {/* ═══ DEVICES ═══ */}
                  {activeTab === 'devices' && (
                    <DevicesSettings
                      key="modal-devices"
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
                      key="modal-storage"
                      onClearCache={async () => { console.log('Clear cache'); }}
                      onExportData={async () => { console.log('Export data'); }}
                    />
                  )}

                  {/* ═══ ABOUT ═══ */}
                  {activeTab === 'about' && (
                    <AboutSettings key="modal-about" />
                  )}
                </AnimatePresence>

                <div className="h-6 md:hidden" />
              </div>
            </SettingsLayout>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}