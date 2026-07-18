'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, ChevronLeft, MessageSquare, Loader2, Paperclip, Smile, Image as ImageIcon, File, X } from 'lucide-react';
import { MessageBubble, type Message } from './MessageBubble';
import { type ChatRoom } from './Sidebar';
import { CIPHER_OPTIONS, type CipherType } from '@/lib/ciphers';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/i18n';
import { DisappearingTimer } from './DisappearingMessages';

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
        <div className="text-center space-y-8 px-8 max-w-lg mx-auto">
          <div className="relative inline-flex items-center justify-center mx-auto">
            <motion.div
              className="absolute inset-0 -m-12 rounded-full bg-emerald-400/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/20 border-2 border-emerald-500/40 flex items-center justify-center"
              style={{ boxShadow: '0 0 70px rgba(16,245,181,0.35), 0 0 140px rgba(16,245,181,0.15), inset 0 2px 0 rgba(255,255,255,0.1)' }}>
              <Shield className="w-16 h-16 text-emerald-400" style={{ filter: 'drop-shadow(0 0 20px rgba(16,245,181,0.7))' }} />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              {t('chat.empty_title')}
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-md mx-auto">
              {t('chat.empty_desc')}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16,245,181,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-emerald-300"
            style={{
              background: 'linear-gradient(180deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
              border: '2px solid rgba(16,245,181,0.3)',
              boxShadow: '0 0 30px rgba(16,245,181,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <MessageSquare className="w-6 h-6" />
            Выберите чат слева
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header - Premium */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-black/[0.3] backdrop-blur-2xl flex-shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-2 -ml-1 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition" aria-label={t('chat.back')}>
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/20 flex items-center justify-center text-lg font-bold text-emerald-400 overflow-hidden ring-2 ring-emerald-500/30"
            style={{ boxShadow: '0 0 30px rgba(16,245,181,0.2)' }}>
            {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
              <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full object-cover" />
            ) : room.otherUserAvatar ? (
              <span className="text-2xl leading-none">{room.otherUserAvatar}</span>
            ) : room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white text-xl">{room.name}</h3>
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              {otherTyping ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  {typingUser} печатает...
                </span>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(16,245,181,0.7)' }} />
                  {t('chat.messages_count_short', { count: roomMessages.length })}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 text-sm font-bold text-emerald-400">
              {unreadCount} новых
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10"
            style={{ boxShadow: '0 0 25px rgba(16,245,181,0.15)' }}>
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">E2EE</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 min-h-0 relative">
        {showEncryptingIndicator && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end mb-3">
            <div className="bg-emerald-950/40 border-2 border-emerald-800/30 rounded-2xl rounded-br-md px-5 py-3.5 backdrop-blur-xl"
              style={{ boxShadow: '0 0 25px rgba(16,245,181,0.15)' }}>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span className="text-base text-emerald-300/90 italic font-medium">{t('chat.encrypting_indicator')}</span>
              </div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 && !showEncryptingIndicator ? (
          <div className="flex items-center justify-center h-full min-h-[240px]">
            <div className="text-center space-y-5 px-8 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto"
                style={{ boxShadow: '0 0 40px rgba(16,245,181,0.25)' }}>
                <MessageSquare className="w-10 h-10 text-emerald-400" style={{ filter: 'drop-shadow(0 0 12px rgba(16,245,181,0.5))' }} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{t('chat.no_messages')}</h4>
                <p className="text-base text-zinc-400 leading-relaxed">{t('chat.no_messages_hint')}</p>
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
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }} className="flex items-end gap-3 mb-2 justify-start">
              <div className="bg-white/[0.04] border-2 border-white/[0.08] rounded-2xl rounded-bl-md px-5 py-3.5 backdrop-blur-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Area */}
      <div className="w-full px-4 pb-4 pt-3 flex-shrink-0">
        <div className="flex items-end gap-3 bg-black/[0.4] border-2 border-white/[0.1] rounded-3xl px-5 py-4 w-full backdrop-blur-3xl"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
          
          {/* Attachment menu */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="flex items-center justify-center w-11 h-11 rounded-2xl text-zinc-500 hover:text-emerald-400 hover:bg-white/[0.06] transition-all duration-200 flex-shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>
            
            <AnimatePresence>
              {showAttachmentMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-3 left-0 z-20 w-52 rounded-2xl border-2 border-white/[0.1] bg-[#0a0f17]/95 backdrop-blur-3xl shadow-2xl overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-white/[0.06] transition">
                      <ImageIcon className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-medium">Фото</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-white/[0.06] transition">
                      <File className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm font-medium">Файл</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-white/[0.06] transition">
                      <Smile className="w-5 h-5 text-violet-400" />
                      <span className="text-sm font-medium">Стикер</span>
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-200 text-sm font-medium ${
                cipher === 'none' 
                  ? 'border-white/[0.1] text-zinc-400 hover:border-emerald-400/40' 
                  : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">{activeCipherLabel}</span>
              <ChevronDown className="w-4 h-4" />
            </motion.button>
            {showCipherMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                <div className="absolute bottom-full mb-3 left-0 z-20 w-52 rounded-2xl border-2 border-white/[0.1] bg-[#0a0f17]/95 backdrop-blur-3xl shadow-2xl overflow-hidden">
                  {CIPHER_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }} 
                      className={`w-full text-left px-4 py-3 text-sm transition flex items-center gap-3 ${cipher === opt.value ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300 hover:bg-white/[0.06]'}`}>
                      <Lock className={`w-4 h-4 ${opt.value === 'none' ? 'opacity-30' : 'text-emerald-400'}`} />
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
              className="w-full bg-transparent border-none rounded-2xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none resize-none text-base max-h-36"
              style={{ minHeight: '44px' }}
            />
          </div>

          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 35px rgba(16,245,181,0.5)' }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="group/send flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-black hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            style={{ boxShadow: '0 0 30px rgba(16,245,181,0.3)' }}
          >
            <Send className="w-5 h-5 transition-transform group-hover/send:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}