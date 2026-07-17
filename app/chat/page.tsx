'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, type ChatRoom } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { SearchUserModal } from '@/components/chat/SearchUserModal';
import { SettingsModal } from '@/components/chat/SettingsModal';
import { BottomNavBar } from '@/components/chat/BottomNavBar';
import { type Message } from '@/components/chat/MessageBubble';
import { type CipherType, encryptText } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';
import type { DbMessage, Profile } from '@/lib/supabaseClient';
import { encryptMessage, decryptMessage } from '@/lib/cryptoUtils';

/** Кэш профилей: sender_id → username */
const profilesCache = new Map<string, string>();
/** Кэш аватаров: user_id → avatar_url */
const avatarsCache = new Map<string, string | null>();

async function enrichMessagesWithProfiles(
  rows: DbMessage[],
  currentUserId: string
): Promise<Message[]> {
  const senderIds = [...new Set(rows.map((r) => r.sender_id))];
  const missingIds = senderIds.filter((id) => !profilesCache.has(id));
  if (missingIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', missingIds);
    if (data) {
      data.forEach((p) => {
        profilesCache.set(p.id, p.username);
        avatarsCache.set(p.id, (p as any).avatar_url || null);
      });
    }
  }

  const results: Message[] = [];
  for (const row of rows) {
    const username = profilesCache.get(row.sender_id) || 'Unknown';
    const avatar = avatarsCache.get(row.sender_id) || null;
    const aesDecrypted = await decryptMessage(row.text);
    const wasAesEncrypted = aesDecrypted !== row.text && aesDecrypted.length > 0;
    const hasVisibleCipher = row.cipher_type === 'caesar' || row.cipher_type === 'base64';
    const decrypted = hasVisibleCipher ? aesDecrypted : aesDecrypted;

    results.push({
      id: row.id,
      text: decrypted,
      senderId: row.sender_id,
      senderName: username,
      sender: row.sender_id === currentUserId ? 'me' : 'other',
      senderAvatar: avatar,
      timestamp: new Date(row.created_at),
      roomId: row.room_id,
      cipher: hasVisibleCipher ? row.cipher_type : undefined,
      isEncrypted: hasVisibleCipher,
      originalText: hasVisibleCipher ? decrypted : undefined,
      isE2ee: wasAesEncrypted,
      status: 'sent' as const,
    });
  }
  return results;
}

interface ChatWithProfile extends ChatRoom {
  otherUserId?: string;
  otherUserAvatar?: string | null;
}

async function loadRooms(currentUserId: string): Promise<ChatWithProfile[]> {
  const { data: members, error: membersErr } = await supabase
    .from('room_members')
    .select('room_id')
    .eq('user_id', currentUserId);
  if (membersErr) {
    console.error('loadRooms members:', membersErr);
    return [];
  }
  if (!members || members.length === 0) return [];

  const roomIds = members.map((m) => m.room_id);

  const { data: rooms, error: roomsErr } = await supabase
    .from('rooms')
    .select('id, name, created_at, is_encrypted')
    .in('id', roomIds as string[])
    .order('created_at', { ascending: false });
  if (roomsErr) {
    console.error('loadRooms rooms:', roomsErr);
    return [];
  }
  if (!rooms) return [];

  const result: ChatWithProfile[] = [];
  for (const room of rooms) {
    const { data: otherMembers } = await supabase
      .from('room_members')
      .select('user_id')
      .eq('room_id', room.id)
      .neq('user_id', currentUserId)
      .limit(1);

    let otherUserId: string | undefined;
    let otherUserAvatar: string | null = null;
    let displayName = room.name || 'Чат';

    if (otherMembers && otherMembers.length > 0) {
      const candidateId = otherMembers[0].user_id;
      if (candidateId) {
        otherUserId = candidateId;
        const cachedName = profilesCache.get(candidateId);
        const cachedAvatar = avatarsCache.get(candidateId);
        if (cachedName) {
          displayName = cachedName;
          otherUserAvatar = cachedAvatar ?? null;
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', candidateId)
            .single();
          if (profile) {
            displayName = profile.username;
            otherUserAvatar = (profile as any).avatar_url || null;
            profilesCache.set(candidateId, profile.username);
            avatarsCache.set(candidateId, otherUserAvatar);
          }
        }
      }
    }

    result.push({
      id: room.id,
      name: displayName,
      isEncrypted: (room as any).is_encrypted ?? true,
      otherUserId,
      otherUserAvatar,
    });
  }
  return result;
}

