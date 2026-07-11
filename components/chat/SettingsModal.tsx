'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Loader2 } from 'lucide-react';
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

  // Security state
  const [e2eeKey, setE2eeKey] = useState('aes256-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  const [keyCopied, setKeyCopied] = useState(false);

  // Reset tab on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab('profile');
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: '40%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '30%', scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:max-w-5xl h-[95vh] md:h-[90vh] md:rounded-2xl rounded-t-2xl border border-white/[0.08] bg-[#0e0f12]/95 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row"
          >
            <SettingsLayout
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as any)}
              username={profile?.username || ''}
              status="online"
              tier={profile?.tier}
              onLogout={handleLogout}
              isModal={true}
              onClose={onClose}
            >
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-5 md:space-y-6 scroll-smooth">
                <AnimatePresence mode="wait">
                  {/* ═══ PROFILE ═══ */}
                  {activeTab === 'profile' && (
                    <ProfileSettings
                      key="modal-profile"
                      profile={profile}
                      onProfileUpdated={(updated) => {
                        onProfileUpdated?.(updated);
                      }}
                    />
                  )}

                  {/* ═══ ACCOUNT ═══ */}
                  {activeTab === 'account' && (
                    <AccountSettings
                      key="modal-account"
                      username={profile?.username || ''}
                      email={(profile as { email?: string } | null)?.email || ''}
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