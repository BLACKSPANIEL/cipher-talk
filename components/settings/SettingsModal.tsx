'use client';
import React from 'react';
import { X, User, Shield, Palette, Bell, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-tight">Настройки</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={22} className="text-zinc-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-2">
                <SettingsItem icon={User} title="Профиль" subtitle="Имя, аватар, статус" />
                <SettingsItem icon={Shield} title="Безопасность" subtitle="E2EE, пароли, устройства" />
                <SettingsItem icon={Palette} title="Внешний вид" subtitle="Тема, цвета, шрифты" />
                <SettingsItem icon={Bell} title="Уведомления" subtitle="Звуки, push-уведомления" />
                <SettingsItem icon={Monitor} title="Устройства" subtitle="Активные сессии" />
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-medium transition-all"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SettingsItem = ({ 
  icon: Icon, 
  title, 
  subtitle 
}: { 
  icon: React.ElementType; 
  title: string; 
  subtitle: string;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
      <Icon size={22} />
    </div>
    <div>
      <p className="font-medium text-white">{title}</p>
      <p className="text-sm text-zinc-500">{subtitle}</p>
    </div>
  </div>
);

export default SettingsModal;