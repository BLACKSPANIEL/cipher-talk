'use client';

import { motion } from 'framer-motion';

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  cipher?: string;
  roomId: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMine = message.sender === 'me';

  const formattedTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(message.timestamp));

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
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <div
          className={`flex items-center gap-2 mt-1.5 ${
            isMine ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.cipher && message.cipher !== 'none' && (
            <span
              className={`text-[10px] uppercase tracking-wider ${
                isMine ? 'text-black/60' : 'text-gray-500'
              }`}
            >
              {message.cipher === 'caesar' ? 'Цезарь' : message.cipher === 'base64' ? 'Base64' : ''}
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