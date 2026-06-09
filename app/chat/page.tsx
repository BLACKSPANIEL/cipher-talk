'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, type ChatRoom } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { SearchUserModal } from '@/components/chat/SearchUserModal';
import { SettingsModal } from '@/components/chat/SettingsModal';
import { type Message } from '@/components/chat/MessageBubble';
import { type CipherType, encryptText, caesarDecrypt, base64Decode } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';
import type { DbMessage, Profile } from '@/lib/supabaseClient';
import { encryptMessage, decryptMessage } from '@/lib/cryptoUtils';

/** Кэш профилей: sender_id → username */
const profilesCache = new Map<string, string>();
/** Кэш аватаров: user_id → avatar_url */
const avatarsCache = new Map<string, string | null>();

/** Загружает username и avatar_url для всего массива сообщений */
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

  return rows.map((row) => {
    const username = profilesCache.get(row.sender_id) || 'Unknown';
    const avatar = avatarsCache.get(row.sender_id) || null;
    const aesDecrypted = decryptMessage(row.text);
    const wasAesEncrypted = aesDecrypted !== row.text && aesDecrypted.length > 0;
    const hasVisibleCipher = row.cipher_type === 'caesar' || row.cipher_type === 'base64';
    const decrypted = hasVisibleCipher ? aesDecrypted : aesDecrypted;

    return {
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
    };
  });
}

function decryptVisibleLayer(text: string, cipherType: string): string {
  switch (cipherType) {
    case 'caesar': return caesarDecrypt(text, 3);
    case 'base64': return base64Decode(text);
    default: return text;
  }
}

interface ChatWithProfile extends ChatRoom {
  otherUserId?: string;
  otherUserAvatar?: string | null;
}

/** Загружает все комнаты текущего пользователя + других участников */
async function loadRooms(currentUserId: string): Promise<ChatWithProfile[]> {
  // Получаем все комнаты, где пользователь — участник
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

  // Получаем сами комнаты
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

  // Для каждой комнаты получаем других участников
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
      otherUserId = otherMembers[0].user_id ?? undefined;
      if (otherUserId) {
        const cachedName = profilesCache.get(otherUserId);
        const cachedAvatar = avatarsCache.get(otherUserId);
        if (cachedName) {
          displayName = cachedName;
          otherUserAvatar = cachedAvatar ?? null;
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', otherUserId)
            .single();
          if (profile) {
            displayName = profile.username;
            otherUserAvatar = (profile as any).avatar_url || null;
            profilesCache.set(otherUserId, profile.username);
            avatarsCache.set(otherUserId, otherUserAvatar);
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

/** Находит существующую комнату с этим пользователем или создаёт новую */
async function findOrCreateRoom(currentUserId: string, otherUserId: string): Promise<string | null> {
  // Найти комнату, где есть оба пользователя
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

  // Создаём новую комнату
  const { data: newRoom, error: roomErr } = await supabase
    .from('rooms')
    .insert({ name: '', is_encrypted: true })
    .select('id')
    .single();
  if (roomErr || !newRoom) {
    console.error('createRoom:', roomErr);
    return null;
  }
  // Добавляем обоих участников
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

  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const presenceRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  // Auth guard
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
        // Загружаем профиль
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
        // Загружаем комнаты
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

  // Realtime subscription
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

          newMessage.status = 'delivered';

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          setRooms((prev) =>
            prev.map((r) => r.id === activeRoomId ? { ...r, lastMessage: payload.new.text } : r)
          );
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
      config: { presence: { key: currentUserId } },
    });
    channel.subscribe();
    presenceRef.current = channel;
    return () => {
      if (presenceRef.current) supabase.removeChannel(presenceRef.current);
    };
  }, [currentUserId]);

  const handleStartChat = useCallback(
    async (otherUser: { id: string; username: string; avatar_url?: string | null }) => {
      if (!currentUserId) return;
      const roomId = await findOrCreateRoom(currentUserId, otherUser.id);
      if (!roomId) return;

      // Перезагружаем список комнат
      const loaded = await loadRooms(currentUserId);
      setRooms(loaded);
      setActiveRoomId(roomId);
    },
    [currentUserId]
  );

  const handleSendMessage = useCallback(
    (text: string, cipher: CipherType) => {
      if (!activeRoomId || !currentUserId) return;

      const visibleCipherText = cipher !== 'none' ? encryptText(text, cipher) : text;
      const e2eeCipherText = encryptMessage(visibleCipherText);

      const newDbMessage: Omit<DbMessage, 'id' | 'created_at'> = {
        room_id: activeRoomId,
        sender_id: currentUserId,
        text: e2eeCipherText,
        cipher_type: cipher,
      };

      supabase.from('messages').insert(newDbMessage).select('id').then(({ error }) => {
        if (error) console.error('Ошибка отправки:', error);
      });
    },
    [activeRoomId, currentUserId]
  );

  const handleDecryptMessage = useCallback((messageId: string) => {
    setDecryptingMessageId(messageId);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.isEncrypted && msg.originalText && msg.cipher) {
            return { ...msg, text: decryptVisibleLayer(msg.originalText, msg.cipher), isEncrypted: false, originalText: undefined };
          }
          return msg;
        })
      );
      setDecryptingMessageId(null);
    }, 800);
  }, []);

  const handleProfileUpdated = useCallback((updated: Profile) => {
    setCurrentProfile(updated);
    if (updated.id) {
      profilesCache.set(updated.id, updated.username);
      avatarsCache.set(updated.id, (updated as any).avatar_url || null);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#0B0F12] text-white relative overflow-hidden">
      {/* Decorative ambient glow on the deep graphite background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-neon-green/[0.06] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-emerald-500/[0.05] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden p-3 md:p-4 gap-3 md:gap-4">
        {/* Desktop Sidebar — glassmorphism card */}
        <aside className="w-64 flex-shrink-0 hidden md:block rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900/60 backdrop-blur-md shadow-glass">
          <Sidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={setActiveRoomId}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            currentProfile={currentProfile}
            isLoadingRooms={!currentUserId}
          />
        </aside>

        {/* Chat Window — glassmorphism card */}
        <main className="flex-1 min-w-0 rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900/60 backdrop-blur-md shadow-glass flex flex-col">
          <ChatWindow
            room={activeRoom}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onDecryptMessage={handleDecryptMessage}
            decryptingMessageId={decryptingMessageId}
          />
        </main>
      </div>

      {/* Search User Modal */}
      <SearchUserModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentUserId={currentUserId}
        onStartChat={handleStartChat}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={currentProfile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
