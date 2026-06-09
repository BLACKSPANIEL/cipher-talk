'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shield, LogOut, Settings, MessageSquare, User, Hash, Wifi, WifiOff, Clock, Loader2 } from 'lucide-react';
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

const STATUS_ICONS: Record<Profile['status'], { icon: React.ReactNode; color: string }> = {
  online: { icon: <Wifi className="w-3 h-3" />, color: 'bg-neon-green' },
  away: { icon: <Clock className="w-3 h-3" />, color: 'bg-yellow-400' },
  offline: { icon: <WifiOff className="w-3 h-3" />, color: 'bg-gray-500' },
};

export function Sidebar({ rooms, activeRoomId, onSelectRoom, onCreateRoom }: SidebarProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
      setIsLoadingProfile(false);
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const statusDisplay = profile ? STATUS_ICONS[profile.status] : STATUS_ICONS.offline;

  return (
    <div className="flex flex-col h-full bg-surface-darker/90 backdrop-blur border-r border-neon-green/10">
      {/* Logo + Header */}
      <div className="p-4 border-b border-neon-green/10">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green" />
          <span className="font-bold text-white text-lg">Cipher Talk</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Зашифрованный чат</p>
      </div>

      {/* Create Room Button */}
      <div className="p-3">
        <button
          onClick={onCreateRoom}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Создать чат-комнату</span>
        </button>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <AnimatePresence>
          {rooms.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Нет активных комнат</p>
              <p className="text-gray-600 text-xs mt-1">Создайте первую</p>
            </div>
          ) : (
            rooms.map((room) => (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => onSelectRoom(room.id)}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                  activeRoomId === room.id
                    ? 'bg-neon-green/10 border border-neon-green/30'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">
                      {room.name}
                    </span>
                  </div>
                  {room.isEncrypted && (
                    <Shield className="w-3.5 h-3.5 text-neon-green flex-shrink-0 ml-2" />
                  )}
                </div>
                {room.lastMessage && (
                  <p className="text-xs text-gray-500 mt-1 truncate pl-6">
                    {room.lastMessage}
                  </p>
                )}
                {room.unread && room.unread > 0 ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neon-green text-black text-xs font-bold mt-1 ml-6">
                    {room.unread}
                  </span>
                ) : null}
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: User Profile Card */}
      <div className="p-3 border-t border-neon-green/10">
        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
          </div>
        ) : profile ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            {/* Avatar with status dot */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                <span className="text-sm font-bold text-neon-green">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Status dot */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusDisplay.color} border-2 border-surface-darker flex items-center justify-center`}
                title={profile.status}
              >
                {statusDisplay.icon}
              </div>
            </div>

            {/* Username + status text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile.username}
              </p>
              <p className={`text-xs capitalize ${
                profile.status === 'online' ? 'text-neon-green' :
                profile.status === 'away' ? 'text-yellow-400' : 'text-gray-500'
              }`}>
                {profile.status}
              </p>
            </div>

            {/* Settings button */}
            <button
              onClick={() => router.push('/settings')}
              className="text-gray-500 hover:text-neon-green transition p-1"
              title="Настройки"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition p-1"
              title="Выйти"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
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