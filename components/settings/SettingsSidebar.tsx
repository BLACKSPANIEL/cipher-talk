'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Globe, LogOut, Crown, Bell, Palette, Monitor, Info, HardDrive } from 'lucide-react';
import { TierBadge } from '@/components/chat/TierBadge';
import type { SettingsTab } from '@/components/settings/SettingsLayout';
import { useLanguage } from '@/lib/i18n';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  username: string;
  status: string;
  tier?: string;
  onLogout: () => void;
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
  username,
  status,
  tier,
  onLogout,
}: SettingsSidebarProps) {
  const { t } = useLanguage();

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: t('settings.tab.profile'), icon: <User className="w-4 h-4" /> },
    { id: 'account', label: t('settings.tab.account'), icon: <User className="w-4 h-4" /> },
    { id: 'security', label: t('settings.tab.security'), icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: t('settings.tab.notifications'), icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: t('settings.tab.appearance'), icon: <Palette className="w-4 h-4" /> },
    { id: 'language', label: t('settings.tab.language'), icon: <Globe className="w-4 h-4" /> },
    { id: 'devices', label: t('settings.tab.devices'), icon: <Monitor className="w-4 h-4" /> },
    { id: 'storage', label: t('settings.tab.storage'), icon: <HardDrive className="w-4 h-4" /> },
    { id: 'about', label: t('settings.tab.about'), icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="w-72 border-r border-white/[0.08] bg-black/40 backdrop-blur-3xl p-6 flex flex-col relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />
      
      {/* Profile Block */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-emerald-500/40 bg-black/60 flex items-center justify-center flex-shrink-0 shadow-[0_0_40px_rgba(16,245,181,0.3)] relative">
            <User className="w-8 h-8 text-emerald-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-semibold text-base truncate">{username || 'Пользователь'}</p>
              {tier && tier !== 'free' && (
                <TierBadge tier={tier as any} size="sm" />
              )}
            </div>
            <p className="text-[11px] text-gray-400 capitalize">{status}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-1.5 relative">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 relative group ${
              activeTab === tab.id
                ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)] border-l-2 border-emerald-500'
                : 'hover:bg-white/[0.05] text-neutral-300 border-l-2 border-transparent'
            }`}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active indicator with enhanced glow */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-emerald-400 rounded-r-full"
                style={{ 
                  boxShadow: '0 0 20px rgba(16,245,181,1), 0 0 40px rgba(16,245,181,0.6), 0 0 60px rgba(16,245,181,0.3)' 
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`transition-all duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {tab.icon}
            </span>
            <span className="text-sm font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm group border border-transparent hover:border-red-500/30 relative"
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span className="font-medium">{t('common.logout')}</span>
      </motion.button>
    </div>
  );
}

export default SettingsSidebar;