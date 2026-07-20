'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, ChevronDown, ScrollText, Ban, Gavel, Sparkles } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    id: 'terms',
    icon: <ScrollText className="w-4 h-4" />,
    title: 'Пользовательское соглашение',
    color: 'emerald',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Дата вступления в силу: 9 июня 2026 года | Статус: Публичная оферта</p>
        <p>Настоящее Пользовательское соглашение представляет собой юридически обязывающий договор между Пользователем и администрацией CipherTalk.</p>
        <h4 className="text-emerald-400 font-medium mt-4 mb-2">1. Термины и определения</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
          <li><strong className="text-white">CipherTalk</strong> — экосистема: Next.js клиент, Supabase, Broadcast API.</li>
          <li><strong className="text-white">Аккаунт</strong> — уникальная совокупность данных авторизации и профиля.</li>
          <li><strong className="text-white">E2EE</strong> — сквозное шифрование, доступное только участникам диалога.</li>
        </ul>
        <h4 className="text-emerald-400 font-medium mt-4 mb-2">2. Регистрация и безопасность</h4>
        <p>Пользователь обязан предоставить актуальный email. Пароль хранится в хэшированном виде. Пользователь несёт ответственность за сохранность своих данных.</p>
        <h4 className="text-emerald-400 font-medium mt-4 mb-2">3. Правила использования</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
          <li>Запрещено использование для незаконных действий.</li>
          <li>Запрещён скрейпинг и парсинг данных.</li>
          <li>Запрещены DoS/DDoS-атаки.</li>
          <li>Запрещена имитация личности (фишинг).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'privacy',
    icon: <Shield className="w-4 h-4" />,
    title: 'Политика конфиденциальности',
    color: 'cyan',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Мы собираем минимально необходимые данные для работы сервиса.</p>
        <h4 className="text-cyan-400 font-medium mt-4 mb-2">Собираемые данные</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-cyan-500">
          <li>Email адрес (для авторизации)</li>
          <li>Username (публичный псевдоним)</li>
          <li>Аватар (опционально)</li>
        </ul>
        <h4 className="text-cyan-400 font-medium mt-4 mb-2">Защита данных</h4>
        <p>Все сообщения защищены E2EE. Мы не имеем доступа к содержимому чатов. Логи не сохраняются.</p>
      </div>
    ),
  },
  {
    id: 'security',
    icon: <Ban className="w-4 h-4" />,
    title: 'Безопасность',
    color: 'violet',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>CipherTalk использует современные криптографические протоколы для защиты ваших данных.</p>
        <h4 className="text-violet-400 font-medium mt-4 mb-2">Шифрование</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-violet-500">
          <li>AES-256 + XChaCha20-Poly1305</li>
          <li>Сквозное шифрование (E2EE)</li>
          <li>Zero-knowledge архитектура</li>
        </ul>
        <h4 className="text-violet-400 font-medium mt-4 mb-2">Сессии</h4>
        <p>Вы можете просматривать активные сессии и завершать их удалённо.</p>
      </div>
    ),
  },
  {
    id: 'rights',
    icon: <Gavel className="w-4 h-4" />,
    title: 'Права и обязанности',
    color: 'emerald',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Администрация имеет право приостанавливать доступ при нарушении правил. Сервис предоставляется "как есть" (AS IS).</p>
        <h4 className="text-emerald-400 font-medium mt-4 mb-2">Ваши права</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
          <li>Запросить удаление аккаунта</li>
          <li>Экспортировать свои данные</li>
          <li>Отозвать согласие на обработку</li>
        </ul>
      </div>
    ),
  },
];

function AccordionItem({ section, isOpen, onClick }: { section: typeof sections[0]; isOpen: boolean; onClick: () => void }) {
  const colorClasses = {
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    violet: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
  };

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden mb-3 last:mb-0">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-300 ${colorClasses[section.color as keyof typeof colorClasses]}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            {section.icon}
          </div>
          <span className="font-medium text-sm">{section.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.01]">
              {section.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOpenSection(null);
    }
  }, [isOpen]);

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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0a0f17]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base tracking-wide">
                    Правовые документы
                  </h3>
                  <p className="text-[10px] text-zinc-500">Последнее обновление: 9 июня 2026</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
                title="Закрыть"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Accordion */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {sections.map((section) => (
                <AccordionItem
                  key={section.id}
                  section={section}
                  isOpen={openSection === section.id}
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] flex-shrink-0 bg-black/20">
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