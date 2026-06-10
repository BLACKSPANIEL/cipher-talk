'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Search, Settings, User } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { type Profile } from '@/lib/supabaseClient';
import { TierBadge } from './TierBadge';

interface BottomNavBarProps {
  activeView: 'chats' | 'settings';
  onSwitchView: (view: 'chats' | 'settings') => void;
  onOpenSearch: () => void;
  currentProfile: Profile | null;
  unreadCount?: number;
}

/**
 * Bottom Navigation Bar — mobile-only (hidden on md+).
 * Provides quick access to Chats, Search, and Settings.
 * Designed for maximum thumb reach on mobile devices.
 */
export function BottomNavBar({ activeView, onSwitchView, onOpenSearch, currentProfile, unreadCount = 0 }: BottomNavBarProps) {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'chats' as const,
      label: t('sidebar.encrypted_chat'),
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'search' as const,
      label: t('sidebar.new_chat'),
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: 'settings' as const,
      label: t('settings.title'),
      icon: currentProfile?.avatar_url ? (
        <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center">
          {currentProfile.avatar_url.startsWith('data:') || currentProfile.avatar_url.startsWith('http') ? (
            <img src={currentProfile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-base leading-none">{currentProfile.avatar_url}</span>
          )}
        </div>
      ) : (
        <User className="w-5 h-5" />
      ),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade above bar */}
      <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-[#05070d]/90 pointer-events-none" />

      <nav
        className="relative flex items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5"
        style={{
          background: 'linear-gradient(180deg, rgba(8,12,18,0.85) 0%, rgba(5,7,13,0.98) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(16,245,181,0.12)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(16,245,181,0.04)',
        }}
      >
        {navItems.map((item) => {
          const isActive = item.id === 'search'
            ? false // Search triggers a modal, never "active"
            : item.id === 'chats'
              ? activeView === 'chats'
              : activeView === 'settings';

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (item.id === 'search') {
                  onOpenSearch();
                } else {
                  onSwitchView(item.id);
                }
              }}
              className="relative flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-colors"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 8px rgba(16,245,181,0.8)' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}

              <div className="relative">
                <div className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                  {item.icon}
                </div>

                {/* Badge for search */}
                {item.id === 'search' && (
                  <div className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(16,245,181,0.8)' }} />
                )}

                {/* Unread count badge */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] flex items-center justify-center px-0.5 rounded-full bg-emerald-400 text-[#05070d] text-[8px] font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[9px] font-medium ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {item.id === 'chats' ? 'Chats' : item.id === 'search' ? 'Search' : 'Settings'}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}