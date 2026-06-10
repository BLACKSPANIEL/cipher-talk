'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shield, MessageSquare, User, Loader2, Settings, Sparkles } from 'lucide-react';
import { type Profile } from '@/lib/supabaseClient';
import { TierBadge } from './TierBadge';
import { useLanguage } from '@/lib/i18n';

export interface ChatRoom {
  id: string;
  name: string;
  isEncrypted: boolean;
  lastMessage?: string;
  unread?: number;
  otherUserId?: string;
  otherUserAvatar?: string | null;
}

interface SidebarProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  currentProfile: Profile | null;
  isLoadingRooms: boolean;
}

function getRoomInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function Avatar({ avatar, name, size = 'md' }: { avatar?: string | null; name: string; size?: 'sm' | 'md' }) {
  const isImage = avatar && (avatar.startsWith('data:') || avatar.startsWith('http'));
  const isEmoji = avatar && !isImage;
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-sm';
  if (isImage) return <div className={`${sizeClass} rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10`}><img src={avatar} alt={name} className="w-full h-full object-cover" /></div>;
  if (isEmoji) return <div className={`${sizeClass} rounded-xl bg-neon-green/15 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/20`}><span className="text-base leading-none">{avatar}</span></div>;
  return <div className={`${sizeClass} rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/25`}><span className="font-bold text-emerald-300 text-xs">{getRoomInitial(name)}</span></div>;
}

const listItem = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