async function findOrCreateRoom(currentUserId: string, otherUserId: string): Promise<string | null> {
  const { data: myRooms } = await supabase
    .from('room_members')
    .select('room_id')
    .eq('user_id', currentUserId);

  if (myRooms && myRooms.length > 0) {
    const myRoomIds = myRooms.map((m) => m.room_id);
    const { data: sharedRoom } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', otherUserId)
      .in('room_id', myRoomIds)
      .limit(1)
      .single();
    if (sharedRoom) return sharedRoom.room_id;
  }

  const { data: newRoom, error: roomErr } = await supabase
    .from('rooms')
    .insert({ name: '', is_encrypted: true })
    .select('id')
    .single();
  if (roomErr || !newRoom) {
    console.error('createRoom:', roomErr);
    return null;
  }
  const { error: membersErr } = await supabase
    .from('room_members')
    .insert([
      { room_id: newRoom.id, user_id: currentUserId },
      { room_id: newRoom.id, user_id: otherUserId },
    ]);
  if (membersErr) {
    console.error('addMembers:', membersErr);
    return null;
  }
  return newRoom.id;
}

export default function ChatPage() {
  const router = useRouter();

  const [rooms, setRooms] = useState<ChatWithProfile[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [decryptingMessageId, setDecryptingMessageId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<'chats' | 'settings'>('chats');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const presenceRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  const handleSelectRoom = useCallback((id: string) => {
    setActiveRoomId(id);
    setMobileShowChat(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  const handleMobileSwitchView = useCallback((view: 'chats' | 'settings') => {
    setMobileActiveView(view);
    if (view === 'settings') {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
      setMobileShowChat(false);
    }
  }, []);

  // Auth guard + load profile + rooms
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (prof) {
          setCurrentProfile(prof as Profile);
          profilesCache.set(prof.id, prof.username);
          avatarsCache.set(prof.id, (prof as any).avatar_url || null);
        }
        const loaded = await loadRooms(user.id);
        setRooms(loaded);
        if (loaded.length > 0) setActiveRoomId(loaded[0].id);
      } else {
        router.push('/login');
      }
    });
  }, [router]);

  // History load
  useEffect(() => {
    if (!activeRoomId || !currentUserId) return;
    let cancelled = false;
    setIsLoadingHistory(true);

    supabase
      .from('messages')
      .select('*')
      .eq('room_id', activeRoomId)
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        if (cancelled) return;
        if (error) { console.error(error); setMessages([]); }
        else if (data) setMessages(await enrichMessagesWithProfiles(data, currentUserId));
        setIsLoadingHistory(false);
      });

    return () => { cancelled = true; };
  }, [activeRoomId, currentUserId]);

  // Realtime subscription with read receipts
  useEffect(() => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    if (!activeRoomId || !currentUserId) return;

    const channel = supabase
      .channel(`room-${activeRoomId}`)
      .on<DbMessage>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${activeRoomId}` },
        async (payload) => {
          const enriched = await enrichMessagesWithProfiles([payload.new], currentUserId);
          const newMessage = enriched[0];
          if (!newMessage) return;

          // Auto-mark as delivered
          newMessage.status = 'delivered';

          // If message is from other user, mark as read immediately
          if (payload.new.sender_id !== currentUserId) {
            await supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', payload.new.id);
            newMessage.status = 'read';
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            const optimisticIdx = prev.findIndex(
              (m) => m.sender === 'me' && m.status === 'sending' && m.text === newMessage.text && m.roomId === newMessage.roomId
            );
            if (optimisticIdx !== -1) {
              const next = [...prev];
              next[optimisticIdx] = newMessage;
              return next;
            }
            return [...prev, newMessage];
          });

          setRooms((prev) => prev.map((r) => r.id === activeRoomId ? { ...r, lastMessage: payload.new.text } : r));
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [activeRoomId, currentUserId]);

  // Presence (online tracking)
  useEffect(() => {
    if (!currentUserId) return;
    
    const channel = supabase.channel('online-users', { 
      config: { presence: { key: currentUserId } } 
    });
    
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const online = new Set<string>();
      
      Object.keys(state).forEach((userId) => {
        const presence = state[userId] as any[];
        if (presence && presence.length > 0 && presence[0].online_at) {
          online.add(userId);
        }
      });
      
      setOnlineUsers(online);
    });
    
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ 
          user_id: currentUserId, 
          online_at: new Date().toISOString(),
          username: currentProfile?.username 
        });
      }
    });
    
    presenceRef.current = channel;
    return () => { 
      if (presenceRef.current) {
        supabase.removeChannel(presenceRef.current);
        presenceRef.current = null;
      }
    };
  }, [currentUserId, currentProfile]);

  const handleStartChat = useCallback(
    async (otherUser: { id: string; username: string; avatar_url?: string | null }) => {
      if (!currentUserId) return;
      const roomId = await findOrCreateRoom(currentUserId, otherUser.id);
      if (!roomId) return;
      const loaded = await loadRooms(currentUserId);
      setRooms(loaded);
      setActiveRoomId(roomId);
      setMobileShowChat(true);
    },
    [currentUserId]
  );

  const handleSendMessage = useCallback(
    async (text: string, cipher: CipherType) => {
      if (!activeRoomId || !currentUserId) return;
      const visibleCipherText = cipher !== 'none' ? encryptText(text, cipher) : text;
      const e2eeCipherText = encryptMessage(visibleCipherText);
      const tempId = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
        ? globalThis.crypto.randomUUID()
        : `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      const optimisticMessage: Message = {
        id: tempId, text: visibleCipherText, senderId: currentUserId, senderName: currentProfile?.username || 'Я',
        sender: 'me', senderAvatar: (currentProfile as any)?.avatar_url || null, timestamp: new Date(),
        roomId: activeRoomId, cipher: cipher !== 'none' ? cipher : undefined, isEncrypted: cipher !== 'none',
        originalText: visibleCipherText, isE2ee: true, status: 'sending',
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setRooms((prev) => prev.map((r) => r.id === activeRoomId ? { ...r, lastMessage: visibleCipherText } : r));

      const { data, error } = await supabase
        .from('messages')
        .insert({ room_id: activeRoomId, sender_id: currentUserId, text: e2eeCipherText, cipher_type: cipher })
        .select('id').single();

      if (error) {
        setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, status: 'error' } : m));
        return;
      }
      setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, id: data!.id, status: 'sent' } : m));
    },
    [activeRoomId, currentUserId, currentProfile]
  );

  const handleDecryptMessage = useCallback((messageId: string) => {
    setDecryptingMessageId(messageId);
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => {
        if (msg.id === messageId && msg.isEncrypted && msg.originalText && msg.cipher) {
          const decrypted = msg.cipher === 'caesar' 
            ? msg.originalText 
            : msg.originalText;
          return { ...msg, text: decrypted, isEncrypted: false, originalText: undefined };
        }
        return msg;
      }));
      setDecryptingMessageId(null);
    }, 600);
  }, []);

  const handleProfileUpdated = useCallback((updated: Profile) => {
    setCurrentProfile(updated);
    if (updated.id) { profilesCache.set(updated.id, updated.username); avatarsCache.set(updated.id, (updated as any).avatar_url || null); }
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col bg-[#05070d] text-white relative overflow-hidden">
      {/* Ultra-premium gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-[380px] h-[380px] rounded-full bg-emerald-400/[0.07] blur-3xl"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-cyan-400/[0.04] blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/[0.03] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.018] md:opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,245,181,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(16,245,181,0.25) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden min-h-0 p-0 md:p-5 gap-0 md:gap-5">
        {/* Sidebar with enhanced glassmorphism */}
        <motion.aside
          initial={false}
          animate={{ opacity: mobileShowChat ? 0 : 1, x: mobileShowChat ? -20 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full md:w-72 flex-shrink-0 md:rounded-2xl overflow-hidden border-0 md:border border-white/[0.08] backdrop-blur-2xl flex flex-col min-h-0 ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
          style={{
            background: 'linear-gradient(180deg, rgba(8,12,18,0.75) 0%, rgba(5,7,13,0.88) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <Sidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={handleSelectRoom}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            currentProfile={currentProfile}
            isLoadingRooms={!currentUserId}
          />
        </motion.aside>

        {/* Chat window with enhanced glassmorphism */}
        <AnimatePresence mode="wait">
          {mobileShowChat ? (
            <motion.main
              key="chat"
              initial={{ x: '100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.6 }}
              transition={{ type: 'spring', damping: 30, stiffness: 340, mass: 0.75 }}
              className="flex-1 min-w-0 md:rounded-2xl overflow-hidden border-0 md:border border-white/[0.08] backdrop-blur-2xl flex flex-col absolute md:relative inset-0 z-30 md:z-auto min-h-0"
              style={{
                background: 'linear-gradient(180deg, rgba(8,12,18,0.8) 0%, rgba(5,7,13,0.94) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <ChatWindow
                room={activeRoom}
                messages={messages}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
                onDecryptMessage={handleDecryptMessage}
                decryptingMessageId={decryptingMessageId}
                onBack={handleBackToList}
              />
            </motion.main>
          ) : (
            <motion.main
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex-1 min-w-0 md:rounded-2xl overflow-hidden border-0 md:border border-white/[0.08] backdrop-blur-2xl flex-col hidden md:flex min-h-0"
              style={{
                background: 'linear-gradient(180deg, rgba(8,12,18,0.8) 0%, rgba(5,7,13,0.94) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <ChatWindow
                room={activeRoom}
                messages={messages}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
                onDecryptMessage={handleDecryptMessage}
                decryptingMessageId={decryptingMessageId}
                onBack={handleBackToList}
              />
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar — mobile only */}
      <BottomNavBar
        activeView={mobileActiveView}
        onSwitchView={handleMobileSwitchView}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentProfile={currentProfile}
        unreadCount={rooms.reduce((sum, r) => sum + (r.unread ?? 0), 0)}
      />

      {/* Bottom padding for mobile nav bar */}
      <div className="md:hidden h-16 shrink-0" />

      {/* Modals */}
      <SearchUserModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} currentUserId={currentUserId} onStartChat={handleStartChat} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} profile={currentProfile} onProfileUpdated={handleProfileUpdated} />
    </div>
  );
}