'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageSquare, Loader2, Settings, Search, Lock, ChevronRight, Plus, Zap, Crown, Sparkles, Command, Code2, User, LogOut } from 'lucide-react';
import { type Profile } from '@/lib/supabaseClient';
import { TierBadge } from './TierBadge';
import { useLanguage } from '@/lib/i18n';
import { useState, useMemo, useCallback, memo } from 'react';

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

const RoomItem = memo(({ room, isActive, onSelect }: { room: ChatRoom; isActive: boolean; onSelect: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border-l-4 border-emerald-400' 
          : 'hover:bg-white/[0.03] border-l-4 border-transparent'
      }`}
      style={{
        boxShadow: isActive ? '0 0 30px rgba(16,245,181,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none'
      }}
    >
      {isHovered && !isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"
        />
      )}

      <div className="relative">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 ring-2 ring-emerald-400/50' 
            : 'bg-white/[0.05] ring-1 ring-white/10 group-hover:ring-emerald-400/30'
        }`}
        style={{ boxShadow: isActive ? '0 0 25px rgba(16,245,181,0.3)' : 'none' }}
        >
          {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
            <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full rounded-2xl object-cover" />
          ) : room.otherUserAvatar ? (
            <span className="text-xl">{room.otherUserAvatar}</span>
          ) : (
            room.name.charAt(0).toUpperCase()
          )}
        </div>
        {room.otherUserId && (
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0f17]" 
            style={{ boxShadow: '0 0 10px rgba(16,245,181,0.6)' }} />
        )}
      </div>
      
      <div className="flex-1 min-w-0 text-left relative z-10">
        <div className="flex items-center justify-between">
          <span className={`font-semibold truncate transition-colors ${isActive ? 'text-white' : 'text-zinc-200'}`}>
            {room.name}
          </span>
          {room.isEncrypted && (
            <Lock className="w-3.5 h-3.5 text-emerald-400/60" style={{ filter: 'drop-shadow(0 0 4px rgba(16,245,181,0.4))' }} />
          )}
        </div>
        {room.lastMessage && (
          <p className="text-sm text-zinc-500 truncate mt-1">
            {room.lastMessage}
          </p>
        )}
      </div>

      {room.unread && room.unread > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-xs font-bold text-black shadow-[0_0_15px_rgba(16,245,181,0.5)]"
        >
          {room.unread > 9 ? '9+' : room.unread}
        </motion.div>
      )}
    </motion.button>
  );
});
RoomItem.displayName = 'RoomItem';

function NewEmptyState({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-cyan-400/8 blur-2xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-center mb-6"
        style={{ boxShadow: '0 0 40px rgba(16,245,181,0.25)' }}
      >
        <MessageSquare className="w-10 h-10 text-emerald-400" />
      </motion.div>
      
      <h3 className="text-lg font-bold text-white mb-2">Нет чатов</h3>
      <p className="text-sm text-zinc-500 mb-6 text-center max-w-xs">
        Начните общение — найдите собеседника
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenSearch}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium"
      >
        <Plus className="w-4 h-4" />
        Найти собеседника
      </motion.button>
    </div>
  );
}

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onOpenSearch, onOpenSettings, currentProfile, isLoadingRooms }: SidebarProps) {
  const { t } = useLanguage();
  const isOnline = currentProfile?.status === 'online';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    return rooms.filter(room => 
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  const handleSelectRoom = useCallback((id: string) => {
    onSelectRoom(id);
  }, [onSelectRoom]);

  return (
    <div className="flex flex-col h-full bg-zinc-950/95 backdrop-blur-3xl relative border-r border-white/[0.08]"
      style={{ boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.05), 4px 0 24px rgba(0,0,0,0.4)' }}>
      
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/[0.08] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/[0.04] to-transparent pointer-events-none" />

      <div className="p-5 border-b border-white/[0.06] relative">
        <div className="flex items-center justify-between mb-5">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center border border-emerald-500/30"
              style={{ boxShadow: '0 0 30px rgba(16,245,181,0.2)' }}>
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-widest block">CIPHER TALK</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">E2EE Messenger</span>
            </div>
          </motion.div>
          <motion.button 
            onClick={onOpenSettings} 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-white/5 transition-all border border-transparent hover:border-emerald-500/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/30 transition-all"
          />
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {isLoadingRooms ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <NewEmptyState onOpenSearch={onOpenSearch} />
        ) : (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredRooms.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                isActive={activeRoomId === room.id}
                onSelect={() => handleSelectRoom(room.id)}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-white/[0.06] relative">
        {currentProfile ? (
          <motion.button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isOnline 
                  ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 ring-2 ring-emerald-500/30' 
                  : 'bg-white/[0.05] ring-1 ring-white/10'
              }`}
              style={{ boxShadow: isOnline ? '0 0 20px rgba(16,245,181,0.2)' : 'none' }}>
                {currentProfile.avatar_url && (currentProfile.avatar_url.startsWith('data:') || currentProfile.avatar_url.startsWith('http')) ? (
                  <img src={currentProfile.avatar_url} alt={currentProfile.username} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <span className="font-bold text-emerald-400">{currentProfile.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0f17]" 
                  style={{ boxShadow: '0 0 12px rgba(16,245,181,0.8)' }} />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white truncate text-sm">{currentProfile.username}</p>
              <p className="text-xs text-zinc-500 capitalize">{isOnline ? 'online' : currentProfile.status}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </motion.button>
        ) : (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}