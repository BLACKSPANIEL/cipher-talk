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
    { key: 'pushNotifications', icon: Bell, label: 'Push-уведомления', desc: 'Получать уведомления на устройстве' },
    { key: 'soundEnabled', icon: Volume2, label: 'Звуки', desc: 'Звуковые сигналы для новых сообщений' },
    { key: 'messagePreview', icon: MessageSquare, label: 'Превью сообщений', desc: 'Показывать текст в уведомлениях' },
    { key: 'emailNotifications', icon: Mail, label: 'Email уведомления', desc: 'Получать важные обновления на почту' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex flex-col gap-10"
    >
      {/* Desktop Notifications */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,245,181,0.15)]">
            <Monitor className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Уведомления</h3>
            <p className="text-xs text-gray-500 mt-1">Настройка push-уведомлений</p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between p-5 rounded-2xl border border-white/[0.06] bg-black/20 hover:border-emerald-500/30 transition-all duration-200"
              whileHover={{ scale: 1.01, x: 4 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
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

      {/* Mobile Notifications */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Smartphone className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Мобильные уведомления</h3>
            <p className="text-xs text-gray-500 mt-1">Настройки для мобильных устройств</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
          <p className="text-sm text-gray-400 leading-relaxed">
            Push-уведомления работают автоматически при установке приложения. 
            Вы можете управлять ими в системных настройках вашего устройства.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default NotificationsSettings;