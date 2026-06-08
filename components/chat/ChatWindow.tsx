'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, MessageSquare } from 'lucide-react';
import { MessageBubble, type Message } from './MessageBubble';
import { type ChatRoom } from './Sidebar';
import { CIPHER_OPTIONS, type CipherType } from '@/lib/ciphers';

interface ChatWindowProps {
  room: ChatRoom | null;
  messages: Message[];
  onSendMessage: (text: string, cipher: CipherType) => void;
}

export function ChatWindow({ room, messages, onSendMessage }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [cipher, setCipher] = useState<CipherType>('none');
  const [showCipherMenu, setShowCipherMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    onSendMessage(text, cipher);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeCipherLabel = CIPHER_OPTIONS.find((o) => o.value === cipher)?.label ?? 'Обычный текст';

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-dark/30">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10">
            <MessageSquare className="w-8 h-8 text-neon-green" />
          </div>
          <h3 className="text-xl font-semibold text-white">Выберите чат-комнату</h3>
          <p className="text-gray-500 text-sm">Создайте новую комнату или выберите существующую</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-dark/30">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neon-green/10 bg-surface-darker/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
          <div>
            <h3 className="font-semibold text-white text-sm">{room.name}</h3>
            <p className="text-xs text-gray-500">2 участника</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/5">
          <Lock className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-xs font-medium text-neon-green">Зашифровано E2EE</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {messages.filter((m) => m.roomId === room.id).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Shield className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-gray-500 text-sm">Нет сообщений</p>
              <p className="text-gray-600 text-xs">Начните безопасный разговор</p>
            </div>
          </div>
        ) : (
          messages
            .filter((m) => m.roomId === room.id)
            .map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Panel */}
      <div className="px-4 py-3 border-t border-neon-green/10 bg-surface-darker/50">
        <div className="flex items-end gap-2">
          {/* Cipher Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCipherMenu(!showCipherMenu)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all text-xs ${
                cipher === 'none'
                  ? 'border-gray-700 text-gray-400 hover:border-gray-600'
                  : 'border-neon-green/30 text-neon-green bg-neon-green/5 hover:bg-neon-green/10'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeCipherLabel}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showCipherMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCipherMenu(false)}
                />
                <div className="absolute bottom-full mb-2 left-0 z-20 w-44 rounded-xl border border-neon-green/20 bg-surface-darker backdrop-blur-xl shadow-xl overflow-hidden">
                  {CIPHER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setCipher(opt.value);
                        setShowCipherMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2 ${
                        cipher === opt.value
                          ? 'text-neon-green bg-neon-green/10'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <Lock
                        className={`w-3.5 h-3.5 ${
                          opt.value === 'none' ? 'opacity-30' : 'text-neon-green'
                        }`}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение..."
              rows={1}
              className="w-full bg-black/40 border border-neon-green/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none text-sm max-h-32"
              style={{ minHeight: '42px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-neon-green text-black hover:bg-neon-dark-green disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}