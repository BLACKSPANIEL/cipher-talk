'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, type ChatRoom } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { type Message } from '@/components/chat/MessageBubble';
import { type CipherType, encryptText, caesarDecrypt, base64Decode } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';
import type { DbMessage } from '@/lib/supabaseClient';
import { encryptMessage, decryptMessage } from '@/lib/cryptoUtils';
import { Shield } from 'lucide-react';

let roomCounter = 3;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Кэш профилей: sender_id → username */
const profilesCache = new Map<string, string>();

/** Загружает username для всего массива сообщений */
async function enrichMessagesWithUsernames(
  rows: DbMessage[],
  currentUserId: string
): Promise<Message[]> {
  const senderIds = [...new Set(rows.map((r) => r.sender_id))];
  const missingIds = senderIds.filter((id) => !profilesCache.has(id));
  if (missingIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', missingIds);
    if (data) {
      data.forEach((p) => profilesCache.set(p.id, p.username));
    }
  }

  return rows.map((row) => {
    const username = profilesCache.get(row.sender_id) || 'Unknown';
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

interface ChatWithMessages extends ChatRoom {
  avatar?: string;
}

const DEFAULT_ROOMS: ChatWithMessages[] = [
  { id: 'room-1', name: 'Alice Green', isEncrypted: true, lastMessage: 'Последнее сообщение...' },
  { id: 'room-2', name: 'Cyber Team', isEncrypted: true, lastMessage: 'Последнее сообщение...' },
  { id: 'room-3', name: 'Crypto Group', isEncrypted: true, lastMessage: 'Последнее сообщение...' },
];

export default function ChatPage() {
  const router = useRouter();

  const [rooms, setRooms] = useState<ChatWithMessages[]>(DEFAULT_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>('room-1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [decryptingMessageId, setDecryptingMessageId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  // Auth guard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
      else router.push('/login');
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
        else if (data) setMessages(await enrichMessagesWithUsernames(data, currentUserId));
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
          const enriched = await enrichMessagesWithUsernames([payload.new], currentUserId);
          const newMessage = enriched[0];
          if (!newMessage) return;

          // Mark as delivered
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

  const handleCreateRoom = useCallback(() => {
    roomCounter++;
    const newRoom: ChatWithMessages = {
      id: generateId('room'),
      name: `Комната ${roomCounter}`,
      isEncrypted: true,
    };
    setRooms((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
  }, []);

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

  return (
    <div className="h-screen flex flex-col bg-[#0B0F12]">
      {/* Top bar — pure decorative, no links to / */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green" />
          <span className="text-sm font-bold text-white tracking-wide">C I P H E R &nbsp;T A L K</span>
        </div>
        <span className="text-xs text-zinc-500">Мессенджер</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={setActiveRoomId}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden w-full">
          <MobileSidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={(id) => setActiveRoomId(id)}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        <ChatWindow
          room={activeRoom}
          messages={messages}
          onSendMessage={handleSendMessage}
          onDecryptMessage={handleDecryptMessage}
          decryptingMessageId={decryptingMessageId}
        />
      </div>
    </div>
  );
}

function MobileSidebar({ rooms, activeRoomId, onSelectRoom, onCreateRoom }: {
  rooms: ChatRoom[]; activeRoomId: string | null;
  onSelectRoom: (id: string) => void; onCreateRoom: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface-glass-dark border-r border-neon-green/10">
        <Sidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={(id) => { onSelectRoom(id); setIsOpen(false); }}
          onCreateRoom={onCreateRoom}
        />
      </div>
    </div>
  );
}