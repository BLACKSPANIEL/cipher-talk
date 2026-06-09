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
            <div className="flex-1 overflow-y-auto px-6 py-5 text-zinc-300 text-sm leading-relaxed space-y-4 scrollbar-thin">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Пользовательское соглашение (Terms of Service)
              </h2>
              <p>
                <strong className="text-emerald-400">Дата вступления в силу: 9 июня 2026 года</strong>
              </p>
              <p>
                Настоящее Соглашение представляет собой юридически обязывающий договор между
                Пользователем и администрацией CipherTalk. Используя мессенджер, вы безоговорочно
                принимаете эти условия.
              </p>

              <h3 className="text-base font-semibold text-white pt-2">
                1. Регистрация и безопасность аккаунта
              </h3>
              <p>
                Для использования CipherTalk требуется регистрация через встроенный модуль
                Supabase Auth. Пользователь обязан предоставить актуальный email и несет
                персональную ответственность за сохранность своего пароля. Любые действия,
                совершенные под вашей учетной записью, считаются совершенными вами лично.
              </p>
              <p>
                Платформа поддерживает мультисессионность. В случае подозрения на взлом вы
                обязаны использовать функцию «Выйти со всех остальных устройств», вызывающую
                метод <code className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-emerald-300 text-xs font-mono">supabase.auth.signOut({`{ scope: 'others' }`})</code>.
              </p>

              <h3 className="text-base font-semibold text-white pt-2">
                2. Правила допустимого использования
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-emerald-500">
                <li>Запрещена любая незаконная, мошенническая или вредоносная деятельность.</li>
                <li>
                  Запрещен автоматизированный сбор данных, спам или скрейпинг уникальных
                  Username из таблицы <code className="text-emerald-300 font-mono text-xs">profiles</code>.
                </li>
                <li>
                  Строго запрещены атаки типа DoS/DDoS, попытки обойти ограничения Middleware
                  или нарушить работу базы данных Supabase.
                </li>
                <li>
                  Запрещена имитация личности (фишинг) и регистрация никнеймов, дублирующих
                  имена Администрации.
                </li>
              </ul>

              <h3 className="text-base font-semibold text-white pt-2">
                3. Ограничение ответственности
              </h3>
              <p>
                Программное обеспечение предоставляется по стандарту{' '}
                <strong className="text-emerald-400">AS IS</strong> («как есть»). Администрация
                не гарантирует 100% бесперебойность и не несет ответственности за сбои,
                вызванные неполадками на стороне дата-центров Supabase, хостинга Vercel или
                магистральных провайдеров.
              </p>

              <div className="pt-3 mt-2 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] text-zinc-500">
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
