'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageSquare, User, Loader2, Settings, Sparkles, Search, Lock, ChevronRight } from 'lucide-react';
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

function RoomAvatar({ avatar, name, isActive }: { avatar?: string | null; name: string; isActive: boolean }) {
  const isImage = avatar && (avatar.startsWith('data:') || avatar.startsWith('http'));
  const isEmoji = avatar && !isImage;
  
  const baseClasses = "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300";
  const activeClasses = isActive 
    ? "ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,245,181,0.3)]" 
    : "ring-1 ring-white/10 group-hover:ring-emerald-400/30";

  if (isImage) {
    return (
      <div className={`${baseClasses} ${activeClasses} overflow-hidden`}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className={`${baseClasses} ${activeClasses} bg-emerald-500/10`}>
        <span className="text-lg leading-none">{avatar}</span>
      </div>
    );
  }
  return (
    <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-emerald-500/20 to-cyan-500/10`}>
      <span className="font-bold text-emerald-300 text-sm">{getRoomInitial(name)}</span>
    </div>
  );
}

const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function EmptyChatsState({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-full min-h-[300px] px-6 text-center"
    >
      {/* Premium animated icon */}
      <div className="relative mb-6">
        <motion.div
          className="absolute inset-0 -m-6 rounded-full bg-emerald-400/15 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center"
          style={{ boxShadow: '0 0 40px rgba(16,245,181,0.25), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
          <Lock className="w-10 h-10 text-emerald-400" style={{ filter: 'drop-shadow(0 0 8px rgba(16,245,181,0.5))' }} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{t('sidebar.no_chats')}</h3>
      <p className="text-sm text-zinc-400 mb-6 max-w-xs leading-relaxed">{t('sidebar.no_chats_hint')}</p>

      <motion.button
        onClick={onOpenSearch}
        whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(16,245,181,0.4)' }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-emerald-300"
        style={{
          background: 'linear-gradient(180deg, rgba(16,185,129,0.12), rgba(16,185,129,0.06))',
          border: '1px solid rgba(16,245,181,0.25)',
          boxShadow: '0 0 20px rgba(16,245,181,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <Sparkles className="w-4 h-4" />
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
        background: 'linear-gradient(180deg, rgba(8,12,18,0.85) 0%, rgba(5,7,13,0.95) 100%)',
      }}>
      {/* Deep ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/[0.04] blur-3xl" />
        <div className="absolute top-1/2 -right-16 w-64 h-64 rounded-full bg-cyan-400/[0.03] blur-3xl" />
      </div>

      {/* Header - Ultra minimal */}
      <div className="relative z-10 px-4 pt-4 pb-3 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(16,245,181,0.2)' }}>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-[0.2em]">CIPHER TALK</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('sidebar.encrypted_chat')}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-400 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Search trigger - glass button */}
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-500">{t('sidebar.search_placeholder')}</span>
        </motion.button>
      </div>

      {/* Room list */}
      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-2.5 py-2 min-h-0">
        <AnimatePresence mode="popLayout">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            </div>
          ) : rooms.length === 0 ? (
            <EmptyChatsState onOpenSearch={onOpenSearch} />
          ) : (
            <div className="space-y-1">
              {rooms.map((room, i) => {
                const isActive = activeRoomId === room.id;
                return (
                  <motion.button
                    key={room.id}
                    variants={listItem}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectRoom(room.id)}
                    className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-400' 
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <RoomAvatar avatar={room.otherUserAvatar} name={room.name} isActive={isActive} />
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                          {room.name}
                        </span>
                        {room.isEncrypted && (
                          <Shield className="w-3.5 h-3.5 text-emerald-400/50 flex-shrink-0" />
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-xs text-zinc-500 mt-1 truncate">
                          {room.lastMessage}
                        </p>
                      )}
                    </div>

                    {room.unread && room.unread > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-emerald-400 text-[#05070d] text-xs font-bold">
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
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent mx-4 mb-2" />
        
        {currentProfile ? (
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
            style={{
              background: 'linear-gradient(180deg, rgba(14,20,28,0.6), rgba(8,12,18,0.8))',
              borderTop: '1px solid rgba(16,245,181,0.1)',
            }}
          >
            <div className="relative">
              <div className={`p-0.5 rounded-xl ${isOnline ? 'bg-gradient-to-br from-emerald-400 to-cyan-400' : 'bg-white/10'}`}>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0a0f17] flex items-center justify-center">
                  {currentProfile.avatar_url && (currentProfile.avatar_url.startsWith('data:') || currentProfile.avatar_url.startsWith('http')) ? (
                    <img src={currentProfile.avatar_url} alt={currentProfile.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-emerald-400">{currentProfile.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0f17]" 
                  style={{ boxShadow: '0 0 8px rgba(16,245,181,0.6)' }} />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white truncate">{currentProfile.username}</p>
                {currentProfile.tier && currentProfile.tier !== 'free' && <TierBadge tier={currentProfile.tier} size="sm" />}
              </div>
              <p className={`text-xs capitalize ${isOnline ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {isOnline ? t('common.online') : currentProfile.status}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </motion.button>
        ) : (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}