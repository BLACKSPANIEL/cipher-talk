'use client';

import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, CheckCheck, Clock, Reply, Copy, Smile, Star, Check, AlertCircle, Loader2, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  sender: 'me' | 'other';
  senderAvatar?: string | null;
  timestamp: Date;
  roomId: string;
  cipher?: string;
  isEncrypted?: boolean;
  originalText?: string;
  isE2ee?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  replyTo?: { id: string; text: string; senderName: string; };
  reactions?: Record<string, string[]>;
  isPinned?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onDecrypt?: (messageId: string) => void;
  isDecrypting?: boolean;
  onReply?: (message: Message) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const REACTIONS = ['👍', '❤️', '😄', '🎉', '🔥', '👀'];

const Avatar = memo(({ avatar, name }: { avatar?: string | null; name: string }) => {
  const initial = name.charAt(0).toUpperCase();
  if (avatar && (avatar.startsWith('data:') || avatar.startsWith('http'))) {
    return <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/[0.08]">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>;
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/15 flex items-center justify-center flex-shrink-0 ring-2 ring-emerald-500/25 shadow-[0_0_15px_rgba(16,245,181,0.15)]">
      <span className="text-xs font-bold text-emerald-300">{initial}</span>
    </div>
  );
});
Avatar.displayName = 'Avatar';

const StatusIcon = memo(({ status }: { status?: Message['status'] }) => {
  switch (status) {
    case 'sending': return <Loader2 className="w-3 h-3 text-zinc-500 animate-spin" />;
    case 'sent': return <Check className="w-3 h-3 text-zinc-500" />;
    case 'delivered': return <CheckCheck className="w-3 h-3 text-zinc-400" />;
    case 'read': return <CheckCheck className="w-3 h-3 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16,245,181,0.6))' }} />;
    case 'error': return <AlertCircle className="w-3 h-3 text-red-400" />;
    default: return null;
  }
});
StatusIcon.displayName = 'StatusIcon';

const ReactionBar = memo(({ messageId, onReact }: { messageId: string; onReact?: (messageId: string, emoji: string) => void }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
    className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl bg-[#0a0f17] border border-white/[0.12] shadow-2xl z-20"
    style={{ backdropFilter: 'blur(24px)' }}>
    {REACTIONS.map(emoji => (
      <motion.button key={emoji} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }}
        onClick={() => onReact?.(messageId, emoji)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition text-sm">
        {emoji}
      </motion.button>
    ))}
  </motion.div>
));
ReactionBar.displayName = 'ReactionBar';

export const MessageBubble = memo(function MessageBubble({ message, onDecrypt, isDecrypting, onReply, onReact }: MessageBubbleProps) {
  const { t } = useLanguage();
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [localReactions, setLocalReactions] = useState<Record<string, number>>(() => {
    if (message.reactions) {
      const counts: Record<string, number> = {};
      Object.entries(message.reactions).forEach(([emoji, users]) => { counts[emoji] = users.length; });
      return counts;
    }
    return {};
  });
  const [isPinned] = useState(message.isPinned || false);
  const isMine = message.sender === 'me';
  const isError = message.status === 'error';

  const formattedTime = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(message.timestamp));

  const handleDecrypt = useCallback(() => {
    if (!isDecrypted && onDecrypt) onDecrypt(message.id);
    setIsDecrypted(prev => !prev);
  }, [isDecrypted, onDecrypt, message.id]);

  const handleReact = useCallback((emoji: string) => {
    setLocalReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    onReact?.(message.id, emoji);
    setShowReactions(false);
  }, [message.id, onReact]);

  const displayText = isDecrypted && message.originalText ? message.originalText : message.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-end gap-2 mb-3 relative ${isMine ? 'justify-end' : 'justify-start'} ${isError ? 'opacity-60' : ''}`}
    >
      {!isMine && <Avatar avatar={message.senderAvatar} name={message.senderName} />}

      <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isMine ? 'items-end' : 'items-start'} relative group`}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}>
        
        {!isMine && (
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/80 mb-1.5 font-bold px-1">{message.senderName}</p>
        )}

        {message.replyTo && (
          <div className={`mb-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border-l-2 border-emerald-400/50 ${isMine ? 'self-end' : 'self-start'}`}>
            <p className="text-[9px] text-emerald-400/70 font-bold uppercase tracking-wider mb-0.5">{message.replyTo.senderName}</p>
            <p className="text-xs text-zinc-400 truncate max-w-[200px]">{message.replyTo.text}</p>
          </div>
        )}

        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}
          className={`relative rounded-3xl px-4 py-3 ${
            isMine
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-br-md'
              : 'bg-white/[0.04] border border-white/[0.08] rounded-bl-md'
          }`}
          style={{ boxShadow: isMine ? '0 4px 24px rgba(16,245,181,0.12), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          
          {isMine && message.isE2ee && (
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[8px] uppercase tracking-[0.15em] text-emerald-400/70 font-bold">E2EE</span>
            </div>
          )}

          {message.isEncrypted && isDecrypting ? (
            <div className="flex items-center gap-2.5 py-1">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="text-sm italic text-emerald-300/80">{t('chat.decrypting_indicator')}</span>
            </div>
          ) : (
            <>
              {message.isEncrypted && !isDecrypted ? (
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-sm opacity-80 font-mono text-xs">{displayText.slice(0, 40)}...</span>
                  {!isMine && (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDecrypt}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    </motion.button>
                  )}
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-zinc-100">{displayText}</p>
              )}
            </>
          )}

          {Object.keys(localReactions).length > 0 && (
            <div className="flex items-center gap-1 mt-2 -mb-1 flex-wrap">
              {Object.entries(localReactions).map(([emoji, count]) => (
                <motion.button key={emoji} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleReact(emoji)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs hover:bg-emerald-500/10 hover:border-emerald-500/20 transition">
                  <span>{emoji}</span>
                  {count > 1 && <span className="text-zinc-400 text-[9px] font-medium">{count}</span>}
                </motion.button>
              ))}
            </div>
          )}

          {isPinned && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[8px] text-emerald-400/60 uppercase tracking-wider font-bold">Закреплено</span>
            </div>
          )}
        </motion.div>

        {showReactions && !isDecrypting && (
          <ReactionBar messageId={message.id} onReact={onReact} />
        )}

        <div className={`flex items-center gap-2 mt-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
          {showReactions && !isDecrypting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-0.5 ${isMine ? 'flex-row-reverse' : ''}`}>
              <button onClick={() => onReply?.(message)} className="p-1 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-white/5 transition"><Reply className="w-3 h-3" /></button>
              <button className="p-1 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-white/5 transition"><Copy className="w-3 h-3" /></button>
            </motion.div>
          )}
          <div className="flex items-center gap-1">
            <span className={`text-[10px] ${isError ? 'text-red-400' : 'text-zinc-600'}`}>{formattedTime}</span>
            {isMine && <StatusIcon status={message.status} />}
          </div>
          {message.cipher && message.cipher !== 'none' && !message.isEncrypted && (
            <span className="text-[8px] uppercase tracking-wider text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded-full">{message.cipher}</span>
          )}
          {isPinned && <Star className="w-2.5 h-2.5 text-emerald-400" />}
        </div>
      </div>

      {isMine && <Avatar avatar={message.senderAvatar} name={message.senderName} />}
    </motion.div>
  );
});