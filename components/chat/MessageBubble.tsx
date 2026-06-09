import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Loader2 } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  sender: 'me' | 'other';
  timestamp: Date;
  cipher?: string;
  roomId: string;
  isEncrypted?: boolean;
  originalText?: string;
  isE2ee?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onDecrypt?: (messageId: string) => void;
  isDecrypting?: boolean;
}

export function MessageBubble({ message, onDecrypt, isDecrypting }: MessageBubbleProps) {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const isMine = message.sender === 'me';

  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(message.timestamp));

  const handleToggleDecrypt = () => {
    if (!isDecrypted && onDecrypt) {
      onDecrypt(message.id);
    }
    setIsDecrypted((prev) => !prev);
  };

  const displayText = isDecrypted && message.originalText ? message.originalText : message.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isMine
            ? 'bg-neon-green text-black rounded-br-md'
            : 'bg-gray-800/60 text-gray-100 rounded-bl-md border border-gray-700/30'
        }`}
      >
        {/* Имя отправителя — показываем только для чужих сообщений */}
        {!isMine && (
          <p className="text-[10px] uppercase tracking-wider text-neon-green/70 mb-1 font-medium">
            {message.senderName}
          </p>
        )}

        {/* Encrypting indicator */}
        {message.isEncrypted && isDecrypting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
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

        <div
          className={`flex items-center gap-2 mt-1.5 ${
            isMine ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.isEncrypted && !isDecrypting && (
            <button
              onClick={handleToggleDecrypt}
              className={`text-[10px] uppercase tracking-wider flex items-center gap-1 transition ${
                isDecrypted
                  ? 'text-neon-green'
                  : isMine
                  ? 'text-black/50 hover:text-black/80'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title={isDecrypted ? 'Скрыть расшифровку' : 'Расшифровать'}
            >
              {isDecrypted ? (
                <>
                  <Unlock className="w-3 h-3" />
                  расшифровано
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  расшифровать
                </>
              )}
            </button>
          )}

          {message.cipher && message.cipher !== 'none' && !message.isEncrypted && (
            <span
              className={`text-[10px] uppercase tracking-wider ${
                isMine ? 'text-black/60' : 'text-gray-500'
              }`}
            >
              {message.cipher === 'caesar'
                ? 'Цезарь'
                : message.cipher === 'base64'
                ? 'Base64'
                : ''}
            </span>
          )}
          <span
            className={`text-[10px] ${
              isMine ? 'text-black/50' : 'text-gray-500'
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}