function EmptyChatsState({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-4 pt-6 pb-2 md:pt-10 md:pb-4"
    >
      {/* Neon icon cluster */}
      <div className="relative mb-3 md:mb-4">
        <motion.div
          className="absolute inset-0 -m-4 rounded-full bg-emerald-400/20 blur-2xl"
          animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.92, 1.08, 0.92] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 -m-2 rounded-full"
          style={{ boxShadow: '0 0 48px rgba(16,245,181,0.35), 0 0 96px rgba(0,255,102,0.12)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, rgba(16,185,129,0.18), rgba(6,78,59,0.35))',
            boxShadow: '0 0 32px rgba(16,245,181,0.45), 0 0 64px rgba(0,255,102,0.15), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 24px rgba(16,245,181,0.08)',
            border: '1px solid rgba(16,245,181,0.35)',
          }}
        >
          <MessageSquare
            className="w-5 h-5 md:w-6 md:h-6 text-emerald-300"
            style={{ filter: 'drop-shadow(0 0 10px rgba(16,245,181,0.9)) drop-shadow(0 0 20px rgba(0,255,102,0.5))' }}
          />
        </div>
      </div>

      <p className="text-[13px] md:text-sm font-semibold text-white tracking-tight">
        {t('sidebar.no_chats')}
      </p>
      <p className="mt-1 text-[10px] md:text-[11px] text-zinc-400 leading-snug max-w-[200px]">
        {t('sidebar.no_chats_hint')}
      </p>

      <motion.button
        onClick={onOpenSearch}
        whileTap={{ scale: 0.97 }}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-medium text-emerald-300/90"
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,245,181,0.2)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>{t('sidebar.new_chat')}</span>
      </motion.button>
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === 'online') {
    return (
      <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
        <span
          className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 border-[1.5px] border-[#0a0f17]"
          style={{ boxShadow: '0 0 8px rgba(16,245,181,0.95), 0 0 16px rgba(0,255,102,0.4)' }}
        />
      </span>
    );
  }
  if (status === 'away') {
    return <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-[1.5px] border-[#0a0f17]" />;
  }
  return <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-zinc-600 border-[1.5px] border-[#0a0f17]" />;
}

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onOpenSearch, onOpenSettings, currentProfile, isLoadingRooms }: SidebarProps) {
  const { t } = useLanguage();
  const isOnline = currentProfile?.status === 'online';

  return (
    <div className="flex flex-col h-full bg-transparent relative min-h-0">
      {/* Ambient glow — mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden">
        <div className="absolute -top-16 -left-16 w-[220px] h-[220px] rounded-full bg-emerald-400/[0.08] blur-3xl" />
        <div className="absolute top-1/3 -right-12 w-[160px] h-[160px] rounded-full bg-cyan-400/[0.05] blur-3xl" />
      </div>

      {/* Header — compact */}
      <div className="relative z-10 px-3 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2 md:px-4 md:pt-4 md:pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30"
              style={{ boxShadow: '0 0 20px rgba(16,245,181,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}
            >
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16,245,181,0.7))' }} />
            </motion.div>
            <div>
              <span className="font-bold text-white text-[11px] md:text-sm tracking-[0.18em] block leading-none">C I P H E R</span>
              <p className="text-[9px] md:text-[10px] text-zinc-500 leading-tight mt-0.5">{t('sidebar.encrypted_chat')}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenSettings}
            className="w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSearch}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 md:py-2.5 rounded-xl text-emerald-200 transition-all duration-300 text-[11px] md:text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, rgba(16,245,181,0.14), rgba(6,182,212,0.06))',
            boxShadow: '0 0 28px rgba(16,245,181,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(16,245,181,0.28)',
          }}
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
          <span>{t('sidebar.new_chat')}</span>
        </motion.button>
      </div>

      {/* Room list */}
      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-1.5 py-1 md:px-2 md:py-1 min-h-0">
        <AnimatePresence mode="popLayout">
          {isLoadingRooms ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-6"
            >
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            </motion.div>
          ) : rooms.length === 0 ? (
            <EmptyChatsState key="empty" onOpenSearch={onOpenSearch} />
          ) : (
            rooms.map((room, i) => {
              const isActive = activeRoomId === room.id;
              return (
                <motion.button
                  key={room.id}
                  variants={listItem}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.22, delay: i * 0.03 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => onSelectRoom(room.id)}
                  className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 md:py-2.5 rounded-xl transition-colors group overflow-hidden mb-px ${
                    isActive ? 'text-white' : 'hover:bg-white/[0.04] active:bg-white/[0.06]'
                  }`}
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(90deg, rgba(16,245,181,0.14) 0%, rgba(16,245,181,0.04) 55%, transparent 100%)',
                          boxShadow: 'inset 0 0 20px rgba(16,245,181,0.06)',
                        }
                      : undefined
                  }
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-emerald-400 rounded-r-full"
                      style={{ boxShadow: '0 0 10px rgba(16,245,181,0.8)' }}
                    />
                  )}
                  <Avatar avatar={room.otherUserAvatar} name={room.name} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[13px] font-medium truncate ${isActive ? 'text-white' : 'text-zinc-100'}`}>{room.name}</span>
                      {room.isEncrypted && <Shield className="w-3 h-3 text-emerald-500/70 flex-shrink-0" />}
                    </div>
                    {room.lastMessage && (
                      <p className="text-[10px] text-zinc-500 mt-px truncate leading-snug">{room.lastMessage}</p>
                    )}
                  </div>
                  {room.unread && room.unread > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-400 text-[#05070d] text-[9px] font-bold">
                      {room.unread}
                    </span>
                  )}
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Profile dock — glued to bottom */}
      <div className="relative z-20 mt-auto shrink-0">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent via-[#05070d]/40 to-[#05070d]/80 pointer-events-none" />
        <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />

        {currentProfile ? (
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] rounded-none md:rounded-xl transition-colors group"
            style={{
              background: 'linear-gradient(180deg, rgba(14,20,28,0.82) 0%, rgba(8,12,18,0.92) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.45), 0 0 40px rgba(16,245,181,0.04), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 32px rgba(16,245,181,0.03)',
              borderTop: '1px solid rgba(16,245,181,0.12)',
            }}
            title="Открыть настройки профиля"
          >
            <div className="relative flex-shrink-0">
              <div
                className={`rounded-[11px] p-[1.5px] ${isOnline ? 'bg-gradient-to-br from-emerald-400 via-emerald-300 to-cyan-400' : 'bg-white/10'}`}
                style={isOnline ? { boxShadow: '0 0 20px rgba(16,245,181,0.35)' } : undefined}
              >
                <div className="rounded-[10px] overflow-hidden bg-[#0a0f17]">
                  <Avatar avatar={(currentProfile as { avatar_url?: string | null }).avatar_url} name={currentProfile.username} size="sm" />
                </div>
              </div>
              <StatusDot status={currentProfile.status} />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">{currentProfile.username}</p>
                {currentProfile.tier && currentProfile.tier !== 'free' && <TierBadge tier={currentProfile.tier} size="sm" />}
              </div>
              <p className={`text-[10px] capitalize leading-tight mt-px ${isOnline ? 'text-emerald-400/90' : 'text-zinc-500'}`}>
                {isOnline ? 'Online' : currentProfile.status}
              </p>
            </div>

            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 group-hover:bg-white/[0.04] transition-colors">
              <User className="w-3.5 h-3.5" />
            </div>
          </motion.button>
        ) : (
          <div className="flex items-center justify-center py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}
