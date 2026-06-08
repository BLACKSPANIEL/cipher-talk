'use client';

import { useState, useCallback } from 'react';
import { Sidebar, type ChatRoom } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { type Message } from '@/components/chat/MessageBubble';
import { type CipherType } from '@/lib/ciphers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

let roomCounter = 0;
let messageCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    {
      id: 'room-1',
      name: 'Общая',
      isEncrypted: true,
      lastMessage: 'Добро пожаловать в Cipher Talk!',
    },
    {
      id: 'room-2',
      name: 'Тестовая комната',
      isEncrypted: true,
      lastMessage: 'Проверка шифрования',
    },
  ]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>('room-1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      text: 'Добро пожаловать в Cipher Talk! 🔐',
      sender: 'other',
      timestamp: new Date(),
      roomId: 'room-1',
    },
    {
      id: 'msg-2',
      text: 'Все сообщения защищены сквозным шифрованием',
      sender: 'other',
      timestamp: new Date(),
      roomId: 'room-1',
    },
    {
      id: 'msg-3',
      text: 'Привет! Проверяю шифрование.',
      sender: 'other',
      timestamp: new Date(),
      roomId: 'room-2',
    },
  ]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  const handleCreateRoom = useCallback(() => {
    roomCounter++;
    const newRoom: ChatRoom = {
      id: generateId('room'),
      name: `Комната ${roomCounter}`,
      isEncrypted: true,
    };
    setRooms((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
  }, []);

  const handleSendMessage = useCallback(
    (text: string, cipher: CipherType) => {
      if (!activeRoomId) return;

      const encryptedText = cipher !== 'none' ? `🔒 [${text}]` : text;

      const newMessage: Message = {
        id: generateId('msg'),
        text: encryptedText,
        sender: 'me',
        timestamp: new Date(),
        cipher,
        roomId: activeRoomId,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Simulate an auto-reply after a short delay
      setTimeout(() => {
        const reply: Message = {
          id: generateId('msg'),
          text: '✅ Сообщение получено и расшифровано',
          sender: 'other',
          timestamp: new Date(),
          roomId: activeRoomId,
        };
        setMessages((prev) => [...prev, reply]);

        // Update room last message
        setRooms((prev) =>
          prev.map((r) =>
            r.id === activeRoomId
              ? { ...r, lastMessage: encryptedText }
              : r
          )
        );
      }, 1000 + Math.random() * 1000);
    },
    [activeRoomId]
  );

  return (
    <div className="h-screen flex flex-col bg-bg-black pt-14">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b border-neon-green/10 bg-surface-darker/80">
        <Link href="/" className="text-gray-400 hover:text-neon-green transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-medium text-white">Cipher Talk — Мессенджер</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 hidden md:block">
          <Sidebar
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={setActiveRoomId}
            onCreateRoom={handleCreateRoom}
          />
        </div>

        {/* Mobile sidebar toggle */}
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