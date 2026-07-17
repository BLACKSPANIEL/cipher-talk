'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, ChevronLeft, MessageSquare, Loader2, Paperclip } from 'lucide-react';
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

export function ChatWindow({ room, messages, currentUserId, onSendMessage, onDecryptMessage, decryptingMessageId, onBack }: ChatWindowProps) {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [cipher, setCipher] = useState<CipherType>('none');
  const [showCipherMenu, setShowCipherMenu] = useState(false);
  const [showEncryptingIndicator, setShowEncryptingIndicator] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, typingUser]);

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
    return () => { supabase.removeChannel(channel); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); };
  }, [room?.id, currentUserId]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    if (cipher !== 'none') {
      setShowEncryptingIndicator(true);
      setTimeout(() => { setShowEncryptingIndicator(false); onSendMessage(text, cipher); }, 800);
    } else { onSendMessage(text, cipher); }
    setInputText('');
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const activeCipherLabel = CIPHER_OPTIONS.find((o) => o.value === cipher)?.label ?? t('chat.cipher_none');
  const roomMessages = messages.filter((m) => m.roomId === room?.id);
  const unreadCount = roomMessages.filter(m => m.sender !== 'me' && m.status !== 'read').length;

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center relative">
        <div className="text-center space-y-6 px-6 max-w-md mx-auto">
          {/* Premium empty state */}
          <div className="relative inline-flex items-center justify-center mx-auto">
            <motion.div
              className="absolute inset-0 -m-10 rounded-full bg-emerald-400/15 blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center"
              style={{ boxShadow: '0 0 60px rgba(16,245,181,0.3), 0 0 120px rgba(16,245,181,0.1)' }}>
              <Shield className="w-12 h-12 text-emerald-400" style={{ filter: 'drop-shadow(0 0 15px rgba(16,245,181,0.6))' }} />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{t('chat.empty_title')}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
              {t('chat.empty_desc')}
            </p>
          </div>

          {/* Single CTA button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(16,245,181,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-emerald-300"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,245,181,0.2)',
            }}
          >
            <MessageSquare className="w-4 h-4" />
            Выберите чат слева
          </motion.button>
        </div>
      </div>
    );
  }

  const otherTyping = typingUser !== null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header - Ultra minimal */}
      <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-white/[0.05] bg-black/[0.25] backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition" aria-label={t('chat.back')}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 flex items-center justify-center text-sm font-bold text-emerald-400 overflow-hidden ring-1 ring-emerald-500/20">
            {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
              <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full object-cover" />
            ) : room.otherUserAvatar ? (
              <span className="text-lg leading-none">{room.otherUserAvatar}</span>
            ) : room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{room.name}</h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5">
              {otherTyping ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  {typingUser} печатает...
                </span>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(16,245,181,0.6)' }} />
                  {t('chat.messages_count_short', { count: roomMessages.length })}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              {unreadCount} новых
            </div>
          )}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">E2EE</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-5 py-3 space-y-2 min-h-0 relative">
        {showEncryptingIndicator && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end mb-2">
            <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl rounded-br-md px-4 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-sm text-emerald-300/80 italic">{t('chat.encrypting_indicator')}</span>
              </div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 && !showEncryptingIndicator ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center space-y-4 px-6 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto"
                style={{ boxShadow: '0 0 30px rgba(16,245,181,0.25)' }}>
                <MessageSquare className="w-8 h-8 text-emerald-400" style={{ filter: 'drop-shadow(0 0 8px rgba(16,245,181,0.4))' }} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">{t('chat.no_messages')}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{t('chat.no_messages_hint')}</p>
              </div>
            </div>
          </div>
        ) : (
          roomMessages.map((msg, idx) => {
            const prevMsg = idx > 0 ? roomMessages[idx - 1] : null;
            const gapFromPrev = prevMsg && prevMsg.senderId !== msg.senderId;
            return (
              <div key={msg.id} className={gapFromPrev ? 'mt-3' : undefined}>
                <MessageBubble message={msg} onDecrypt={onDecryptMessage} isDecrypting={decryptingMessageId === msg.id} />
              </div>
            );
          })
        )}

        <AnimatePresence>
          {otherTyping && !showEncryptingIndicator && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }} className="flex items-end gap-2 mb-2 justify-start">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3 backdrop-blur-sm flex items-center gap-1.5">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Area */}
      <div className="w-full px-3 md:px-5 pb-3 md:pb-5 pt-2.5 flex-shrink-0">
        <div className="flex items-end gap-2.5 bg-black/[0.35] border border-white/[0.08] rounded-2xl px-4 py-3 w-full backdrop-blur-2xl"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
          {/* Attachment button */}
          <motion.button
            whileHover={{ scale: 1.08, color: '#10f5b5' }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-zinc-500 hover:text-emerald-400 hover:bg-white/[0.04] transition-all duration-200 flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </motion.button>

          {/* Cipher selector */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCipherMenu(!showCipherMenu)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all duration-200 text-xs font-medium ${
                cipher === 'none' 
                  ? 'border-white/[0.08] text-zinc-400 hover:border-emerald-400/30' 
                  : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{activeCipherLabel}</span>
              <ChevronDown className="w-3 h-3" />
            </motion.button>
            {showCipherMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                <div className="absolute bottom-full mb-2 left-0 z-20 w-44 rounded-xl border border-white/[0.08] bg-[#0a0f17]/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                  {CIPHER_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }} 
                      className={`w-full text-left px-4 py-3 text-sm transition flex items-center gap-2.5 ${cipher === opt.value ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300 hover:bg-white/[0.04]'}`}>
                      <Lock className={`w-3.5 h-3.5 ${opt.value === 'none' ? 'opacity-30' : 'text-emerald-400'}`} />
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
              className="w-full bg-transparent border-none rounded-xl px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none resize-none text-sm max-h-32"
              style={{ minHeight: '40px' }}
            />
          </div>

          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16,245,181,0.4)' }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="group/send flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-black hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            style={{ boxShadow: '0 0 20px rgba(16,245,181,0.25)' }}
          >
            <Send className="w-4 h-4 transition-transform group-hover/send:translate-x-0.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}