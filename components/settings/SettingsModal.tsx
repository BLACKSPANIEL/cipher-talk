'use client';
import React, { useState, useEffect } from 'react';
import { X, User, Shield, Palette, Bell, Monitor, HardDrive, Globe, Info, Lock, LogOut, ChevronRight, Settings, Crown, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { ROLES, type UserRole } from '@/lib/roles';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

type ModalTab = 'profile' | 'security' | 'appearance' | 'notifications' | 'devices' | 'storage' | 'language' | 'about' | 'admin';

const SettingsItem = ({ 
  icon: Icon, 
  title, 
  subtitle,
  isActive,
  onClick,
  badge,
  glowColor = 'emerald'
}: { 
  icon: React.ElementType; 
  title: string; 
  subtitle: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string;
  glowColor?: 'emerald' | 'cyan' | 'violet' | 'red';
}) => {
  const glowMap = {
    emerald: 'rgba(16,245,181,0.3)',
    cyan: 'rgba(6,182,212,0.3)',
    violet: 'rgba(139,92,246,0.3)',
    red: 'rgba(239,68,68,0.3)',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/8 border border-emerald-500/20' 
          : 'hover:bg-white/[0.04] border border-transparent'
      }`}
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-500/25 to-cyan-500/15' 
          : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
      }`}
        style={isActive ? { boxShadow: `0 0 25px ${glowMap[glowColor]}` } : undefined}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-emerald-400'}`} />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-zinc-200'}`}>{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
      {badge && (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-600'} transition-all group-hover:translate-x-1`} />
    </motion.button>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ModalTab>('profile');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [username, setUsername] = useState('Пользователь');

  useEffect(() => {
    if (isVisible) {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('username, role').eq('id', user.id).single();
          if (profile) {
            setUsername(profile.username || 'Пользователь');
            setUserRole((profile.role as UserRole) || 'user');
          }
        }
      };
      fetchProfile();
    }
  }, [isVisible]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    onClose();
  };

  const isAdmin = userRole === 'owner' || userRole === 'admin' || userRole === 'moderator';

  const tabs: { id: ModalTab; label: string; subtitle: string; icon: React.ElementType; glowColor?: 'emerald' | 'cyan' | 'violet' | 'red'; badge?: string }[] = [
    { id: 'profile', label: 'Профиль', subtitle: 'Имя, аватар, статус', icon: User },
    { id: 'security', label: 'Безопасность', subtitle: 'E2EE, пароли, устройства', icon: Lock, glowColor: 'cyan' },
    { id: 'appearance', label: 'Внешний вид', subtitle: 'Тема, цвета, шрифты', icon: Palette, glowColor: 'violet' },
    { id: 'notifications', label: 'Уведомления', subtitle: 'Звуки, push-уведомления', icon: Bell },
    { id: 'devices', label: 'Устройства', subtitle: 'Активные сессии', icon: Monitor, glowColor: 'cyan' },
    { id: 'storage', label: 'Хранилище', subtitle: 'Данные и кэш', icon: HardDrive },
    { id: 'language', label: 'Язык', subtitle: 'Русский, English', icon: Globe, glowColor: 'violet' },
    { id: 'about', label: 'О приложении', subtitle: 'Версия, лицензия', icon: Info },
  ];

  if (isAdmin) {
    tabs.push({ 
      id: 'admin', 
      label: 'Админ-панель', 
      subtitle: `Управление (${ROLES[userRole].label})`, 
      icon: Gauge, 
      glowColor: 'red',
      badge: ROLES[userRole].label 
    });
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-3xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, rgba(10,15,23,0.98), rgba(5,7,13,0.99))',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 100px rgba(16,245,181,0.08)',
              }}
            >
              {/* Ambient glow */}
              <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-emerald-500/[0.06] blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-cyan-500/[0.04] blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Настройки</h2>
                    <p className="text-xs text-zinc-500">{username}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-1.5 max-h-[60vh] overflow-y-auto relative z-10">
                {tabs.map((tab) => (
                  <SettingsItem
                    key={tab.id}
                    icon={tab.icon}
                    title={tab.label}
                    subtitle={tab.subtitle}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    badge={tab.badge}
                    glowColor={tab.glowColor}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/[0.06] relative z-10 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;