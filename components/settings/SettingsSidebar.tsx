'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Globe, LogOut, Crown } from 'lucide-react';
import { TierBadge } from '@/components/chat/TierBadge';

type SettingsTab = 'profile' | 'security' | 'language';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  username: string;
  status: string;
  tier?: string;
  onLogout: () => void;
}

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
  { id: 'security', label: 'Безопасность', icon: <Lock className="w-4 h-4" /> },
  { id: 'language', label: 'Язык / Language', icon: <Globe className="w-4 h-4" /> },
];

export function SettingsSidebar({
  activeTab,
  onTabChange,
  username,
  status,
  tier,
  onLogout,
}: SettingsSidebarProps) {
  return (
    <div className="w-72 border-r border-white/[0.05] bg-black/20 backdrop-blur-xl p-5 flex flex-col">
      {/* Profile Block */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full border border-emerald-500/30 bg-black/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <User className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-white font-medium text-sm truncate">{username || 'Пользователь'}</p>
              {tier && tier !== 'free' && (
                <TierBadge tier={tier as any} size="sm" />
              )}
            </div>
            <p className="text-[10px] text-gray-500 capitalize">{status}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
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
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
              {tab.icon}
            </span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm group"
      >
        <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span className="font-medium">Выйти из аккаунта</span>
      </button>
    </div>
  );
}

export default SettingsSidebar;