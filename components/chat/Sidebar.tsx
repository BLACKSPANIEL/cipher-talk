'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageSquare, User, Loader2, Settings, Sparkles, Search, Lock, ChevronRight, Plus, Users, Archive } from 'lucide-react';
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

function RoomAvatar({ avatar, name, isActive, isOnline }: { 
  avatar?: string | null; 
  name: string; 
  isActive: boolean;
  isOnline?: boolean;
}) {
  const isImage = avatar && (avatar.startsWith('data:') || avatar.startsWith('http'));
  const isEmoji = avatar && !isImage;
  
  const baseClasses = "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300";
  const activeClasses = isActive 
    ? "ring-2 ring-emerald-400/60 shadow-[0_0_25px_rgba(16,245,181,0.4)]" 
    : "ring-1 ring-white/10 group-hover:ring-emerald-400/40";

  if (isImage) {
    return (
      <div className={`${baseClasses} ${activeClasses} overflow-hidden`}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className={`${baseClasses} ${activeClasses} bg-emerald-500/15`}>
        <span className="text-xl leading-none">{avatar}</span>
      </div>
    );
  }
  return (
    <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-emerald-500/25 to-cyan-500/15`}>
      <span className="font-bold text-emerald-300 text-base">{getRoomInitial(name)}</span>
    </div>
  );
}

const listItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function EmptyChatsState({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-full min-h-[320px] px-6 text-center"
    >
      <div className="relative mb-8">
        <motion.div
          className="absolute inset-0 -m-8 rounded-full bg-emerald-400/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/20 border-2 border-emerald-500/40 flex items-center justify-center"
          style={{ boxShadow: '0 0 50px rgba(16,245,181,0.3), 0 0 100px rgba(16,245,181,0.15), inset 0 2px 0 rgba(255,255,255,0.1)' }}>
          <Lock className="w-12 h-12 text-emerald-400" style={{ filter: 'drop-shadow(0 0 12px rgba(16,245,181,0.6))' }} />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        {t('sidebar.no_chats')}
      </h3>
      <p className="text-base text-zinc-400 mb-8 max-w-xs leading-relaxed">
        {t('sidebar.no_chats_hint')}
      </p>

      <motion.button
        onClick={onOpenSearch}
        whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(16,245,181,0.5)' }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-emerald-300"
        style={{
          background: 'linear-gradient(180deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
          border: '2px solid rgba(16,245,181,0.3)',
          boxShadow: '0 0 25px rgba(16,245,181,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <Plus className="w-5 h-5" />
        {t('sidebar.new_chat')}
      </motion.button>
    </motion.div>
  );
}

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onOpenSearch, onOpenSettings, currentProfile, isLoadingRooms }: SidebarProps) {
  const { t } = useLanguage();
  const isOnline = currentProfile?.status === 'online';

  return (
    <div className="flex flex-col h-full relative min-h-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(10,15,23,0.95) 0%, rgba(5,7,13,0.98) 100%)',
      }}>
      {/* Deep ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-400/[0.05] blur-3xl" />
        <div className="absolute top-2/3 -right-20 w-72 h-72 rounded-full bg-cyan-400/[0.04] blur-3xl" />
      </div>

      {/* Header - Ultra minimal */}
      <div className="relative z-10 px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/20 flex items-center justify-center"
              style={{ boxShadow: '0 0 25px rgba(16,245,181,0.25), 0 0 50px rgba(16,245,181,0.1)' }}>
              <Shield className="w-5 h-5 text-emerald-400" style={{ filter: 'drop-shadow(0 0 8px rgba(16,245,181,0.6))' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-[0.2em]">CIPHER TALK</h1>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{t('sidebar.encrypted_chat')}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-emerald-400 transition-all"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Search trigger - glass button */}
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenSearch}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-500">{t('sidebar.search_placeholder')}</span>
        </motion.button>
      </div>

      {/* Room list */}
      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-3 py-2.5 min-h-0">
        <AnimatePresence mode="popLayout">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-400" style={{ filter: 'drop-shadow(0 0 10px rgba(16,245,181,0.4))' }} />
            </div>
          ) : rooms.length === 0 ? (
            <EmptyChatsState onOpenSearch={onOpenSearch} />
          ) : (
            <div className="space-y-1.5">
              {rooms.map((room, i) => {
                const isActive = activeRoomId === room.id;
                return (
                  <motion.button
                    key={room.id}
                    variants={listItem}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectRoom(room.id)}
                    className={`relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border-l-3 border-emerald-400' 
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <RoomAvatar avatar={room.otherUserAvatar} name={room.name} isActive={isActive} isOnline={!!room.otherUserId} />
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-base font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                          {room.name}
                        </span>
                        {room.isEncrypted && (
                          <Shield className="w-4 h-4 text-emerald-400/60 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(16,245,181,0.3))' }} />
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-sm text-zinc-500 mt-1 truncate">
                          {room.lastMessage}
                        </p>
                      )}
                    </div>

                    {room.unread && room.unread > 0 && (
                      <span className="flex items-center justify-center min-w-[24px] h-[24px] px-2 rounded-full bg-emerald-400 text-[#05070d] text-sm font-bold">
                        {room.unread > 99 ? '99+' : room.unread}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile section - premium glass dock */}
      <div className="relative z-20 mt-auto shrink-0">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent mx-5 mb-3" />
        
        {currentProfile ? (
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all"
            style={{
              background: 'linear-gradient(180deg, rgba(20,28,38,0.7), rgba(12,18,26,0.9))',
              borderTop: '1px solid rgba(16,245,181,0.15)',
            }}
          >
            <div className="relative">
              <div className={`p-0.5 rounded-2xl ${isOnline ? 'bg-gradient-to-br from-emerald-400 to-cyan-400' : 'bg-white/15'}`}
                style={isOnline ? { boxShadow: '0 0 25px rgba(16,245,181,0.4)' } : undefined}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#0a0f17] flex items-center justify-center">
                  {currentProfile.avatar_url && (currentProfile.avatar_url.startsWith('data:') || currentProfile.avatar_url.startsWith('http')) ? (
                    <img src={currentProfile.avatar_url} alt={currentProfile.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-emerald-400">{currentProfile.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0f17]" 
                  style={{ boxShadow: '0 0 12px rgba(16,245,181,0.7)' }} />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-white truncate">{currentProfile.username}</p>
                {currentProfile.tier && currentProfile.tier !== 'free' && <TierBadge tier={currentProfile.tier as any} size="sm" />}
              </div>
              <p className={`text-sm capitalize ${isOnline ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {isOnline ? t('common.online') : currentProfile.status}
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </motion.button>
        ) : (
          <div className="flex items-center justify-center py-5">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}