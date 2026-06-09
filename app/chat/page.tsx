'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, type ChatRoom } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { type Message } from '@/components/chat/MessageBubble';
import { type CipherType, encryptText, caesarDecrypt, base64Decode } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';
import type { DbMessage } from '@/lib/supabaseClient';
import { encryptMessage, decryptMessage, isEncrypted } from '@/lib/cryptoUtils';
import { ArrowLeft } from 'lucide-react';

let roomCounter = 3;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Расшифровывает текст с учётом E2EE (AES) и видимого шифра (caesar/base64).
 * @returns расшифрованный текст, либо null если расшифровка не удалась
 */
function decryptDbText(text: string, cipherType: string): { decrypted: string; isE2ee: boolean } {
  // 1. Сначала расшифровываем AES (E2EE)
  const aesDecrypted = decryptMessage(text);

  // Проверяем, был ли это E2EE или обычный текст
  const wasAesEncrypted = isEncrypted(text) || aesDecrypted !== text;

  // 2. Если шифр caesar/base64 — текст остаётся зашифрованным для пользователя
  //    (он расшифрует его по кнопке в UI)
  if (cipherType === 'caesar' || cipherType === 'base64') {
    return { decrypted: aesDecrypted, isE2ee: wasAesEncrypted };
  }

  return { decrypted: aesDecrypted, isE2ee: false };
}

/**
 * Расшифровывает caesar/base64 поверх E2EE (для кнопки расшифровки)
 */
function decryptVisibleLayer(text: string, cipherType: string): string {
  switch (cipherType) {
    case 'caesar':
      return caesarDecrypt(text, 3);
    case 'base64':
      return base64Decode(text);
    default:
      return text;
  }
}

// Превращает строку из БД в объект Message для компонентов
function dbMessageToClient(row: DbMessage): Message {
  const { decrypted, isE2ee } = decryptDbText(row.text, row.cipher_type);

  const hasVisibleCipher = row.cipher_type === 'caesar' || row.cipher_type === 'base64';
  const originalText = hasVisibleCipher ? decrypted : undefined;

  return {
    id: row.id,
    text: decrypted,
    sender: row.sender as 'me' | 'other',
    timestamp: new Date(row.created_at),
    roomId: row.room_id,
    cipher: hasVisibleCipher ? row.cipher_type : row.cipher_type === 'aes' ? undefined : row.cipher_type,
    isEncrypted: hasVisibleCipher,
    originalText,
    isE2ee: isE2ee || row.cipher_type === 'aes',
  };
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

  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  // ── 1. Загрузка истории сообщений из Supabase при смене комнаты ──
  useEffect(() => {
    if (!activeRoomId) return;

    let cancelled = false;
    setIsLoadingHistory(true);

    supabase
      .from('messages')
      .select('*')
      .eq('room_id', activeRoomId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error) {
          console.error('Ошибка загрузки истории:', error);
          setMessages([]);
        } else if (data) {
          setMessages(data.map(dbMessageToClient));
        }
        setIsLoadingHistory(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeRoomId]);

  // ── 2. Realtime-подписка: новые сообщения приходят мгновенно ──
  useEffect(() => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    if (!activeRoomId) return;

    const channel = supabase
      .channel(`room-${activeRoomId}`)
      .on<DbMessage>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${activeRoomId}`,
        },
        (payload) => {
          const newMessage = dbMessageToClient(payload.new);
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          setRooms((prev) =>
            prev.map((r) =>
              r.id === activeRoomId
                ? { ...r, lastMessage: payload.new.text }
                : r
            )
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
  }, [activeRoomId]);

  // ── 3. Создание новой комнаты ──
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

  // ── 4. Отправка сообщения: шифрование → E2EE (AES) → Supabase ──
  const handleSendMessage = useCallback(
    (text: string, cipher: CipherType) => {
      if (!activeRoomId) return;

      // Шаг 1: если выбран видимый шифр (caesar/base64) — применяем его
      const visibleCipherText = cipher !== 'none' ? encryptText(text, cipher) : text;

      // Шаг 2: шифруем E2EE (AES-256) — в БД летит ТОЛЬКО зашифрованный текст
      const e2eeCipherText = encryptMessage(visibleCipherText);

      const newDbMessage: Omit<DbMessage, 'id' | 'created_at'> = {
        room_id: activeRoomId,
        sender: 'me',
        text: e2eeCipherText,
        cipher_type: cipher,
      };

      supabase
        .from('messages')
        .insert(newDbMessage)
        .select('id')
        .then(({ error }) => {
          if (error) {
            console.error('Ошибка отправки сообщения:', error);
          }
        });
    },
    [activeRoomId]
  );

  // ── 5. Расшифровка видимого слоя (caesar/base64) по кнопке ──
  const handleDecryptMessage = useCallback(
    (messageId: string) => {
      setDecryptingMessageId(messageId);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (
              msg.id === messageId &&
              msg.isEncrypted &&
              msg.originalText &&
              msg.cipher
            ) {
              const decryptedText = decryptVisibleLayer(msg.originalText, msg.cipher);
              return {
                ...msg,
                text: decryptedText,
                isEncrypted: false,
                originalText: undefined,
              };
            }
            return msg;
          })
        );
        setDecryptingMessageId(null);
      }, 800);
    },
    []
  );

  return (
    <div className="h-screen flex flex-col bg-bg-black pt-14">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neon-green/10 bg-surface-darker/80">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-neon-green transition" />
          <span className="text-sm font-medium text-white group-hover:text-neon-green transition">
            Cipher Talk
          </span>
        </button>
        <span className="text-xs text-gray-500">Мессенджер</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — десктоп */}
        <div className="w-72 flex-shrink-0 hidden md:block">
          <Sidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={setActiveRoomId}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        {/* Sidebar — мобильный */}
        <div className="md:hidden w-full">
          <MobileSidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={(id) => {
              setActiveRoomId(id);
            }}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        {/* Chat Window */}
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

function MobileSidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
  onCreateRoom,
}: {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
  onCreateRoom: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface-darker border-r border-neon-green/10">
        <Sidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={(id) => {
            onSelectRoom(id);
            setIsOpen(false);
          }}
          onCreateRoom={onCreateRoom}
        />
      </div>
    </div>
  );
}