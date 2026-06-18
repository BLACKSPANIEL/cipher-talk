'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Volume2, MessageSquare, Mail, Smartphone, Monitor } from 'lucide-react';

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
  const notificationItems = [
    { key: 'pushNotifications', icon: Bell, label: 'Push-уведомления', desc: 'Получать уведомления на устройстве' },
    { key: 'soundEnabled', icon: Volume2, label: 'Звуки', desc: 'Звуковые сигналы для новых сообщений' },
    { key: 'messagePreview', icon: MessageSquare, label: 'Превью сообщений', desc: 'Показывать текст в уведомлениях' },
    { key: 'emailNotifications', icon: Mail, label: 'Email уведомления', desc: 'Получать важные обновления на почту' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Desktop Notifications */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Уведомления</h3>
            <p className="text-[10px] text-gray-500">Настройка push-уведомлений</p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => onUpdate(item.key, !settings[item.key as keyof typeof settings])}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings[item.key as keyof typeof settings]
                    ? 'bg-emerald-500/30 border border-emerald-500/50'
                    : 'bg-white/10 border border-white/10'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                    settings[item.key as keyof typeof settings]
                      ? 'left-6 bg-emerald-400'
                      : 'left-0.5 bg-gray-500'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Notifications */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Мобильные уведомления</h3>
            <p className="text-[10px] text-gray-500">Настройки для мобильных устройств</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08]">
          <p className="text-xs text-gray-400 leading-relaxed">
            Push-уведомления работают автоматически при установке приложения. 
            Вы можете управлять ими в системных настройках вашего устройства.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default NotificationsSettings;