'use client';

import { motion } from 'framer-motion';
import { Lock, Shield, CheckCircle, Sparkles, Brain, Crown, Rocket } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

// Общий класс hover-интерактивности для всех карточек Bento Grid
const cardHover =
  'hover:scale-[1.02] hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-950/20';

export function InfoCards() {
  return (
    <section id="how-it-works" className="relative py-24 border-t border-neon-green/10">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-neon-green/3 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Возможности платформы</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Всё, что нужно для{' '}
              <span className="text-neon-green">приватного общения</span>
            </h2>
            <p className="text-gray-400">
              Bento Grid из шести ключевых блоков: безопасность, ИИ-ассистент и два уровня подписки
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {/* Row 1, Col 1-2: Безопасность высшего уровня (большая карточка) */}
            <motion.div
              variants={fadeInUp}
              className={`md:col-span-2 group relative overflow-hidden rounded-2xl border border-neon-green/20 bg-surface-dark/50 backdrop-blur ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Безопасность высшего уровня
                  </h3>
                </div>

                {/* Исправленный список с emerald-иконками Shield вместо точек */}
                <ul className="space-y-3 text-zinc-300 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Протоколы сквозного шифрования (E2EE)</strong> —
                      данные кодируются на клиенте и недоступны провайдеру.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Полная изоляция комнат</strong> — доступ к
                      веткам сообщений разграничен на уровне политик Supabase RLS.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Защита от сессионного фишинга</strong> —
                      авторизация через HttpOnly Cookies на уровне Next.js Middleware.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>

            {/* Row 1, Col 3: Реального времени анализа (ИИ) */}
            <motion.div
              variants={fadeInUp}
              className={`group relative overflow-hidden rounded-2xl border border-neon-green/20 bg-surface-dark/50 backdrop-blur ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 md:p-8 space-y-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Реального времени анализ
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  <strong className="text-white">Контекстный анализатор</strong> — нейросеть
                  локально группирует важные тезисы из пропущенных диалогов, экономя ваше время.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-cyan-300/80">
                  <Sparkles className="w-3 h-3" />
                  AI Engine
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>

            {/* Row 2, Col 1: Персонализированные саммери (ИИ) */}
            <motion.div
              variants={fadeInUp}
              className={`group relative overflow-hidden rounded-2xl border border-neon-green/20 bg-surface-dark/50 backdrop-blur ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 md:p-8 space-y-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  Персонализированные саммери
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  <strong className="text-white">Умные выжимки</strong> — генерация краткого
                  содержания длинных тредов и зашифрованных комнат в один клик.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-300/80">
                  <CheckCircle className="w-3 h-3" />
                  One-click summary
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>

            {/* Row 2, Col 2-3: Cipher Premium (большая карточка тарифа) */}
            <motion.div
              variants={fadeInUp}
              className={`md:col-span-2 group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 backdrop-blur ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Crown className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Cipher Premium
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Расширенные возможности для приватного общения
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-300">PRO</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-zinc-300 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Кастомные анимированные аватары</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Увеличенный лимит файлов в облаке до 50 МБ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Таймер мгновенного сгорания сообщений (3 секунды)
                    </span>
                  </li>
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>

            {/* Row 3, Col 1-2: Cipher Tier (большая карточка тарифа) */}
            <motion.div
              variants={fadeInUp}
              className={`md:col-span-2 group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-zinc-900/40 backdrop-blur ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Crown className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        Cipher Tier
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Максимальный уровень контроля и кастомизации
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-amber-300">ELITE</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-zinc-300 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Выделенный Broadcast-канал связи</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Локальное резервное копирование ключей</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Ранний доступ к экспериментальным ИИ-функциям</span>
                  </li>
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>

            {/* Row 3, Col 3: Дополнительная карточка-акцент */}
            <motion.div
              variants={fadeInUp}
              className={`group relative overflow-hidden rounded-2xl border border-neon-green/20 bg-gradient-to-br from-neon-green/10 via-emerald-500/5 to-zinc-900/40 backdrop-blur ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/15 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 md:p-8 space-y-5 flex flex-col h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neon-green/15 border border-neon-green/30 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors">
                  Готов начать?
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Создайте аккаунт за 30 секунд и получите доступ ко всем функциям CipherTalk
                  бесплатно.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-green/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
