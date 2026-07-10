'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Volume2, MessageSquare, Mail, Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface NotificationsSettingsProps {
  settings: {
    pushNotifications: boolean;
    soundEnabled: boolean;
    messagePreview: boolean;
    emailNotifications: boolean;
  };
  onUpdate: (key: string, value: boolean) => void;
}

export function NotificationsSettings({ settings, onUpdate }: NotificationsSettingsProps) {
  const { t } = useLanguage();
  const notificationItems = [
    { key: 'pushNotifications', icon: Bell, label: t('settings.notifications.push'), desc: t('settings.notifications.push_desc') },
    { key: 'soundEnabled', icon: Volume2, label: t('settings.notifications.sound'), desc: t('settings.notifications.sound_desc') },
    { key: 'messagePreview', icon: MessageSquare, label: t('settings.notifications.preview'), desc: t('settings.notifications.preview_desc') },
    { key: 'emailNotifications', icon: Mail, label: t('settings.notifications.email'), desc: t('settings.notifications.email_desc') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-6"
    >
      {/* Desktop Notifications — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-6 md:p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <Monitor className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{t('settings.tab.notifications')}</h3>
            <p className="text-xs text-gray-400 mt-1">{t('settings.notifications.push_desc')}</p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between p-5 rounded-2xl border border-white/[0.06] bg-black/20 hover:border-emerald-500/30 transition-all duration-200 group"
              whileHover={{ scale: 1.01, x: 4 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <motion.button
                onClick={() => onUpdate(item.key, !settings[item.key as keyof typeof settings])}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  settings[item.key as keyof typeof settings]
                    ? 'bg-emerald-500/30 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-white/10 border border-white/10'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`absolute top-1 w-6 h-6 rounded-full ${
                    settings[item.key as keyof typeof settings]
                      ? 'bg-emerald-400'
                      : 'bg-gray-500'
                  }`}
                  animate={{
                    left: settings[item.key as keyof typeof settings] ? 'calc(100% - 1.75rem)' : '0.25rem'
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ boxShadow: settings[item.key as keyof typeof settings] ? '0 0 10px rgba(16,245,181,0.5)' : 'none' }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Notifications — Premium */}
      <div className="w-full bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1] rounded-3xl p-6 md:p-8 backdrop-blur-2xl"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Smartphone className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{t('settings.notifications.mobile')}</h3>
            <p className="text-xs text-gray-400 mt-1">{t('settings.notifications.mobile_desc')}</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
          <p className="text-sm text-gray-400 leading-relaxed">
            {t('settings.notifications.mobile_desc')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default NotificationsSettings;