'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Loader2, AlertCircle, Check, CheckCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  sender: 'me' | 'other';
  senderAvatar?: string | null;
  timestamp: Date;
  cipher?: string;
  roomId: string;
  isEncrypted?: boolean;
  originalText?: string;
  isE2ee?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

interface MessageBubbleProps {
  message: Message;
  onDecrypt?: (messageId: string) => void;
  isDecrypting?: boolean;
}

function Avatar({ avatar, name }: { avatar?: string | null; name: string }) {
  const initial = name.charAt(0).toUpperCase();
  const isImage = avatar && (avatar.startsWith('data:') || avatar.startsWith('http'));
  const isEmoji = avatar && !isImage;

  if (isImage) {
    return (
      <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-[0_0_20px_rgba(16,245,181,0.15)]">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,245,181,0.15)]">
        <span className="text-lg leading-none">{avatar}</span>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/25 shadow-[0_0_20px_rgba(16,245,181,0.15)]">
      <span className="text-sm font-bold text-emerald-300">{initial}</span>
    </div>
  );
}

function StatusIcon({ status }: { status?: Message['status'] }) {
  if (!status) return null;
  if (status === 'sending') {
    return <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />;
  }
  if (status === 'error') {
    return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
  }
  if (status === 'read') {
    return <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="w-3.5 h-3.5 text-zinc-400" />;
  }
  return <Check className="w-3.5 h-3.5 text-zinc-500" />;
}

export function MessageBubble({ message, onDecrypt, isDecrypting }: MessageBubbleProps) {
  const { t } = useLanguage();
  const [isDecrypted, setIsDecrypted] = useState(false);
  const isMine = message.sender === 'me';
  const isOptimistic = message.status === 'sending';
  const isError = message.status === 'error';

  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(message.timestamp));

  const handleToggleDecrypt = () => {
    if (!isDecrypted && onDecrypt) onDecrypt(message.id);
    setIsDecrypted((prev) => !prev);
  };

  const displayText = isDecrypted && message.originalText ? message.originalText : message.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-2.5 mb-3 ${isMine ? 'justify-end' : 'justify-start'} ${
        isError ? 'opacity-70' : ''
      }`}
    >
      {!isMine && <Avatar avatar={message.senderAvatar} name={message.senderName} />}

      <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && (
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 px-1 font-semibold">
            {message.senderName}
          </p>
        )}

        <motion.div
          className={`relative rounded-2xl px-4 py-3 backdrop-blur-xl ${
            isMine
              ? `bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border border-emerald-500/25 text-white rounded-2xl rounded-tr-md shadow-[0_0_30px_rgba(16,245,181,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] ${
                  isError ? 'border-red-500/50' : ''
                }`
              : 'bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.08] text-neutral-200 rounded-2xl rounded-tl-md shadow-[0_0_20px_rgba(0,0,0,0.2)]'
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {isMine && message.isE2ee && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock className="w-2.5 h-2.5 text-emerald-400/70" />
              <span className="text-[9px] uppercase tracking-widest text-emerald-400/70 font-bold">{t('chat.e2ee_badge')}</span>
            </div>
          )}

          {message.isEncrypted && isDecrypting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="text-sm italic opacity-70">{t('chat.decrypting_indicator')}</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.isEncrypted && !isDecrypted ? (
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="w-3 h-3 opacity-60" />
                  <span className="opacity-80">{displayText}</span>
                </span>
              ) : (
                displayText
              )}
            </p>
          )}

          <div className={`flex items-center gap-2 mt-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {message.isEncrypted && !isDecrypting && !isMine && (
              <motion.button
                onClick={handleToggleDecrypt}
                className="text-[10px] uppercase tracking-wider flex items-center gap-1 transition text-zinc-500 hover:text-emerald-300"
                title={t('chat.decrypt')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDecrypted ? <><Unlock className="w-3 h-3" />{t('chat.decrypted')}</> : <><Lock className="w-3 h-3" />{t('chat.decrypt')}</>}
              </motion.button>
            )}

            {message.cipher && message.cipher !== 'none' && !message.isEncrypted && (
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                {message.cipher === 'caesar' ? t('chat.cipher_caesar') : message.cipher === 'base64' ? 'Base64' : ''}
              </span>
            )}

            <span className="text-[10px] text-zinc-500">
              {formattedTime}
            </span>

            {isMine && <StatusIcon status={message.status} />}
          </div>
        </motion.div>
      </div>

      {isMine && <Avatar avatar={message.senderAvatar} name={message.senderName} />}

      {isOptimistic && null}
    </motion.div>
  );
}