'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye, Trash2, Globe, ChevronDown } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    id: 'collection',
    icon: <Eye className="w-4 h-4" />,
    title: 'Какие данные мы собираем',
    color: 'emerald',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Мы собираем только минимально необходимые данные для работы сервиса:</p>
        <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
          <li><strong className="text-white">Email</strong> — для авторизации и восстановления доступа</li>
          <li><strong className="text-white">Username</strong> — публичный псевдоним в чатах</li>
          <li><strong className="text-white">Аватар</strong> — опциональное изображение профиля</li>
        </ul>
        <p className="text-xs text-zinc-500 mt-2">Мы НЕ собираем: IP-адреса, геолокацию, метаданные сообщений, историю активности.</p>
      </div>
    ),
  },
  {
    id: 'encryption',
    icon: <Lock className="w-4 h-4" />,
    title: 'Шифрование и безопасность',
    color: 'cyan',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Все сообщения защищены сквозным шифрованием (E2EE).</p>
        <h4 className="text-cyan-400 font-medium mt-4 mb-2">Протоколы</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-cyan-500">
          <li>AES-256-GCM для симметричного шифрования</li>
          <li>XChaCha20-Poly1305 для дополнительной защиты</li>
          <li>ECDH для обмена ключами</li>
        </ul>
        <p className="text-xs text-zinc-500 mt-2">Ключи хранятся только на устройствах пользователей. Мы не имеем доступа к содержимому сообщений.</p>
      </div>
    ),
  },
  {
    id: 'storage',
    icon: <Trash2 className="w-4 h-4" />,
    title: 'Хранение и удаление данных',
    color: 'violet',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Данные хранятся на серверах Supabase с географическим распределением.</p>
        <h4 className="text-violet-400 font-medium mt-4 mb-2">Сроки хранения</h4>
        <ul className="list-disc pl-5 space-y-1 marker:text-violet-500">
          <li>Аккаунт — пока активен пользователь</li>
          <li>Сообщения — 30 дней (опционально)</li>
          <li>Логи — не сохраняются (Zero Logs)</li>
        </ul>
        <p className="text-xs text-zinc-500 mt-2">По запросу пользователя все данные могут быть удалены в течение 72 часов.</p>
      </div>
    ),
  },
  {
    id: 'thirdparty',
    icon: <Globe className="w-4 h-4" />,
    title: 'Сторонние сервисы',
    color: 'emerald',
    content: (
      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>Мы используем минимальный набор внешних сервисов:</p>
        <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
          <li><strong className="text-white">Supabase</strong> — база данных и аутентификация</li>
          <li><strong className="text-white">Vercel</strong> — хостинг фронтенда</li>
          <li><strong className="text-white">Neutralino.js</strong> — десктопная обёртка</li>
        </ul>
        <p className="text-xs text-zinc-500 mt-2">Все сервисы имеют собственные политики конфиденциальности. Мы не передаём ваши данные третьим лицам.</p>
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

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base tracking-wide">
                    Политика конфиденциальности
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all text-sm font-medium"
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