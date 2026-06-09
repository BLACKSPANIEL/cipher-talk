'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Shield, LogOut, Settings, MessageSquare, User,
  Wifi, WifiOff, Clock, Loader2, ChevronUp, ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export interface ChatRoom {
  id: string;
  name: string;
  isEncrypted: boolean;
  lastMessage?: string;
  unread?: number;
}

interface SidebarProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
  onCreateRoom: () => void;
}

const STATUS_OPTIONS: { value: Profile['status']; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'online', label: 'Online', icon: <Wifi className="w-3 h-3" />, color: 'bg-neon-green' },
  { value: 'away', label: 'Away', icon: <Clock className="w-3 h-3" />, color: 'bg-yellow-400' },
  { value: 'offline', label: 'Offline', icon: <WifiOff className="w-3 h-3" />, color: 'bg-gray-500' },
];

function getRoomColor(name: string): string {
  const colors = ['bg-neon-green/20', 'bg-blue-500/20', 'bg-purple-500/20', 'bg-pink-500/20', 'bg-amber-500/20', 'bg-cyan-500/20'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getRoomInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onCreateRoom }: SidebarProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoadingProfile(false); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
      setIsLoadingProfile(false);
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleStatusChange = async (newStatus: Profile['status']) => {
    if (!profile) return;
    await supabase.from('profiles').update({ status: newStatus }).eq('id', profile.id);
    setProfile({ ...profile, status: newStatus });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/60 backdrop-blur-md border-r border-zinc-800/50">
      {/* Logo — decorative */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green" />
          <span className="font-bold text-white text-lg tracking-wide">C I P H E R</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Зашифрованный чат</p>
      </div>

      {/* Create Room */}
      <div className="p-3">
        <button
          onClick={onCreateRoom}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Новая комната</span>
        </button>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        <AnimatePresence>
          {rooms.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">Нет активных комнат</p>
            </div>
          ) : (
            rooms.map((room) => {
              const avatarColor = getRoomColor(room.name);
              const initial = getRoomInitial(room.name);
              const isActive = activeRoomId === room.id;
              return (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onSelectRoom(room.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-zinc-800/70'
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Active indicator — 3px vertical neon-green bar on the left */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-neon-green rounded-r-full shadow-[0_0_8px_rgba(0,255,102,0.5)]" />
                  )}

                  {/* Custom avatar */}
                  <div className={`w-9 h-9 rounded-xl ${isActive ? 'bg-neon-green/20' : avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-bold ${isActive ? 'text-neon-green' : 'text-neon-green'}`}>{initial}</span>
                  </div>

                  {/* Room info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
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

      {/* Bottom: User Profile — visually separated with blurred border */}
      <div className="relative p-3" ref={userMenuRef}>
        {/* Blurred separator line */}
        <div className="absolute -top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent backdrop-blur-sm" />

        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
          </div>
        ) : profile ? (
          <>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-800/40 transition group"
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-neon-green">{profile.username.charAt(0).toUpperCase()}</span>
                </div>
                {profile.status === 'online' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-zinc-900 animate-status-pulse" />
                )}
                {profile.status === 'away' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-400 border-2 border-zinc-900" />
                )}
                {profile.status === 'offline' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-zinc-900" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{profile.username}</p>
                  {/* Settings gear icon next to username */}
                  <Settings
                    className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); router.push('/settings'); }}
                  />
                </div>
                <p className="text-xs text-zinc-500 capitalize">{profile.status}</p>
              </div>
              {isUserMenuOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronUp className="w-4 h-4 text-zinc-500" />}
            </button>

            {/* Popup menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-zinc-800/50 bg-zinc-900/90 backdrop-blur-2xl shadow-glass-lg overflow-hidden"
                >
                  <div className="p-2 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 px-3 py-1">Статус</p>
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleStatusChange(opt.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                          profile.status === opt.value
                            ? 'bg-neon-green/10 text-neon-green'
                            : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${opt.color}`} />
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-zinc-800/50" />
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/40 hover:text-white transition"
                    >
                      <Settings className="w-4 h-4" />
                      Настройки
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neon-green/30 text-neon-green hover:bg-neon-green/10 transition-all text-sm"
          >
            <User className="w-4 h-4" />
            <span>Войти</span>
          </button>
        )}
      </div>
    </div>
  );
}