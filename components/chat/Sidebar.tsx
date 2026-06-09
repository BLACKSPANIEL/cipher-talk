'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Shield, LogOut, Settings, MessageSquare, User, Hash,
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

/** Генерирует цвет для аватарки комнаты на основе её названия */
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

  // Закрытие меню при клике вне его
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
    <div className="flex flex-col h-full bg-surface-glass-dark/80 backdrop-blur-xl border-r border-neon-green/10">
      {/* Logo — чисто декоративный, без ссылок */}
      <div className="p-4 border-b border-neon-green/10">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green" />
          <span className="font-bold text-white text-lg tracking-wide">C I P H E R</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">Зашифрованный чат</p>
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

      {/* Room List — minimal with custom avatars */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <AnimatePresence>
          {rooms.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Нет активных комнат</p>
            </div>
          ) : (
            rooms.map((room) => {
              const avatarColor = getRoomColor(room.name);
              const initial = getRoomInitial(room.name);
              return (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    activeRoomId === room.id
                      ? 'bg-neon-green/10 border border-neon-green/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Custom avatar */}
                  <div className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm font-bold text-neon-green">{initial}</span>
                  </div>

                  {/* Room info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium truncate ${activeRoomId === room.id ? 'text-neon-green' : 'text-white'}`}>
                        {room.name}
                      </span>
                      {room.isEncrypted && <Shield className="w-3 h-3 text-neon-green flex-shrink-0 ml-1" />}
                    </div>
                    {room.lastMessage && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{room.lastMessage}</p>
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

      {/* Bottom: User Profile — popup mini-menu */}
      <div className="p-3 border-t border-neon-green/10 relative" ref={userMenuRef}>
        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
          </div>
        ) : profile ? (
          <>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-neon-green">{profile.username.charAt(0).toUpperCase()}</span>
                </div>
                {profile.status === 'online' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-surface-glass-dark animate-status-pulse" />
                )}
                {profile.status === 'away' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-400 border-2 border-surface-glass-dark" />
                )}
                {profile.status === 'offline' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-surface-glass-dark" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">{profile.username}</p>
                <p className="text-xs text-gray-500 capitalize">{profile.status}</p>
              </div>
              {isUserMenuOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Popup menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-neon-green/10 bg-surface-glass-dark backdrop-blur-2xl shadow-glass-lg overflow-hidden"
                >
                  {/* Status quick-select */}
                  <div className="p-2 space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 py-1">Статус</p>
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleStatusChange(opt.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                          profile.status === opt.value
                            ? 'bg-neon-green/10 text-neon-green'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${opt.color}`} />
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-neon-green/5" />

                  {/* Settings & Logout */}
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition"
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