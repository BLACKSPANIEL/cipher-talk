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
            <div className="flex-1 overflow-y-auto px-6 py-5 text-zinc-300 text-sm leading-relaxed scrollbar-thin">
              <h2 className="text-xl font-bold text-white tracking-tight mb-3">
                Политика конфиденциальности (Privacy Policy)
              </h2>
              <p className="text-emerald-400 text-sm font-semibold mb-4">
                Дата вступления в силу: 9 июня 2026 года | Статус: Положение об обработке данных
              </p>
              <p className="mb-4 text-zinc-300">
                Защита вашей частной жизни и конфиденциальных данных является фундаментальным
                приоритетом платформы CipherTalk. Настоящая Политика определяет порядок сбора,
                обработки, хранения и защиты информации Пользователей.
              </p>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                1. Категории обрабатываемых данных и цели сбора
              </h3>
              <p className="mb-2 text-zinc-300">
                Мы собираем исключительно те данные, без которых технически невозможна
                авторизация и доставка сообщений:
              </p>
              <ul className="list-disc pl-5 mb-4 text-zinc-300 space-y-2 marker:text-emerald-500">
                <li>
                  <strong className="text-white">Регистрационные данные (Supabase Auth):</strong>{' '}
                  Адрес электронной почты и имя пользователя (Username / Nickname) записываются
                  в системную таблицу{' '}
                  <code className="text-emerald-400 text-xs font-mono">profiles</code>.
                  Используются для входа, генерации токенов сессии и поиска контактов через
                  форму SearchUserModal по маске ilike.
                </li>
                <li>
                  <strong className="text-white">Контент сообщений:</strong> Все сообщения
                  передаются по защищенным протоколам и хранятся в зашифрованном виде. Доступ к
                  ним имеют только верифицированные участники конкретной комнаты из таблицы{' '}
                  <code className="text-emerald-400 text-xs font-mono">room_members</code>.
                  Администрация не читает и не анализирует вашу переписку.
                </li>
                <li>
                  <strong className="text-white">Маркеры статусов (Message States):</strong>{' '}
                  Сообщения содержать флаги состояния: sent (записано в БД), delivered
                  (доставлено на устройство) и read (чат открыт получателем). Это необходимо для
                  работы UI-логики отображения галочек.
                </li>
                <li>
                  <strong className="text-white">Медиафайлы и вложения:</strong> Загружаемые
                  аватары профиля (до 2 МБ) или файлы, отправленные через инпут чата,
                  сохраняются в изолированном публичном бакете{' '}
                  <code className="text-emerald-400 text-xs font-mono">chat-attachments</code> в
                  Supabase Storage и отображаются в MessageBubble.tsx по прямым хэшированным
                  ссылкам.
                </li>
              </ul>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                2. Технологии реального времени и эфемерные данные
              </h3>
              <p className="mb-2 text-zinc-300">
                Для создания интерактивного интерфейса CipherTalk использует технологии
                WebSockets и Broadcast-каналы, работающие исключительно в оперативной памяти:
              </p>
              <p className="mb-4 text-zinc-300">
                <strong className="text-white">Индикатор набора текста (Typing Indicator):</strong>{' '}
                При вводе символов клиент отправляет кратковременное событие в Broadcast-канал
                по маске{' '}
                <code className="text-emerald-400 text-xs font-mono">typing-{"{roomId}"}</code>.
                Это событие содержит только ваш userId, транслируется напрямую собеседнику, не
                логируется в базу данных и полностью уничтожается по жесткому 3-секундному
                автотаймауту.
              </p>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                3. Механизмы защиты и передача третьим лицам
              </h3>
              <p className="mb-2 text-zinc-300">
                3.1. Для предотвращения перехвата сессий (атак Session Hijacking) токены сессий
                упаковываются в защищенные куки (HttpOnly, Secure, SameSite), проверяемые на
                уровне Next.js SSR Middleware при каждом переходе.
              </p>
              <p className="mb-2 text-zinc-300">
                3.2. Права доступа к сообщениям жестко разграничены на уровне базы данных через
                политики{' '}
                <strong className="text-emerald-400">Row Level Security (RLS)</strong> в
                Supabase.
              </p>
              <p className="mb-4 text-zinc-300">
                3.3. CipherTalk строго придерживается политики абсолютной конфиденциальности. Мы{' '}
                <strong className="text-white">никогда не продаем, не арендуем и не передаем</strong>{' '}
                данные пользователей коммерческим организациям, третьим лицам или рекламным
                трекерам.
              </p>

              <div className="pt-3 mt-4 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] text-zinc-500">
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
