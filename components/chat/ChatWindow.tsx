'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, ChevronLeft, MessageSquare, Loader2, Paperclip, Smile, Image as ImageIcon, File, X, MoreVertical, Reply, Forward, Trash2, Copy, CheckCheck } from 'lucide-react';
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

// Memoized MessageList component
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
          <div key={msg.id} className={gapFromPrev ? 'mt-4' : undefined}>
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

  // Memoized values
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
      <div className="flex-1 flex items-center justify-center relative">
        <div className="text-center space-y-10 px-10 max-w-xl mx-auto">
          <div className="relative inline-flex items-center justify-center mx-auto">
            <motion.div
              className="absolute inset-0 -m-16 rounded-full bg-emerald-400/25 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/25 border-2 border-emerald-500/50 flex items-center justify-center"
              style={{ 
                boxShadow: '0 0 80px rgba(16,245,181,0.4), 0 0 160px rgba(16,245,181,0.2), inset 0 2px 0 rgba(255,255,255,0.15)' 
              }}>
              <Shield className="w-20 h-20 text-emerald-400" style={{ filter: 'drop-shadow(0 0 20px rgba(16,245,181,0.7))' }} />
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-white mb-5 tracking-tight">
              {t('chat.empty_title')}
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mx-auto">
              {t('chat.empty_desc')}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, boxShadow: '0 0 60px rgba(16,245,181,0.6)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="inline-flex items-center gap-4 px-12 py-6 rounded-3xl text-xl font-bold text-emerald-300"
            style={{
              background: 'linear-gradient(180deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
              border: '2px solid rgba(16,245,181,0.4)',
              boxShadow: '0 0 40px rgba(16,245,181,0.3), inset 0 2px 0 rgba(255,255,255,0.1)',
            }}
          >
            <MessageSquare className="w-7 h-7" />
            Выберите чат слева
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header - Premium glass panel */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-black/[0.35] backdrop-blur-2xl flex-shrink-0">
        <div className="flex items-center gap-5">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-2.5 -ml-1.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition" aria-label={t('chat.back')}>
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/25 flex items-center justify-center text-xl font-bold text-emerald-400 overflow-hidden ring-2 ring-emerald-500/30"
            style={{ boxShadow: '0 0 40px rgba(16,245,181,0.25)' }}>
            {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
              <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full object-cover" />
            ) : room.otherUserAvatar ? (
              <span className="text-3xl leading-none">{room.otherUserAvatar}</span>
            ) : room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white text-2xl">{room.name}</h3>
            <p className="text-base text-zinc-500 flex items-center gap-2">
              {otherTyping ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  {typingUser} печатает...
                </span>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 10px rgba(16,245,181,0.7)' }} />
                  {t('chat.messages_count_short', { count: roomMessages.length })}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 text-lg font-bold text-emerald-400">
              {unreadCount} новых
            </div>
          )}
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10"
            style={{ boxShadow: '0 0 30px rgba(16,245,181,0.2)' }}>
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-base font-bold text-emerald-400">E2EE</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 min-h-0 relative">
        {showEncryptingIndicator && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end mb-4">
            <div className="bg-emerald-950/40 border-2 border-emerald-800/30 rounded-3xl rounded-br-lg px-6 py-4 backdrop-blur-xl"
              style={{ boxShadow: '0 0 30px rgba(16,245,181,0.2)' }}>
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="text-lg text-emerald-300/90 italic font-medium">{t('chat.encrypting_indicator')}</span>
              </div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 && !showEncryptingIndicator ? (
          <div className="flex items-center justify-center h-full min-h-[280px]">
            <div className="text-center space-y-6 px-10 max-w-lg mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto"
                style={{ boxShadow: '0 0 50px rgba(16,245,181,0.3)' }}>
                <MessageSquare className="w-12 h-12 text-emerald-400" style={{ filter: 'drop-shadow(0 0 15px rgba(16,245,181,0.5))' }} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">{t('chat.no_messages')}</h4>
                <p className="text-lg text-zinc-400 leading-relaxed">{t('chat.no_messages_hint')}</p>
              </div>
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
          {otherTyping && !showEncryptingIndicator && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.25 }} className="flex items-end gap-3 mb-2 justify-start">
              <div className="bg-white/[0.04] border-2 border-white/[0.08] rounded-3xl rounded-bl-lg px-6 py-4 backdrop-blur-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Area */}
      <div className="w-full px-5 pb-5 pt-4 flex-shrink-0">
        <div className="flex items-end gap-4 bg-black/[0.45] border-2 border-white/[0.12] rounded-3xl px-6 py-5 w-full backdrop-blur-3xl"
          style={{ boxShadow: '0 15px 50px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.06)' }}>
          
          {/* Attachment menu */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="flex items-center justify-center w-12 h-12 rounded-3xl text-zinc-500 hover:text-emerald-400 hover:bg-white/[0.08] transition-all duration-200 flex-shrink-0"
            >
              <Paperclip className="w-6 h-6" />
            </motion.button>
            
            <AnimatePresence>
              {showAttachmentMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.9 }}
                  className="absolute bottom-full mb-4 left-0 z-20 w-56 rounded-3xl border-2 border-white/[0.12] bg-[#0a0f17]/95 backdrop-blur-3xl shadow-2xl overflow-hidden"
                >
                  <div className="p-3 space-y-2">
                    <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-zinc-300 hover:bg-white/[0.06] transition">
                      <ImageIcon className="w-6 h-6 text-emerald-400" />
                      <span className="text-base font-medium">Фото</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-zinc-300 hover:bg-white/[0.06] transition">
                      <File className="w-6 h-6 text-cyan-400" />
                      <span className="text-base font-medium">Файл</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-zinc-300 hover:bg-white/[0.06] transition">
                      <Smile className="w-6 h-6 text-violet-400" />
                      <span className="text-base font-medium">Стикер</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cipher selector */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCipherMenu(!showCipherMenu)}
              className={`flex items-center gap-3 px-5 py-3 rounded-3xl border-2 transition-all duration-200 text-base font-medium ${
                cipher === 'none' 
                  ? 'border-white/[0.12] text-zinc-400 hover:border-emerald-400/50' 
                  : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="hidden sm:inline">{activeCipherLabel}</span>
              <ChevronDown className="w-5 h-5" />
            </motion.button>
            {showCipherMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                <div className="absolute bottom-full mb-4 left-0 z-20 w-56 rounded-3xl border-2 border-white/[0.12] bg-[#0a0f17]/95 backdrop-blur-3xl shadow-2xl overflow-hidden">
                  {CIPHER_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }} 
                      className={`w-full text-left px-5 py-3.5 text-base transition flex items-center gap-3 ${cipher === opt.value ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300 hover:bg-white/[0.06]'}`}>
                      <Lock className={`w-5 h-5 ${opt.value === 'none' ? 'opacity-30' : 'text-emerald-400'}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.input_placeholder')}
              rows={1}
              className="w-full bg-transparent border-none rounded-3xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none resize-none text-lg max-h-40"
              style={{ minHeight: '52px' }}
            />
          </div>

          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.12, boxShadow: '0 0 45px rgba(16,245,181,0.6)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="group/send flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-black hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            style={{ boxShadow: '0 0 40px rgba(16,245,181,0.4)' }}
          >
            <Send className="w-6 h-6 transition-transform group-hover/send:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}