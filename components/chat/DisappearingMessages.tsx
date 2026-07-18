'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer, Shield, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface DisappearingTimerProps {
  seconds: number;
  onComplete?: () => void;
}

export function DisappearingTimer({ seconds, onComplete }: DisappearingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const { t } = useLanguage();

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  if (timeLeft <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
    >
      <Timer className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-[10px] font-bold text-emerald-400">
        {timeLeft}s
      </span>
    </motion.div>
  );
}

interface DisappearingSettingsProps {
  enabled: boolean;
  timer: number;
  onToggle: (enabled: boolean) => void;
  onChangeTimer: (seconds: number) => void;
}

export function DisappearingSettings({ enabled, timer, onToggle, onChangeTimer }: DisappearingSettingsProps) {
  const { t } = useLanguage();
  const [showTimerSelector, setShowTimerSelector] = useState(false);

  const timerOptions = [5, 10, 30, 60, 300, 3600, 86400]; // 5s, 10s, 30s, 1m, 5m, 1h, 24h

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Disappearing Messages</p>
            <p className="text-[10px] text-zinc-500">Сообщения удаляются автоматически</p>
          </div>
        </div>
        
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative w-12 h-6 rounded-full transition-all ${
            enabled ? 'bg-emerald-500' : 'bg-white/20'
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
            enabled ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <p className="text-[11px] text-zinc-400 mb-3 uppercase tracking-wider">
                Время до удаления
              </p>
              <div className="grid grid-cols-4 gap-2">
                {timerOptions.map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => onChangeTimer(seconds)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      timer === seconds
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {seconds < 60 ? `${seconds}s` : seconds < 3600 ? `${seconds / 60}м` : `${seconds / 3600}ч`}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Message reactions component
interface MessageReactionsProps {
  messageId: string;
  reactions?: Record<string, number>;
  onAddReaction?: (messageId: string, emoji: string) => void;
}

export function MessageReactions({ messageId, reactions = {}, onAddReaction }: MessageReactionsProps) {
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  if (Object.keys(reactions).length === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-1.5">
      {Object.entries(reactions).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onAddReaction?.(messageId, emoji)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition"
        >
          <span className="text-xs">{emoji}</span>
          <span className="text-[9px] text-zinc-400 font-medium">{count}</span>
        </button>
      ))}
    </div>
  );
}

// Quick reaction picker
export function QuickReactions({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (emoji: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute bottom-full mb-2 flex items-center gap-1 p-2 rounded-2xl border border-white/[0.08] bg-[#0a0f17]/95 backdrop-blur-2xl shadow-2xl"
    >
      {['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'].map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-8 h-8 rounded-lg hover:bg-white/[0.08] transition flex items-center justify-center text-lg"
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
}