'use client';

import { useState, useRef, useEffect } from 'react';
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

    // Broadcast typing status
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
      <div className="flex-1 flex items-center justify-center bg-zinc-900/30">
        <div className="text-center space-y-5">
          {/* Glowing shield icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/10 mx-auto">
            <Shield className="w-10 h-10 text-neon-green" style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,102,0.4))' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Cipher Talk</h3>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
              Ваши сообщения защищены сквозным шифрованием (E2EE). 
              Создайте или выберите чат-комнату, чтобы начать безопасное общение.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-900/20">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">
            {room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{room.name}</h3>
            <p className="text-xs text-zinc-500">{roomMessages.length} сообщ.</p>
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
              <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-3 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-neon-green" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-neon-green" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-neon-green" />
                </div>
                <span className="text-sm text-zinc-400 italic">{typingUser} печатает...</span>
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
            <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-2xl rounded-bl-md px-4 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
                <span className="text-sm text-zinc-400 italic">Шифрование...</span>
              </div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 && !showEncryptingIndicator ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 mx-auto">
                <Shield className="w-8 h-8 text-neon-green" style={{ filter: 'drop-shadow(0 0 15px rgba(0,255,102,0.3))' }} />
              </div>
              <div>
                <p className="text-white font-semibold">Нет сообщений</p>
                <p className="text-zinc-500 text-xs max-w-[200px] mt-1">
                  Напишите что-нибудь, чтобы начать зашифрованный диалог
                </p>
              </div>
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

      {/* Floating Capsule Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 bg-zinc-800/60 backdrop-blur-lg border border-zinc-700/40 rounded-2xl px-4 py-3 shadow-glass">
            {/* Cipher Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCipherMenu(!showCipherMenu)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all text-xs ${
                  cipher === 'none'
                    ? 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
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
                  <div className="absolute bottom-full mb-2 left-0 z-20 w-44 rounded-xl border border-zinc-800/50 bg-zinc-900/95 backdrop-blur-2xl shadow-glass-lg overflow-hidden">
                    {CIPHER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2 ${
                          cipher === opt.value ? 'text-neon-green bg-neon-green/10' : 'text-zinc-300 hover:bg-zinc-800/40'
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
                className="w-full bg-transparent border-none rounded-xl px-2 py-2 text-white placeholder-zinc-500 focus:outline-none resize-none text-sm max-h-32"
                style={{ minHeight: '36px' }}
              />
            </div>

            {/* Send Button — interactive with hover scale and glow */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="flex items-center justify-center w-[42px] h-[42px] rounded-xl bg-chat-gradient text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}