'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-glass-lg overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white text-base tracking-wide">
                  Защита данных
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
                title="Закрыть"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-zinc-300 text-sm leading-relaxed space-y-4 scrollbar-thin">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Политика конфиденциальности (Privacy Policy)
              </h2>
              <p>
                <strong className="text-emerald-400">Дата вступления в силу: 9 июня 2026 года</strong>
              </p>
              <p>
                Защита ваших данных — наш главный приоритет. Мы спроектировали архитектуру
                CipherTalk так, чтобы минимизировать сбор личных данных.
              </p>

              <h3 className="text-base font-semibold text-white pt-2">
                1. Категории обрабатываемых данных
              </h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                <li>
                  <strong className="text-white">Регистрационные данные:</strong> Email и Username
                  хранятся в таблице <code className="text-emerald-300 font-mono text-xs">profiles</code>{' '}
                  для авторизации и поиска контактов через{' '}
                  <code className="text-emerald-300 font-mono text-xs">SearchUserModal</code> по
                  маске <code className="text-emerald-300 font-mono text-xs">ilike</code>.
                </li>
                <li>
                  <strong className="text-white">Контент сообщений:</strong> Все сообщения
                  передаются в зашифрованном виде. Доступ к ним имеют только верифицированные
                  участники комнат из таблицы{' '}
                  <code className="text-emerald-300 font-mono text-xs">room_members</code>.
                </li>
                <li>
                  <strong className="text-white">Медиафайлы:</strong> Загружаемые аватары и
                  вложения (до 5 МБ) сохраняются в изолированном публичном бакете{' '}
                  <code className="text-emerald-300 font-mono text-xs">chat-attachments</code> в
                  Supabase Storage и отображаются через{' '}
                  <code className="text-emerald-300 font-mono text-xs">MessageBubble.tsx</code>{' '}
                  по прямым хэшированным ссылкам.
                </li>
              </ul>

              <h3 className="text-base font-semibold text-white pt-2">
                2. Технологии реального времени
              </h3>
              <p>
                Индикатор набора текста (Typing Indicator) работает через Broadcast-каналы по
                маске{' '}
                <code className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-emerald-300 text-xs font-mono">
                  typing-$&#123;roomId&#125;
                </code>{' '}
                в оперативной памяти. События активности не логируются в базу данных и
                полностью уничтожаются по 3-секундному таймауту.
              </p>
              <p>
                Статусы сообщений (одна галочка — <em>sent</em>, две серые —{' '}
                <em>delivered</em>, две изумрудные — <em>read</em>) обрабатываются
                исключительно для работы UI-логики.
              </p>

              <h3 className="text-base font-semibold text-white pt-2">
                3. Безопасность и передача третьим лицам
              </h3>
              <p>
                Сессии защищены на уровне Next.js SSR Middleware через защищенные куки
                (HttpOnly, Secure). Права доступа к комнатам изолированы через{' '}
                <strong className="text-emerald-400">Row Level Security (RLS)</strong> в
                Supabase. Мы{' '}
                <strong className="text-white">никогда не передаем и не продаем</strong> ваши
                данные третьим лицам и рекламным трекерам.
              </p>

              <div className="pt-3 mt-2 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>CipherTalk © 2026 — zero-logs policy</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-800/80 flex-shrink-0 bg-zinc-900/40">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-sm font-medium"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
