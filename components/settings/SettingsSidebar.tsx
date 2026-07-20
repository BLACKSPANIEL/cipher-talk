'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Globe, LogOut, Crown, Bell, Palette, Monitor, Info, HardDrive, Shield, Gauge, Settings } from 'lucide-react';
import { TierBadge } from '@/components/chat/TierBadge';
import type { SettingsTab } from '@/components/settings/SettingsLayout';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabaseClient';
import { ROLES, type UserRole } from '@/lib/roles';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole>('user');

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role) {
          setUserRole(profile.role as UserRole);
        }
      }
    };
    fetchRole();
  }, []);

  const isAdmin = userRole === 'owner' || userRole === 'admin' || userRole === 'moderator';
  const roleConfig = ROLES[userRole];

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'profile', label: t('settings.tab.profile'), icon: <User className="w-5 h-5" /> },
    { id: 'account', label: t('settings.tab.account'), icon: <Shield className="w-5 h-5" /> },
    { id: 'security', label: t('settings.tab.security'), icon: <Lock className="w-5 h-5" /> },
    { id: 'notifications', label: t('settings.tab.notifications'), icon: <Bell className="w-5 h-5" /> },
    { id: 'appearance', label: t('settings.tab.appearance'), icon: <Palette className="w-5 h-5" /> },
    { id: 'language', label: t('settings.tab.language'), icon: <Globe className="w-5 h-5" /> },
    { id: 'devices', label: t('settings.tab.devices'), icon: <Monitor className="w-5 h-5" /> },
    { id: 'storage', label: t('settings.tab.storage'), icon: <HardDrive className="w-5 h-5" /> },
    { id: 'about', label: t('settings.tab.about'), icon: <Info className="w-5 h-5" /> },
  ];

  // Add admin panel tab for privileged roles
  if (isAdmin) {
    tabs.splice(1, 0, { 
      id: 'admin', 
      label: 'Админ-панель', 
      icon: <Gauge className="w-5 h-5" />,
      badge: roleConfig.label 
    });
  }

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-3xl flex flex-col relative overflow-hidden">
      {/* Premium gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.04] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/[0.06] to-transparent pointer-events-none" />

      {/* Profile Block — Premium Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 relative p-5"
      >
        <div className="relative p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-xl"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar with premium glow */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl border-2 border-emerald-500/40 bg-black/60 flex items-center justify-center"
                style={{ boxShadow: '0 0 40px rgba(16,245,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
              >
                <User className="w-8 h-8 text-emerald-400" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a0f17]" 
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.8)' }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-white font-bold text-base truncate">{username || 'Пользователь'}</p>
                {tier && tier !== 'free' && (
                  <TierBadge tier={tier as any} size="sm" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400 capitalize font-medium">{status}</p>
                {isAdmin && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${roleConfig.color}`}>
                    • {roleConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-1.5 relative px-3 overflow-y-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 relative group min-h-[52px] ${
              activeTab === tab.id
                ? 'text-emerald-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Active background glow */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30"
                style={{ boxShadow: '0 0 30px rgba(16,245,181,0.15), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {/* Inactive hover background */}
            {activeTab !== tab.id && (
              <div className="absolute inset-0 rounded-2xl bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Icon */}
            <span className={`flex-shrink-0 relative z-10 transition-all duration-200 ${
              activeTab === tab.id ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-neutral-300'
            }`}>
              {tab.icon}
            </span>

            {/* Label */}
            <span className={`text-sm font-semibold relative z-10 transition-all duration-200 flex-1 text-left ${
              activeTab === tab.id ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
            }`}>
              {tab.label}
            </span>

            {/* Badge for admin */}
            {tab.badge && (
              <span className={`relative z-10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400`}>
                {tab.badge}
              </span>
            )}

            {/* Active indicator — neon left border */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full"
                style={{ boxShadow: '0 0 20px rgba(16,245,181,0.8), 0 0 40px rgba(16,245,181,0.4)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Logout Button — Premium */}
      <div className="p-3 mt-auto">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-neutral-400 hover:text-red-400 transition-all text-sm group relative overflow-hidden"
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Hover background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border border-transparent group-hover:border-red-500/30 rounded-2xl transition-all" />
          
          <LogOut className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
          <span className="font-semibold relative z-10">{t('common.logout')}</span>
        </motion.button>
      </div>
    </div>
  );
}

export default SettingsSidebar;