'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white text-base tracking-wide">
                  Правовые документы
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
                Пользовательское соглашение (Terms of Service)
              </h2>
              <p className="text-emerald-400 text-sm font-semibold mb-4">
                Дата вступления в силу: 9 июня 2026 года | Статус: Публичная оферта
              </p>
              <p className="mb-4 text-zinc-300">
                Настоящее Пользовательское соглашение (далее — «Соглашение») представляет собой
                юридически обязывающий договор между Пользователем (далее — «Вы») и администрацией
                программного комплекса CipherTalk (далее — «Администрация»). Используя интерфейс,
                серверную инфраструктуру, базу данных или любые сопутствующие сервисы CipherTalk,
                Вы безоговорочно принимаете условия настоящего Соглашения.
              </p>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                1. Термины и определения
              </h3>
              <p className="mb-2 text-zinc-300">
                • <strong>Программный комплекс CipherTalk</strong> — экосистема, включающая
                клиентское веб-приложение Next.js, серверные сессии, облачную базу данных
                Supabase и каналы связи Broadcast API.
              </p>
              <p className="mb-2 text-zinc-300">
                • <strong>Учетная запись (Аккаунт)</strong> — уникальная совокупность данных
                авторизации (email, хэш пароля) и профиля пользователя (Username, аватар),
                идентифицирующая Пользователя в системе.
              </p>
              <p className="mb-4 text-zinc-300">
                • <strong>Сквозное шифрование (E2EE)</strong> — метод передачи данных, при котором
                доступ к содержимому сообщений имеют только участвующие в диалоге Пользователи.
              </p>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                2. Регистрация и безопасность учетной записи
              </h3>
              <p className="mb-2 text-zinc-300">
                2.1. Для использования CipherTalk требуется регистрация через встроенный модуль
                Supabase Auth. Пользователь обязан предоставить актуальный и контролируемый им
                адрес электронной почты.
              </p>
              <p className="mb-2 text-zinc-300">
                2.2. Пользователь несет персональную ответственность за сохранность своего пароля
                и токенов сессии. Любые действия, совершенные под учетной записью Пользователя,
                считаются совершенными им лично.
              </p>
              <p className="mb-4 text-zinc-300">
                2.3. Платформа предоставляет функционал контроля активных сессий. В случае
                подозрения на несанкционированный доступ, Пользователь обязан использовать
                функцию «Выйти со всех остальных устройств», инициирующую серверный вызов:{' '}
                <code className="bg-zinc-800 text-emerald-400 px-1 rounded text-xs font-mono">
                  supabase.auth.signOut({`{ scope: 'others' }`})
                </code>
                .
              </p>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                3. Правила допустимого использования и ограничения
              </h3>
              <p className="mb-2 text-zinc-300">
                Пользователь обязуется использовать CipherTalk исключительно в законных целях.
                На платформе строго запрещено:
              </p>
              <ul className="list-disc pl-5 mb-4 text-zinc-300 space-y-1 marker:text-emerald-500">
                <li>
                  Использование мессенджера для координации незаконных действий, мошенничества,
                  распространения вредоносного ПО или нарушения прав третьих лиц.
                </li>
                <li>
                  Использование скриптов, ботов или парсеров для массового создания комнат,
                  рассылки спама или автоматического сбора уникальных идентификаторов (Username)
                  из таблицы <code className="text-emerald-400 text-xs font-mono">profiles</code> (скрейпинг).
                </li>
                <li>
                  Любые попытки дестабилизировать работу серверов, обойти ограничения безопасности
                  Middleware, совершить DoS/DDoS-атаки или нарушить целостность облачной базы
                  данных Supabase.
                </li>
                <li>
                  Имитация личности (фишинг) и регистрация никнеймов, дублирующих имена
                  Администрации или известных лиц, с целью введения в заблуждение других
                  участников сети.
                </li>
              </ul>

              <h3 className="text-emerald-400 font-medium mt-4 mb-2">
                4. Права Администрации и ограничение ответственности
              </h3>
              <p className="mb-2 text-zinc-300">
                4.1. Администрация имеет право приостанавливать доступ к аккаунту в случае
                фиксации со стороны серверов Supabase признаков вредоносной активности или
                DDoS-атак.
              </p>
              <p className="mb-4 text-zinc-300">
                4.2. Программное обеспечение предоставляется по стандарту{' '}
                <strong className="text-emerald-400">AS IS</strong> («как есть»). Администрация
                не гарантирует, что сервис будет функционировать абсолютно бесперебойно во всех
                точках мира, и не несет ответственности за сбои на стороне дата-центров Supabase,
                хостинга Vercel или магистральных провайдеров.
              </p>

              <div className="pt-3 mt-4 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] text-zinc-500">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>CipherTalk © 2026 — защищённый E2EE мессенджер</span>
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
