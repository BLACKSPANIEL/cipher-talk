import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Loader2, Check, CheckCheck } from 'lucide-react';

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
  status?: 'sent' | 'delivered' | 'read';
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
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-zinc-700/50">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-800/70 flex items-center justify-center flex-shrink-0 ring-1 ring-zinc-700/50">
        <span className="text-base leading-none">{avatar}</span>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-zinc-800/70 flex items-center justify-center flex-shrink-0 ring-1 ring-zinc-700/50">
      <span className="text-xs font-bold text-zinc-300">{initial}</span>
    </div>
  );
}

function StatusIcon({ status }: { status?: 'sent' | 'delivered' | 'read' }) {
  if (!status) return null;
  if (status === 'read') {
    return <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="w-3.5 h-3.5 text-zinc-400" />;
  }
  return <Check className="w-3.5 h-3.5 text-zinc-500" />;
}

export function MessageBubble({ message, onDecrypt, isDecrypting }: MessageBubbleProps) {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const isMine = message.sender === 'me';

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
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex items-end gap-2 mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      {/* Other's avatar (left side) */}
      {!isMine && <Avatar avatar={message.senderAvatar} name={message.senderName} />}

      <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
        {/* Sender name for other's messages */}
        {!isMine && (
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 px-1 font-semibold">
            {message.senderName}
          </p>
        )}

        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-3.5 py-2 backdrop-blur-sm ${
            isMine
              ? 'bg-emerald-950/40 border border-emerald-800/30 text-emerald-50 rounded-br-md shadow-[0_4px_20px_rgba(16,185,129,0.08)]'
              : 'bg-zinc-800/60 border border-zinc-700/40 text-zinc-100 rounded-bl-md'
          }`}
        >
          {/* E2EE badge for my encrypted messages */}
          {isMine && message.isE2ee && (
            <div className="flex items-center gap-1 mb-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400/70" />
              <span className="text-[9px] uppercase tracking-widest text-emerald-400/70 font-medium">E2EE</span>
            </div>
          )}

          {/* Content */}
          {message.isEncrypted && isDecrypting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="text-sm italic opacity-70">Расшифровка...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.isEncrypted && !isDecrypted ? (
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 opacity-60" />
                  <span className="opacity-80">{displayText}</span>
                </span>
              ) : (
                displayText
              )}
            </p>
          )}

          {/* Footer — timestamp + status for mine / timestamp + decrypt for other */}
          <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {/* Decrypt button for other */}
            {message.isEncrypted && !isDecrypting && !isMine && (
              <button
                onClick={handleToggleDecrypt}
                className="text-[10px] uppercase tracking-wider flex items-center gap-1 transition text-zinc-500 hover:text-emerald-300"
                title="Расшифровать"
              >
                {isDecrypted ? <><Unlock className="w-3 h-3" />расшифровано</> : <><Lock className="w-3 h-3" />расшифровать</>}
              </button>
            )}

            {/* Cipher label */}
            {message.cipher && message.cipher !== 'none' && !message.isEncrypted && (
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                {message.cipher === 'caesar' ? 'Цезарь' : message.cipher === 'base64' ? 'Base64' : ''}
              </span>
            )}

            <span className="text-[10px] text-zinc-500">
              {formattedTime}
            </span>

            {/* Status icon for my messages (sent / delivered / read) */}
            {isMine && <StatusIcon status={message.status} />}
          </div>
        </div>
      </div>

      {/* My avatar (right side) */}
      {isMine && <Avatar avatar={message.senderAvatar} name={message.senderName} />}
    </motion.div>
  );
}
