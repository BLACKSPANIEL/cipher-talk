'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, ChevronLeft, MessageSquare, Loader2 } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const { data: profile } = await supabase.from('profiles').select('username').eq('id', currentUserId).single();
      if (profile) {
        const ch = supabase.channel(`typing-${room.id}`);
        ch.send({ type: 'broadcast', event: 'typing', payload: { username: profile.username, userId: currentUserId } });
      }
    }
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    if (cipher !== 'none') {
      setShowEncryptingIndicator(true);
      setTimeout(() => { setShowEncryptingIndicator(false); onSendMessage(text, cipher); }, 1000);
    } else { onSendMessage(text, cipher); }
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const activeCipherLabel = CIPHER_OPTIONS.find((o) => o.value === cipher)?.label ?? t('chat.cipher_none');
  const roomMessages = messages.filter((m) => m.roomId === room?.id);

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center relative">
        <div className="text-center space-y-4 md:space-y-6 px-4 md:px-6 max-w-md mx-auto">
          {/* Mobile: smaller shield */}
          <div className="relative inline-flex items-center justify-center mx-auto animate-shield-float">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-neon-green/10 flex items-center justify-center" style={{ boxShadow: '0 0 40px rgba(0,255,102,0.3), 0 0 80px rgba(0,255,102,0.10)' }}>
              <Shield className="w-8 h-8 md:w-12 md:h-12 text-neon-green" style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,102,0.6))' }} />
            </div>
            <span className="absolute inset-0 rounded-full border border-neon-green/25 animate-pulse-glow" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 tracking-tight">{t('chat.empty_title')}</h3>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed px-2 md:px-0">
              {t('chat.empty_desc')}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/5 mx-auto">
            <Lock className="w-3 h-3 md:w-3.5 md:h-3.5 text-neon-green" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-neon-green font-medium">{t('chat.e2ee_label')}</span>
          </div>
        </div>
      </div>
    );
  }

  const otherTyping = typingUser !== null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          {onBack && (
            <button onClick={onBack} className="md:hidden p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition" aria-label={t('chat.back')}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-neon-green/15 flex items-center justify-center text-sm font-bold text-neon-green overflow-hidden">
            {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
              <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full object-cover" />
            ) : room.otherUserAvatar ? (
              <span className="text-lg leading-none">{room.otherUserAvatar}</span>
            ) : room.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{room.name}</h3>
            <p className="text-xs text-zinc-500">
              {otherTyping ? <span className="text-emerald-400">{typingUser} {t('chat.typing_indicator').replace('{name}', '').trim()}</span> : t('chat.messages_count_short', { count: roomMessages.length })}
            </p>
          </div>
        </div>
        <button type="button" className="group/e2ee flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/5 hover:animate-e2ee-pulse transition-all duration-300">
          <Lock className="w-3.5 h-3.5 text-neon-green transition-transform group-hover/e2ee:scale-110" />
          <span className="text-xs font-medium text-neon-green">{t('chat.e2ee_badge')}</span>
        </button>
      </div>

      {/* Messages Area — cyberpunk grid texture */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-4 space-y-1 min-h-0 relative">
        {/* Subtle cyberpunk grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,255,102,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {showEncryptingIndicator && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end mb-2">
            <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl rounded-br-md px-3.5 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /><span className="text-xs text-emerald-300/80 italic">{t('chat.encrypting_indicator')}</span></div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 && !showEncryptingIndicator ? (
          <div className="flex items-center justify-center h-full min-h-[200px] md:min-h-[300px]">
            <div className="text-center space-y-3 md:space-y-5 px-4 md:px-6 max-w-sm mx-auto">
              <div className="relative inline-flex items-center justify-center mx-auto">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-neon-green/10 flex items-center justify-center" style={{ boxShadow: '0 0 30px rgba(0,255,102,0.3), 0 0 60px rgba(0,255,102,0.10)' }}>
                  <MessageSquare className="w-7 h-7 md:w-10 md:h-10 text-neon-green" style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,102,0.5))' }} />
                </div>
                <span className="absolute inset-0 rounded-full border border-neon-green/25 animate-pulse-glow" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-white mb-0.5 md:mb-1">{t('chat.no_messages')}</h4>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{t('chat.no_messages_hint')}</p>
              </div>
            </div>
          </div>
        ) : (
          roomMessages.map((msg, idx) => {
            const prevMsg = idx > 0 ? roomMessages[idx - 1] : null;
            const gapFromPrev = prevMsg && prevMsg.senderId !== msg.senderId;
            return (
              <div key={msg.id} className={gapFromPrev ? 'mt-4' : undefined}>
                <MessageBubble message={msg} onDecrypt={onDecryptMessage} isDecrypting={decryptingMessageId === msg.id} />
              </div>
            );
          })
        )}

        <AnimatePresence>
          {otherTyping && !showEncryptingIndicator && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }} className="flex items-end gap-2 mb-2 justify-start">
              <div className="bg-zinc-800/70 border border-zinc-700/40 rounded-2xl rounded-bl-md px-3.5 py-2.5 backdrop-blur-sm flex items-center gap-1.5">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Capsule Input — compact on mobile */}
      <div className="px-2 md:px-8 pb-2 md:pb-5 pt-2 md:pt-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 rounded-2xl px-3 py-2.5 backdrop-blur-xl border border-zinc-700/50 shadow-glass" style={{ background: 'linear-gradient(180deg, rgba(39,39,42,0.65), rgba(24,24,27,0.55))' }}>
            <div className="relative">
              <button onClick={() => setShowCipherMenu(!showCipherMenu)} className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border transition-all text-xs ${cipher === 'none' ? 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200' : 'border-neon-green/30 text-neon-green bg-neon-green/5 hover:bg-neon-green/10'}`}>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{activeCipherLabel}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showCipherMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                  <div className="absolute bottom-full mb-2 left-0 z-20 w-44 rounded-xl border border-zinc-800/50 bg-zinc-900/95 backdrop-blur-2xl shadow-glass-lg overflow-hidden">
                    {CIPHER_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2 ${cipher === opt.value ? 'text-neon-green bg-neon-green/10' : 'text-zinc-300 hover:bg-zinc-800/40'}`}>
                        <Lock className={`w-3.5 h-3.5 ${opt.value === 'none' ? 'opacity-30' : 'text-neon-green'}`} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 relative">
              <textarea value={inputText} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={t('chat.input_placeholder')} rows={1} className="w-full bg-transparent border-none rounded-xl px-2 py-2 text-white placeholder-zinc-500 focus:outline-none resize-none text-sm max-h-32" style={{ minHeight: '36px' }} />
            </div>
            <button onClick={handleSend} disabled={!inputText.trim()} className="group/send flex items-center justify-center w-11 h-11 rounded-xl bg-chat-gradient text-black hover:scale-105 active:scale-95 hover:shadow-[0_0_24px_rgba(0,255,102,0.6),0_0_8px_rgba(0,255,102,0.4)] disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex-shrink-0" style={{ boxShadow: '0 0 0 1px rgba(0,255,102,0.15)' }}>
              <Send className="w-4 h-4 transition-transform group-hover/send:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}