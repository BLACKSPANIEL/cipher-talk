'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageSquare, Loader2, Settings, Search, Lock, ChevronRight, Plus, Zap, Crown, Sparkles } from 'lucide-react';
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
  
  if (isImage) {
    return (
      <div className="w-14 h-14 rounded-3xl overflow-hidden flex-shrink-0 ring-2 ring-white/10 transition-all duration-300">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 ring-2 ring-emerald-500/30 transition-all duration-300">
        <span className="text-2xl leading-none">{avatar}</span>
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 flex items-center justify-center flex-shrink-0 ring-2 ring-emerald-500/40 transition-all duration-300">
      <span className="font-bold text-emerald-300 text-xl">{getRoomInitial(name)}</span>
    </div>
  );
}

const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function EmptyChatsState({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-full min-h-[400px] px-8 text-center"
    >
      <div className="relative mb-10">
        <motion.div
          className="absolute inset-0 -m-12 rounded-full bg-emerald-400/25 blur-3xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/25 border-2 border-emerald-500/50 flex items-center justify-center"
          style={{ 
            boxShadow: '0 0 60px rgba(16,245,181,0.4), 0 0 120px rgba(16,245,181,0.2), inset 0 2px 0 rgba(255,255,255,0.15)' 
          }}>
          <Lock className="w-14 h-14 text-emerald-400" style={{ filter: 'drop-shadow(0 0 15px rgba(16,245,181,0.7))' }} />
        </div>
      </div>

      <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
        {t('sidebar.no_chats')}
      </h3>
      <p className="text-lg text-zinc-400 mb-10 max-w-sm leading-relaxed">
        {t('sidebar.no_chats_hint')}
      </p>

      <motion.button
        onClick={onOpenSearch}
        whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(16,245,181,0.6)' }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-4 px-10 py-5 rounded-3xl text-lg font-bold text-emerald-300"
        style={{
          background: 'linear-gradient(180deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
          border: '2px solid rgba(16,245,181,0.4)',
          boxShadow: '0 0 35px rgba(16,245,181,0.3), inset 0 2px 0 rgba(255,255,255,0.1)',
        }}
      >
        <Plus className="w-6 h-6" />
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
        background: 'linear-gradient(180deg, rgba(8,12,20,0.9) 0%, rgba(5,7,15,0.95) 100%)',
      }}>
      {/* Deep ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/[0.08] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-400/[0.06] blur-3xl" />
      </div>

      {/* Header - Premium glass panel */}
      <div className="relative z-10 px-6 pt-6 pb-5 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/25 flex items-center justify-center"
              style={{ 
                boxShadow: '0 0 30px rgba(16,245,181,0.3), 0 0 60px rgba(16,245,181,0.15)',
                border: '1px solid rgba(16,245,181,0.3)'
              }}>
              <Shield className="w-6 h-6 text-emerald-400" style={{ filter: 'drop-shadow(0 0 10px rgba(16,245,181,0.6))' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-[0.25em]">CIPHER TALK</h1>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">{t('sidebar.encrypted_chat')}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="w-12 h-12 rounded-3xl flex items-center justify-center text-zinc-500 hover:text-emerald-400 transition-all"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Search trigger - Premium glass button */}
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenSearch}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-lg"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <Search className="w-5 h-5 text-zinc-500" />
          <span className="text-zinc-500">{t('sidebar.search_placeholder')}</span>
        </motion.button>
      </div>

      {/* Room list */}
      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-3 min-h-0">
        <AnimatePresence mode="popLayout">
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-400" style={{ filter: 'drop-shadow(0 0 15px rgba(16,245,181,0.5))' }} />
            </div>
          ) : rooms.length === 0 ? (
            <EmptyChatsState onOpenSearch={onOpenSearch} />
          ) : (
            <div className="space-y-2">
              {rooms.map((room, i) => {
                const isActive = activeRoomId === room.id;
                return (
                  <motion.button
                    key={room.id}
                    variants={listItem}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectRoom(room.id)}
                    className={`relative w-full flex items-center gap-4 px-5 py-5 rounded-3xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border-l-4 border-emerald-400' 
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <RoomAvatar avatar={room.otherUserAvatar} name={room.name} isActive={isActive} isOnline={!!room.otherUserId} />
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-lg font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                          {room.name}
                        </span>
                        {room.isEncrypted && (
                          <Shield className="w-5 h-5 text-emerald-400/70 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(16,245,181,0.4))' }} />
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-base text-zinc-500 mt-1.5 truncate">
                          {room.lastMessage}
                        </p>
                      )}
                    </div>

                    {room.unread && room.unread > 0 && (
                      <span className="flex items-center justify-center min-w-[28px] h-[28px] px-2.5 rounded-full bg-emerald-400 text-[#05070d] text-base font-bold">
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

      {/* Profile section - Premium glass dock */}
      <div className="relative z-20 mt-auto shrink-0">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent mx-6 mb-4" />
        
        {currentProfile ? (
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all"
            style={{
              background: 'linear-gradient(180deg, rgba(20,28,40,0.7), rgba(15,22,32,0.85))',
              borderTop: '1px solid rgba(16,245,181,0.2)',
            }}
          >
            <div className="relative">
              <div className={`p-1 rounded-3xl ${isOnline ? 'bg-gradient-to-br from-emerald-400 to-cyan-400' : 'bg-white/20'}`}
                style={isOnline ? { boxShadow: '0 0 35px rgba(16,245,181,0.5)' } : undefined}
              >
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#0a0f17] flex items-center justify-center">
                  {currentProfile.avatar_url && (currentProfile.avatar_url.startsWith('data:') || currentProfile.avatar_url.startsWith('http')) ? (
                    <img src={currentProfile.avatar_url} alt={currentProfile.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-emerald-400">{currentProfile.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0a0f17]" 
                  style={{ boxShadow: '0 0 15px rgba(16,245,181,0.8)' }} />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-white truncate">{currentProfile.username}</p>
                {currentProfile.tier && currentProfile.tier !== 'free' && <TierBadge tier={currentProfile.tier as any} size="sm" />}
              </div>
              <p className={`text-base capitalize ${isOnline ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {isOnline ? t('common.online') : currentProfile.status}
              </p>
            </div>

            <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </motion.button>
        ) : (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}