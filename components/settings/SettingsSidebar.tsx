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
    { id: 'profile', label: t('settings.tab.profile'), icon: <User className="w-5 h-5" /> },
    { id: 'account', label: t('settings.tab.account'), icon: <User className="w-5 h-5" /> },
    { id: 'security', label: t('settings.tab.security'), icon: <Lock className="w-5 h-5" /> },
    { id: 'notifications', label: t('settings.tab.notifications'), icon: <Bell className="w-5 h-5" /> },
    { id: 'appearance', label: t('settings.tab.appearance'), icon: <Palette className="w-5 h-5" /> },
    { id: 'language', label: t('settings.tab.language'), icon: <Globe className="w-5 h-5" /> },
    { id: 'devices', label: t('settings.tab.devices'), icon: <Monitor className="w-5 h-5" /> },
    { id: 'storage', label: t('settings.tab.storage'), icon: <HardDrive className="w-5 h-5" /> },
    { id: 'about', label: t('settings.tab.about'), icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <div className="w-80 border-r border-white/[0.08] bg-black/40 backdrop-blur-3xl p-8 flex flex-col relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />
      
      {/* Profile Block */}
      <div className="mb-10 relative">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl border-2 border-emerald-500/40 bg-black/60 flex items-center justify-center flex-shrink-0 shadow-[0_0_50px_rgba(16,245,181,0.35)] relative">
            <User className="w-10 h-10 text-emerald-400" />
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <p className="text-white font-bold text-lg truncate">{username || 'Пользователь'}</p>
              {tier && tier !== 'free' && (
                <TierBadge tier={tier as any} size="sm" />
              )}
            </div>
            <p className="text-xs text-gray-400 capitalize font-medium">{status}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-2 relative">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 relative group min-h-[56px] ${
              activeTab === tab.id
                ? 'text-emerald-400 bg-gradient-to-r from-emerald-500/15 to-transparent border-l-[3px] border-emerald-500'
                : 'hover:bg-white/[0.05] text-neutral-300 border-l-[3px] border-transparent'
            }`}
            whileHover={{ scale: 1.02, x: 6 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active indicator — мягкая полоса с градиентом */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(16,245,181,0.6)]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="flex-shrink-0 transition-all duration-200">
              {tab.icon}
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={onLogout}
        className="mt-auto flex items-center gap-4 px-5 py-4 rounded-2xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm group border border-transparent hover:border-red-500/30 relative"
        whileHover={{ scale: 1.02, x: 6 }}
        whileTap={{ scale: 0.98 }}
      >
        <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="font-semibold">{t('common.logout')}</span>
      </motion.button>
    </div>
  );
}

export default SettingsSidebar;