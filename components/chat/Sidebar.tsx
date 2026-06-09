'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shield, MessageSquare, User, Loader2, Settings } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
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
  const sizeClass = size === 'sm' ? 'w-9 h-9 text-base' : 'w-10 h-10 text-sm';
  if (isImage) {
    return <div className={`${sizeClass} rounded-xl overflow-hidden flex-shrink-0`}><img src={avatar} alt={name} className="w-full h-full object-cover" /></div>;
  }
  if (isEmoji) {
    return <div className={`${sizeClass} rounded-xl bg-neon-green/15 flex items-center justify-center flex-shrink-0`}><span className="text-lg leading-none">{avatar}</span></div>;
  }
  return <div className={`${sizeClass} rounded-xl bg-neon-green/15 flex items-center justify-center flex-shrink-0`}><span className="font-bold text-neon-green text-sm">{getRoomInitial(name)}</span></div>;
}

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onOpenSearch, onOpenSettings, currentProfile, isLoadingRooms }: SidebarProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Ambient glow behind sidebar on mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden">
        <div className="absolute -top-16 -left-16 w-[200px] h-[200px] rounded-full bg-neon-green/[0.08] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[180px] h-[180px] rounded-full bg-emerald-500/[0.06] blur-3xl" />
      </div>

      {/* Logo + New Chat — compact header */}
      <div className="relative z-10 px-4 pt-4 pb-3 border-b border-zinc-800/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-green/15 flex items-center justify-center" style={{ boxShadow: '0 0 16px rgba(0,255,102,0.3)' }}>
              <Shield className="w-4 h-4 text-neon-green" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,102,0.6))' }} />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide block leading-tight">C I P H E R</span>
              <p className="text-[10px] text-zinc-500 leading-tight">{t('sidebar.encrypted_chat')}</p>
            </div>
          </div>
          <button onClick={onOpenSettings} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-neon-green hover:bg-zinc-800/50 transition" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 transition-all duration-300 text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(0,255,102,0.05))',
            boxShadow: '0 0 20px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>{t('sidebar.new_chat')}</span>
        </button>
      </div>

      {/* Room List */}
      <div className="relative z-10 flex-1 overflow-y-auto px-2 py-1">
        <AnimatePresence>
          {isLoadingRooms ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-6 px-3">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-950/40 mb-2"
                style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3), 0 0 60px rgba(0,255,102,0.1)' }}
              >
                <MessageSquare
                  className="w-7 h-7 text-emerald-400"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.7))' }}
                />
              </div>
              <p className="text-emerald-400 text-sm font-semibold" style={{ textShadow: '0 0 12px rgba(16,185,129,0.35)' }}>
                {t('sidebar.no_chats')}
              </p>
              <p className="text-zinc-500 text-[11px] mt-1 leading-snug">{t('sidebar.no_chats_hint')}</p>
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
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-xl transition-all group overflow-hidden mb-0.5 ${
                    isActive ? 'text-white' : 'hover:bg-zinc-800/40 active:bg-zinc-800/50'
                  }`}
                  style={
                    isActive
                      ? {
                          background: 'radial-gradient(circle at 0% 50%, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.06) 50%, transparent 80%)',
                          boxShadow: '0 0 20px rgba(16,185,129,0.12) inset',
                        }
                      : undefined
                  }
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-9 bg-neon-green rounded-r-full" style={{ boxShadow: '0 0 10px rgba(0,255,102,0.6)' }} />
                  )}

                  <Avatar avatar={room.otherUserAvatar} name={room.name} />

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                        {room.name}
                      </span>
                      {room.isEncrypted && <Shield className="w-3 h-3 text-neon-green/60 flex-shrink-0 ml-1" />}
                    </div>
                    {room.lastMessage && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{room.lastMessage}</p>
                    )}
                  </div>

                  {room.unread && room.unread > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-neon-green text-black text-[10px] font-bold">
                      {room.unread}
                    </span>
                  )}
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: User Profile — fixed glassmorphism panel */}
      <div className="relative z-10 mx-2 mb-2 mt-auto">
        {/* Glow border on top */}
        <div className="absolute -top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        {currentProfile ? (
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition group"
            style={{
              background: 'rgba(24,24,27,0.6)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 20px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
              border: '1px solid rgba(63,63,70,0.4)',
            }}
            title="Открыть настройки профиля"
          >
            <div className="relative flex-shrink-0">
              {currentProfile.status === 'online' ? (
                <div
                  className="rounded-xl p-[2px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.7), rgba(0,255,102,0.3))',
                    boxShadow: '0 0 14px rgba(16,185,129,0.4)',
                  }}
                >
                  <div className="rounded-[10px] overflow-hidden bg-zinc-900">
                    <Avatar avatar={(currentProfile as any).avatar_url} name={currentProfile.username} size="sm" />
                  </div>
                </div>
              ) : (
                <Avatar avatar={(currentProfile as any).avatar_url} name={currentProfile.username} size="sm" />
              )}
              {currentProfile.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-zinc-900" style={{ boxShadow: '0 0 10px rgba(0,255,102,0.8)' }} />
              )}
              {currentProfile.status === 'away' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-400 border-2 border-zinc-900" />
              )}
              {currentProfile.status === 'offline' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-zinc-900" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white truncate">{currentProfile.username}</p>
                <TierBadge tier={currentProfile.tier ?? 'free'} size="sm" />
              </div>
              <p className="text-[10px] text-zinc-500 capitalize">{currentProfile.status}</p>
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-neon-green group-hover:bg-zinc-800/60 transition">
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