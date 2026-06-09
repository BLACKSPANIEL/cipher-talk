'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Shield, MessageSquare, User, Loader2
} from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';

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
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-base' : 'w-9 h-9 text-sm';
  if (isImage) {
    return (
      <div className={`${sizeClass} rounded-xl overflow-hidden flex-shrink-0`}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className={`${sizeClass} rounded-xl bg-neon-green/15 flex items-center justify-center flex-shrink-0`}>
        <span className="text-lg leading-none">{avatar}</span>
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl bg-neon-green/15 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-neon-green">{getRoomInitial(name)}</span>
    </div>
  );
}

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onOpenSearch, onOpenSettings, currentProfile, isLoadingRooms }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Logo — decorative */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]" />
          <span className="font-bold text-white text-lg tracking-wide">C I P H E R</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Зашифрованный чат</p>
      </div>

      {/* New Chat button — opens search modal */}
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Новый чат</span>
        </button>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        <AnimatePresence>
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-10 px-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/50 mb-2">
                <MessageSquare className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-sm font-medium">Нет чатов</p>
              <p className="text-zinc-600 text-xs mt-1">Нажмите «Новый чат» чтобы найти собеседника</p>
            </div>
          ) : (
            rooms.map((room) => {
              const isActive = activeRoomId === room.id;
              return (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onSelectRoom(room.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive ? 'bg-zinc-800/70' : 'hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Active indicator — 3px vertical neon-green bar on the left */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-neon-green rounded-r-full shadow-[0_0_8px_rgba(0,255,102,0.5)]" />
                  )}

                  <Avatar avatar={room.otherUserAvatar} name={room.name} />

                  {/* Room info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                        {room.name}
                      </span>
                      {room.isEncrypted && <Shield className="w-3 h-3 text-neon-green/60 flex-shrink-0 ml-1" />}
                    </div>
                    {room.lastMessage && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">{room.lastMessage}</p>
                    )}
                  </div>

                  {room.unread && room.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neon-green text-black text-xs font-bold">
                      {room.unread}
                    </span>
                  )}
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: User Profile — click opens Settings modal */}
      <div className="relative p-3">
        {/* Blurred separator line */}
        <div className="absolute -top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent backdrop-blur-sm" />

        {currentProfile ? (
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-800/50 transition group"
            title="Открыть настройки профиля"
          >
            <div className="relative flex-shrink-0">
              <Avatar avatar={(currentProfile as any).avatar_url} name={currentProfile.username} size="sm" />
              {currentProfile.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-zinc-900 animate-status-pulse" />
              )}
              {currentProfile.status === 'away' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-400 border-2 border-zinc-900" />
              )}
              {currentProfile.status === 'offline' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-zinc-900" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{currentProfile.username}</p>
              <p className="text-xs text-zinc-500 capitalize">{currentProfile.status}</p>
            </div>
            {/* Settings indicator */}
            <div className="flex items-center justify-center w-7 h-7 rounded-md text-zinc-500 group-hover:text-neon-green group-hover:bg-zinc-800/60 transition-colors">
              <User className="w-3.5 h-3.5" />
            </div>
          </button>
        ) : (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
          </div>
        )}
      </div>
    </div>
  );
}
