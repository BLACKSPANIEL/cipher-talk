'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Lock, ChevronDown, ChevronLeft, MessageSquare, Loader2, Paperclip, Smile, Image as ImageIcon, File, X, MoreVertical, Reply, Forward, Trash2, Copy, CheckCheck, Zap, Mic, Phone, Video, Info } from 'lucide-react';
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

const MessageList = memo(({ messages, onDecryptMessage, decryptingMessageId }: { messages: Message[]; onDecryptMessage?: (messageId: string) => void; decryptingMessageId?: string | null; }) => {
  return (
    <>
      {messages.map((msg, idx) => {
        const prevMsg = idx > 0 ? messages[idx - 1] : null;
        const gapFromPrev = prevMsg && prevMsg.senderId !== msg.senderId;
        return (
          <div key={msg.id} className={gapFromPrev ? 'mt-4' : 'mt-1'}>
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
  const [showHeaderActions, setShowHeaderActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputText, cipher, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(); 
    } 
  }, [handleSend]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, []);

  const otherTyping = typingUser !== null;

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0a0f17] to-[#05070d]">
        <div className="text-center space-y-6 max-w-md">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto"
            style={{ boxShadow: '0 0 50px rgba(16,245,181,0.3)' }}
          >
            <Shield className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Выберите чат</h2>
            <p className="text-zinc-400">Выберите диалог слева или найдите собеседника</p>
          </div>
          <motion.button 
            onClick={onBack} 
            className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            К списку чатов
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-black/20 backdrop-blur-xl relative z-20"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button 
              onClick={onBack} 
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 flex items-center justify-center ring-2 ring-emerald-500/30"
              style={{ boxShadow: '0 0 25px rgba(16,245,181,0.3)' }}>
              {room.otherUserAvatar && (room.otherUserAvatar.startsWith('data:') || room.otherUserAvatar.startsWith('http')) ? (
                <img src={room.otherUserAvatar} alt={room.name} className="w-full h-full rounded-2xl object-cover" />
              ) : room.otherUserAvatar ? (
                <span className="text-lg">{room.otherUserAvatar}</span>
              ) : (
                room.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0f17]" 
              style={{ boxShadow: '0 0 10px rgba(16,245,181,0.8)' }} />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-base">{room.name}</h3>
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(16,245,181,0.6)' }} />
              <p className="text-xs text-emerald-400/90 font-medium">
                {otherTyping ? `${typingUser} печатает...` : 'online'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-xs text-emerald-400 font-medium border border-emerald-500/20"
            >
              {unreadCount}
            </motion.span>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-bold">E2EE</span>
          </div>
          <motion.button 
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Info className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar relative">
        {showEncryptingIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-3"
          >
            <div className="bg-emerald-950/40 rounded-2xl px-4 py-2.5 border border-emerald-800/30">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-sm text-emerald-300">Шифрование...</span>
              </div>
            </div>
          </motion.div>
        )}

        {roomMessages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-full min-h-[200px]"
          >
            <div className="text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-zinc-400">Нет сообщений</p>
            </div>
          </motion.div>
        ) : (
          <MessageList 
            messages={roomMessages} 
            onDecryptMessage={onDecryptMessage} 
            decryptingMessageId={decryptingMessageId} 
          />
        )}

        <AnimatePresence>
          {otherTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-end gap-2 mb-3 justify-start"
            >
              <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5 border border-white/[0.08]">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gradient-to-t from-[#05070d] to-transparent">
        <div className="flex items-end gap-3 bg-black/40 border border-white/[0.08] rounded-3xl px-4 py-3 backdrop-blur-xl"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
          
          <div className="relative">
            <motion.button 
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-white/5 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>
            <AnimatePresence>
              {showAttachmentMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 flex flex-col gap-1 p-2 rounded-2xl bg-[#0a0f17] border border-white/[0.08] shadow-2xl"
                >
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-zinc-300">
                    <ImageIcon className="w-4 h-4" /> Фото
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-zinc-300">
                    <File className="w-4 h-4" /> Файл
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <motion.button 
              onClick={() => setShowCipherMenu(!showCipherMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/[0.08] text-sm text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/20 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">{activeCipherLabel}</span>
            </motion.button>
            <AnimatePresence>
              {showCipherMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCipherMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-2 left-0 z-20 w-48 rounded-2xl border border-white/[0.08] bg-[#0a0f17] shadow-2xl overflow-hidden"
                  >
                    {CIPHER_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.value}
                        onClick={() => { setCipher(opt.value); setShowCipherMenu(false); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition ${cipher === opt.value ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-300'}`}
                        whileHover={{ x: 4 }}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => { handleInputChange(e); adjustTextareaHeight(); }}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение..."
            rows={1}
            className="flex-1 bg-transparent border-none rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none transition-all"
            style={{ minHeight: '40px' }}
          />

          <motion.button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-30 flex items-center justify-center transition-all"
            style={{ boxShadow: inputText.trim() ? '0 0 25px rgba(16,245,181,0.4)' : 'none' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}