'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, ChevronLeft, MessageSquare, Loader2, Paperclip, Smile, Image as ImageIcon, File, X, MoreVertical, Reply, Forward, Trash2, Copy, CheckCheck, Zap } from 'lucide-react';
import { MessageBubble, type Message } from './MessageBubble';
import { type ChatRoom } from './Sidebar';
import { CIPHER_OPTIONS, type CipherType } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/i18n';

interface ChatWindowProps {
  room: ChatRoom | null;
  messages: Message[];
  currentUserId: string | null;
  onSendMessage: (text: string, cipher: CipherType) => void;
  onDecryptMessage?: (messageId: string) => void;
  decryptingMessageId?: string | null;
  onBack?: () => void;
}

// Memoized MessageList
const MessageList = memo(({ 
  messages, 
  onDecryptMessage, 
  decryptingMessageId 
}: { 
  messages: Message[];
  onDecryptMessage?: (messageId: string) => void;
  decryptingMessageId?: string | null;
}) => {
  return (
    <>
      {messages.map((msg, idx) => {
        const prevMsg = idx > 0 ? messages[idx - 1] : null;
        const gapFromPrev = prevMsg && prevMsg.senderId !== msg.senderId;
        return (
          <div key={msg.id} className={gapFromPrev ? 'mt-3' : undefined}>
            <MessageBubble message={msg} onDecrypt={onDecryptMessage} isDecrypting={decryptingMessageId === msg.id} />
          </div>
        );
      })}
    </>
  );
});
MessageList.displayName = 'MessageList';

export function ChatWindow({ room, messages, currentUserId, onSendMessage, onDecryptMessage, decryptingMessageId, onBack }: ChatWindowProps) {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [cipher, setCipher] = useState<CipherType>('none');
  const [showCipherMenu, setShowCipherMenu] = useState(false);
  const [showEncryptingIndicator, setShowEncryptingIndicator] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const roomMessages = useMemo(() => messages.filter((m) => m.roomId === room?.id), [messages, room?.id]);
  const unreadCount = useMemo(() => roomMessages.filter(m => m.sender !== 'me' && m.status !== 'read').length, [roomMessages]);
  const activeCipherLabel = useMemo(() => CIPHER_OPTIONS.find((o) => o.value === cipher)?.label ?? t('chat.cipher_none'), [cipher, t]);

  const scrollToBottom = useCallback(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, []);

  useEffect(() => { 
    scrollToBottom(); 
  }, [roomMessages.length, typingUser, scrollToBottom]);

  useEffect(() => {
    if (!room?.id) return;
    const channel = supabase.channel(`typing-${room.id}`);
    channel.on('broadcast', { event: 'typing' }, (payload) => {
      const senderId = payload.payload?.userId;
      if (senderId && senderId === currentUserId) return;
      setTypingUser(payload.payload?.username || '...');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
    }).subscribe();
    return () => { 
      supabase.removeChannel(channel); 
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); 
    };
  }, [room?.id, currentUserId]);

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputText(newValue);
    
    if (room?.id && newValue.trim() && currentUserId) {
      if (!isTyping) {
        setIsTyping(true);
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', currentUserId).single();
        if (profile) {
          const ch = supabase.channel(`typing-${room.id}`);
          ch.send({ type: 'broadcast', event: 'typing', payload: { username: profile.username, userId: currentUserId } });
        }
      }
      
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      typingDebounceRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  }, [room?.id, currentUserId, isTyping]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    if (cipher !== 'none') {
      setShowEncryptingIndicator(true);
      setTimeout(() => { setShowEncryptingIndicator(false); onSendMessage(text, cipher); }, 800);
    } else { 
      onSendMessage(text, cipher); 
    }
    setInputText('');
    setIsTyping(false);
  }, [inputText, cipher, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(); 
    } 
  }, [handleSend]);

  const otherTyping = typingUser !== null;

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0a0f17] to-[#05070d]">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto"
            style={{ boxShadow: '0 0 30px rgba(16,245,181,0.2)' }}>
            <Shield className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Выберите чат</h2>
            <p className="text-zinc-400">Выберите диалог слева или найдите собеседника</p>
          </div>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            К списку чатов
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
            {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
              <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full rounded-2xl object-cover" />
            ) : room.otherUserAvatar ? (
              <span className="text-lg">{room.otherUserAvatar}</span>
            ) : (
              room.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">{room.name}</h3>
            <p className="text-xs text-zinc-500">
              {otherTyping ? `${typingUser} печатает...` : 'online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-xs text-emerald-400">
              {unreadCount}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400">E2EE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {showEncryptingIndicator && (
          <div className="flex justify-end mb-2">
            <div className="bg-emerald-950/40 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-sm text-emerald-300">Шифрование...</span>
              </div>
            </div>
          </div>
        )}

        {roomMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-zinc-400">Нет сообщений</p>
            </div>
          </div>
        ) : (
          <MessageList 
            messages={roomMessages} 
            onDecryptMessage={onDecryptMessage} 
            decryptingMessageId={decryptingMessageId} 
          />
        )}

        <AnimatePresence>
          {otherTyping && (
            <div className="flex items-end gap-2 mb-2 justify-start">
              <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3">
        <div className="flex items-end gap-2 bg-black/30 border border-white/10 rounded-2xl px-3 py-2.5">
          <div className="relative">
            <button onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-emerald-400">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setShowCipherMenu(!showCipherMenu)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-zinc-400">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeCipherLabel}</span>
            </button>
            {showCipherMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                <div className="absolute bottom-full mb-2 left-0 z-20 w-44 rounded-xl border border-white/10 bg-[#0a0f17] shadow-2xl">
                  {CIPHER_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }} 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <textarea
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение..."
            rows={1}
            className="flex-1 bg-transparent border-none rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
            style={{ minHeight: '36px' }}
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-30"
          >
            <Send className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}