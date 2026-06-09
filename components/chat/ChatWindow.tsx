'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, MessageSquare, Loader2 } from 'lucide-react';
import { MessageBubble, type Message } from './MessageBubble';
import { type ChatRoom } from './Sidebar';
import { CIPHER_OPTIONS, type CipherType } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';

interface ChatWindowProps {
  room: ChatRoom | null;
  messages: Message[];
  onSendMessage: (text: string, cipher: CipherType) => void;
  onDecryptMessage?: (messageId: string) => void;
  decryptingMessageId?: string | null;
}

export function ChatWindow({ room, messages, onSendMessage, onDecryptMessage, decryptingMessageId }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [cipher, setCipher] = useState<CipherType>('none');
  const [showCipherMenu, setShowCipherMenu] = useState(false);
  const [showEncryptingIndicator, setShowEncryptingIndicator] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing indicator via Supabase Broadcast
  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase.channel(`typing-${room.id}`);

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const senderName = payload.payload.username;
        setTypingUser(senderName);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [room?.id]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    // Broadcast typing status (only if there's text and a room)
    if (room?.id && e.target.value.trim()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
        if (profile) {
          const channel = supabase.channel(`typing-${room.id}`);
          channel.send({ type: 'broadcast', event: 'typing', payload: { username: profile.username } });
        }
      }
    }
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    if (cipher !== 'none') {
      setShowEncryptingIndicator(true);
      setTimeout(() => {
        setShowEncryptingIndicator(false);
        onSendMessage(text, cipher);
      }, 1000);
    } else {
      onSendMessage(text, cipher);
    }

    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeCipherLabel = CIPHER_OPTIONS.find((o) => o.value === cipher)?.label ?? 'Обычный текст';

  const roomMessages = messages.filter((m) => m.roomId === room?.id);

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-glass-dark/30">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10">
            <MessageSquare className="w-8 h-8 text-neon-green" />
          </div>
          <h3 className="text-xl font-semibold text-white">Выберите чат-комнату</h3>
          <p className="text-gray-500 text-sm">Создайте новую или выберите существующую</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-glass-dark/20">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neon-green/10 bg-surface-glass-dark/40 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">
            {room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{room.name}</h3>
            <p className="text-xs text-gray-500">{roomMessages.length} сообщ.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/5">
          <Lock className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-xs font-medium text-neon-green">E2EE</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {/* Typing indicator */}
        <AnimatePresence>
          {typingUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2 mb-2"
            >
              <div className="glass-panel rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-neon-green" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-neon-green" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-neon-green" />
                </div>
                <span className="text-sm text-gray-400 italic">{typingUser} печатает...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Encrypting indicator */}
        {showEncryptingIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start mb-3"
          >
            <div className="glass-panel rounded-2xl rounded-bl-md px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
                <span className="text-sm text-gray-400 italic">Шифрование...</span>
              </div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 && !showEncryptingIndicator ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Shield className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-gray-500 text-sm">Нет сообщений</p>
              <p className="text-gray-600 text-xs">Начните безопасный разговор</p>
            </div>
          </div>
        ) : (
          roomMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onDecrypt={onDecryptMessage}
              isDecrypting={decryptingMessageId === msg.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Panel */}
      <div className="px-4 py-3 border-t border-neon-green/10 bg-surface-glass-dark/60 backdrop-blur-lg">
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
                <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                <div className="absolute bottom-full mb-2 left-0 z-20 w-44 rounded-xl border border-neon-green/20 bg-surface-glass-dark backdrop-blur-2xl shadow-glass-lg overflow-hidden">
                  {CIPHER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2 ${
                        cipher === opt.value ? 'text-neon-green bg-neon-green/10' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <Lock className={`w-3.5 h-3.5 ${opt.value === 'none' ? 'opacity-30' : 'text-neon-green'}`} />
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
              onChange={handleInputChange}
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
            className="flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-chat-gradient text-black hover:bg-chat-gradient-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-neon-glow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}