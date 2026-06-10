'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield, ArrowRight, Download, Lock, Globe, Monitor, Smartphone,
  Languages, Check, ChevronDown,
  MonitorDot, Layout, HardDrive, ScanSearch,
  Terminal, ShieldCheck, ChevronRight
} from 'lucide-react';

/** Custom Windows icon (lucide-react doesn't include platform icons) */
function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12.5h8.5V21l-8.5-1.2V12.5zm0-1h8.5V3l-8.5 1.2v7.3zM12.5 3v8.5H21V3.8L12.5 3zm0 9.5V21l8.5-1.2V12.5h-8.5z" />
    </svg>
  );
}

/** Custom Apple icon (lucide-react doesn't include platform icons) */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

/* ═══════════════════════════════════════════════════════════════
   FADE-IN SECTION WRAPPER — reusable animated container
   ═══════════════════════════════════════════════════════════════ */
function FadeSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION HEADER — consistent heading across sections
   ═══════════════════════════════════════════════════════════════ */
function SectionHeader({ badge, title, description }: { badge: string; title: string; description: string }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 mb-4">
        {badge}
      </span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{title}</h2>
      <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. HERO SECTION
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-400/[0.05] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,245,181,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,245,181,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 mb-6">
                <Shield className="w-3 h-3" />
                E2EE End-to-End Encryption
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Шифрование нового{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                поколения
              </span>
              . Доступно каждому.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Безопасный мессенджер с сквозным шифрованием.{' '}
              <span className="text-zinc-300">Веб, Windows, macOS, Linux</span> — одна платформа, полная приватность.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,245,181,0.4)] hover:shadow-[0_0_40px_rgba(16,245,181,0.6)]"
              >
                <Download className="w-4 h-4" />
                Скачать .EXE для Windows
              </a>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                Открыть в браузере
              </Link>
            </motion.div>

            {/* Platform badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
            >
              {[
                { icon: <Globe className="w-3.5 h-3.5" />, label: 'Web' },
                { icon: <WindowsIcon className="w-3.5 h-3.5" />, label: 'Windows' },
                { icon: <AppleIcon className="w-3.5 h-3.5" />, label: 'macOS' },
                { icon: <Terminal className="w-3.5 h-3.5" />, label: 'Linux' },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                  {p.icon}
                  {p.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Messenger mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto lg:mx-0 w-full max-w-md"
          >
            {/* Glow behind */}
            <div className="absolute -inset-8 bg-emerald-500/[0.06] blur-3xl rounded-full" />

            {/* Messenger card */}
            <div
              className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
              style={{
                background: 'linear-gradient(180deg, rgba(12,18,26,0.95) 0%, rgba(6,10,16,0.98) 100%)',
                boxShadow: '0 -12px 60px rgba(0,0,0,0.5), 0 0 60px rgba(16,245,181,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] text-zinc-500 font-medium tracking-wider">CIPHER TALK</span>
                </div>
              </div>

              {/* Sidebar + Chat mockup */}
              <div className="flex h-[320px] sm:h-[360px]">
                {/* Sidebar */}
                <div className="w-20 sm:w-24 border-r border-white/[0.06] p-2 space-y-2 hidden sm:block">
                  {['Алексей', 'Мария', 'Дмитрий'].map((name, i) => (
                    <div
                      key={name}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        i === 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center flex-shrink-0 ring-1 ring-emerald-500/25">
                        <span className="text-[10px] font-bold text-emerald-300">{name[0]}</span>
                      </div>
                      <div className="hidden lg:block min-w-0">
                        <p className="text-[10px] text-zinc-200 truncate font-medium">{name}</p>
                        <p className="text-[8px] text-zinc-500 truncate">E2EE</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col">
                  {/* Chat header */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-300">A</span>
                    </div>
                    <div>
                      <p className="text-[11px] text-white font-medium">Алексей</p>
                      <p className="text-[9px] text-emerald-400/80">Online</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-[8px] text-emerald-400 font-medium">E2EE</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-3 space-y-2 overflow-hidden">
                    {/* Other message */}
                    <div className="flex justify-start">
                      <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-3 py-2 max-w-[75%]">
                        <p className="text-[11px] text-zinc-100">Привет! Как дела? 👋</p>
                        <p className="text-[8px] text-zinc-500 mt-1 text-right">14:32</p>
                      </div>
                    </div>
                    {/* My message */}
                    <div className="flex justify-end">
                      <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl rounded-br-md px-3 py-2 max-w-[75%]">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Lock className="w-2 h-2 text-emerald-400/70" />
                          <span className="text-[7px] uppercase tracking-widest text-emerald-400/70 font-medium">E2EE</span>
                        </div>
                        <p className="text-[11px] text-emerald-50">Отлично! Только что обновил приложение 🚀</p>
                        <p className="text-[8px] text-zinc-500 mt-1 text-right">14:33 ✓✓</p>
                      </div>
                    </div>
                    {/* Typing indicator */}
                    <div className="flex justify-start">
                      <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-3 py-2.5 flex items-center gap-1">
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="px-3 pb-3">
                    <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-zinc-700/50" style={{ background: 'rgba(39,39,42,0.4)' }}>
                      <Lock className="w-3 h-3 text-zinc-500" />
                      <div className="flex-1 h-5 rounded-md bg-white/[0.03]" />
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. ARCHITECTURE — «Под капотом»
   ═══════════════════════════════════════════════════════════════ */
function ArchitectureSection() {
  const cards = [
    {
      icon: <ScanSearch className="w-5 h-5" />,
      title: 'Умный поиск контактов',
      description: 'Хук useDebounce с задержкой 300мс предотвращает запрос к Supabase на каждый символ. Результаты кешируются, а cancellation token защищает от гонки запросов при быстром вводе.',
      details: ['Debounce 300ms', 'Request cancellation', 'Client-side ranking', 'Optimistic UI'],
      gradient: 'from-emerald-500/10 to-cyan-500/5',
      borderColor: 'border-emerald-500/15',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: <MonitorDot className="w-5 h-5" />,
      title: 'Мгновенный статус',
      description: 'Realtime-каналы Supabase для отслеживания Online/Offline статуса с автоматическим отписыванием (unsubscribe) при размонтировании компонента. Экономия батареи на мобильных.',
      details: ['Supabase Realtime', 'Auto-cleanup', 'Presence tracking', 'Battery-efficient'],
      gradient: 'from-violet-500/10 to-cyan-500/5',
      borderColor: 'border-violet-500/15',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: 'Интерфейс без задержек',
      description: 'Skeleton Loaders мгновенно показывают структуру контента вместо блокирующих спиннеров. Optimistic UI обновляет сообщения до подтверждения сервера.',
      details: ['Skeleton Loaders', 'Optimistic updates', 'Smooth transitions', 'No layout shift'],
      gradient: 'from-amber-500/10 to-orange-500/5',
      borderColor: 'border-amber-500/15',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <section id="architecture" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Под капотом"
            title="Техническая архитектура"
            description="Каждая деталь оптимизирована для мгновенного отклика и минимального потребления ресурсов."
          />
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, i) => (
            <FadeSection key={card.title} delay={i * 0.1}>
              <div
                className={`group relative rounded-2xl p-6 md:p-7 border ${card.borderColor} bg-gradient-to-br ${card.gradient} backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 h-full`}
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 ring-1 ring-white/[0.08]`}>
                  <span className={card.iconColor}>{card.icon}</span>
                </div>

                <h3 className="text-white font-semibold text-base mb-2">{card.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{card.description}</p>

                {/* Detail pills */}
                <div className="flex flex-wrap gap-1.5">
                  {card.details.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.06]"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      {d}
                    </span>
                  ))}
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-emerald-500/[0.03] to-transparent" />
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. MOBILE & DESKTOP FEATURES
   ═══════════════════════════════════════════════════════════════ */
function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Адаптивность"
            title="Мобильные и десктопные функции"
            description="Интерфейс, созданный для максимального удобства на любом устройстве."
          />
        </FadeSection>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mobile Features */}
          <FadeSection delay={0}>
            <div
              className="relative rounded-2xl p-6 md:p-8 border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.04] to-cyan-500/[0.02] h-full"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Мобильный опыт</h3>
              </div>

              <div className="space-y-4">
                {/* BottomNavBar */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Layout className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Bottom Navigation Bar</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Три таба внизу экрана — Чаты, Поиск, Настроки. Анимированный индикатор активного таба, badge непрочитанных сообщений. Все в пределах досягаемости большого пальца.
                    </p>
                  </div>
                </div>

                {/* Drawers */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Выдвижные шторки (Drawers)</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Настройки профиля, поиск контактов и сессии открываются снизу с drag-handle. Удобно управлять одной рукой на экране любого размера.
                    </p>
                  </div>
                </div>

                {/* Safe area */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Safe Area & Gesture Support</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Учёт safe-area-inset для вырезов и жестов iOS/Android. Pull-to-refresh, swipe-back навигация, haptic feedback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile mockup */}
              <div className="mt-6 flex justify-center">
                <div
                  className="w-48 h-[200px] rounded-2xl border border-white/[0.1] overflow-hidden relative"
                  style={{ background: 'linear-gradient(180deg, rgba(12,18,26,0.95) 0%, rgba(6,10,16,0.98) 100%)' }}
                >
                  {/* Mini sidebar */}
                  <div className="p-2 space-y-1.5">
                    {['Алексей', 'Мария'].map((n, i) => (
                      <div key={n} className={`flex items-center gap-1.5 p-1.5 rounded-md ${i === 0 ? 'bg-emerald-500/10' : ''}`}>
                        <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-[8px] text-emerald-300 font-bold">{n[0]}</span>
                        </div>
                        <span className="text-[9px] text-zinc-200 truncate">{n}</span>
                      </div>
                    ))}
                  </div>
                  {/* Bottom nav */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-2 border-t border-white/[0.06]" style={{ background: 'rgba(5,7,13,0.95)' }}>
                    {['💬', '🔍', '⚙️'].map((emoji, i) => (
                      <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {i === 0 && <div className="w-4 h-0.5 rounded-full bg-emerald-400 -mt-1 mb-0.5" />}
                        <span className="text-[10px]">{emoji}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>

          {/* Desktop Features */}
          <FadeSection delay={0.1}>
            <div
              className="relative rounded-2xl p-6 md:p-8 border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.04] to-violet-500/[0.02] h-full"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/20">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Десктопный опыт</h3>
              </div>

              <div className="space-y-4">
                {/* Sidebar */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Layout className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Боковой сайдбар</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Полноценный сайдбар со списком чатов, профилем пользователя, статусом Online/Offline и иконкой настроек. Анимированный индикатор активного чата.
                    </p>
                  </div>
                </div>

                {/* Keyboard */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Горячие клавиши</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Enter — отправить, Shift+Enter — новая строка, Escape — закрыть модалки. Полная клавиатурная навигация для продвинутых пользователей.
                    </p>
                  </div>
                </div>

                {/* Desktop app */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Нативное .EXE приложение</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Electron-based десктопное приложение с CSP-политикой, sandboxing и context isolation. Устанавливается на Windows, macOS и Linux.
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop mockup */}
              <div className="mt-6 flex justify-center">
                <div
                  className="w-full max-w-[280px] h-[180px] rounded-xl border border-white/[0.1] overflow-hidden"
                  style={{ background: 'linear-gradient(180deg, rgba(12,18,26,0.95) 0%, rgba(6,10,16,0.98) 100%)' }}
                >
                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/[0.06]">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    <span className="text-[8px] text-zinc-500 ml-2 tracking-wider">CIPHER TALK</span>
                  </div>
                  <div className="flex h-[calc(100%-24px)]">
                    {/* Mini sidebar */}
                    <div className="w-14 border-r border-white/[0.06] p-1.5 space-y-1">
                      {['A', 'M', 'Д'].map((l, i) => (
                        <div key={l} className={`w-full aspect-square rounded-md flex items-center justify-center ${i === 0 ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.03]'}`}>
                          <span className="text-[9px] text-zinc-300 font-bold">{l}</span>
                        </div>
                      ))}
                    </div>
                    {/* Chat area */}
                    <div className="flex-1 p-2 space-y-1.5">
                      <div className="w-16 h-2 rounded bg-zinc-700/50" />
                      <div className="w-20 h-2 rounded bg-emerald-500/20 ml-auto" />
                      <div className="w-14 h-2 rounded bg-zinc-700/50" />
                      <div className="w-24 h-2 rounded bg-emerald-500/20 ml-auto" />
                      <div className="w-12 h-2 rounded bg-zinc-700/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. LOCALIZATION
   ═══════════════════════════════════════════════════════════════ */
function LocalizationSection() {
  return (
    <section id="localization" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Глобализация"
            title="Полная поддержка мультиязычности"
            description="Весь интерфейс переведен на русский и английский языки — от авторизации до системных уведомлений."
          />
        </FadeSection>

        <FadeSection>
          <div className="max-w-4xl mx-auto">
            <div
              className="relative rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.04] to-violet-500/[0.02] overflow-hidden"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              <div className="grid md:grid-cols-2">
                {/* Left — description */}
                <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                      <Languages className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">i18n система</h3>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Централизованный словарь с типизированными ключами. Все строки интерфейса проходят через функцию <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs font-mono">t('key')</code> — нулевой хардкод, мгновенное переключение языка.
                  </p>

                  <div className="space-y-3">
                    {[
                      'Авторизация (Login / Register)',
                      'Чат и сообщения',
                      'Настройки профиля и безопасности',
                      'Системные уведомления и ошибки',
                      'Типы устройств и сессии',
                      'Статусы Online / Offline / Away',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — code example */}
                <div className="p-6 md:p-8">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-semibold">Пример из i18n.ts</p>
                  <div className="rounded-xl bg-[#0a0f17] border border-white/[0.06] p-4 overflow-x-auto">
                    <pre className="text-[11px] leading-relaxed font-mono">
                      <span className="text-zinc-500">{'// Русский'}</span>{'\n'}
                      <span className="text-zinc-300">{'\u2019ru\u2019'}</span>
                      <span className="text-zinc-500">: {'{'}</span>{'\n'}
                      <span className="text-emerald-400">{'  auth.login_title'}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-amber-300">{'\u2018Вход в Cipher Talk\u2019'}</span>
                      <span className="text-zinc-500">,</span>{'\n'}
                      <span className="text-emerald-400">{'  chat.no_messages'}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-amber-300">{'\u2018Нет сообщений\u2019'}</span>
                      <span className="text-zinc-500">,</span>{'\n'}
                      <span className="text-emerald-400">{'  search.title'}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-amber-300">{'\u2018Новый чат\u2019'}</span>
                      <span className="text-zinc-500">,</span>{'\n'}
                      <span className="text-zinc-500">{'}\n'}</span>
                      <span className="text-zinc-500">{'// English'}</span>{'\n'}
                      <span className="text-zinc-300">{'\u2019en\u2019'}</span>
                      <span className="text-zinc-500">: {'{'}</span>{'\n'}
                      <span className="text-emerald-400">{'  auth.login_title'}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-amber-300">{'\u2018Sign in to Cipher Talk\u2019'}</span>
                      <span className="text-zinc-500">,</span>{'\n'}
                      <span className="text-emerald-400">{'  chat.no_messages'}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-amber-300">{'\u2018No messages\u2019'}</span>
                      <span className="text-zinc-500">,</span>{'\n'}
                      <span className="text-emerald-400">{'  search.title'}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-amber-300">{'\u2018New chat\u2019'}</span>
                      <span className="text-zinc-500">,</span>{'\n'}
                      <span className="text-zinc-500">{'}'}</span>
                    </pre>
                  </div>

                  {/* Language switcher demo */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-base">🇷🇺</span>
                      <span className="text-xs text-emerald-400 font-medium">Русский</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-base">🇺🇸</span>
                      <span className="text-xs text-zinc-400 font-medium">English</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. DOWNLOAD CENTER
   ═══════════════════════════════════════════════════════════════ */
function DownloadSection() {
  const platforms = [
    {
      icon: <WindowsIcon className="w-6 h-6" />,
      name: 'Windows',
      format: '.exe / .msi',
      description: 'NSIS-установщик или портативная версия. Windows 10/11 x64.',
      button: 'Скачать для Windows',
      primary: true,
    },
    {
      icon: <AppleIcon className="w-6 h-6" />,
      name: 'macOS',
      format: '.dmg',
      description: 'Universal Binary для Intel и Apple Silicon. macOS 12+.',
      button: 'Скачать для macOS',
      primary: false,
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      name: 'Linux',
      format: '.AppImage / .deb',
      description: 'AppImage без установки или .deb пакет для Ubuntu/Debian.',
      button: 'Скачать для Linux',
      primary: false,
    },
  ];

  return (
    <section id="download" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Скачать"
            title="CipherTalk для вашей платформы"
            description="Бесплатное десктопное приложение с полной поддержкой E2EE шифрования и всех функций веб-версии."
          />
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {platforms.map((p, i) => (
            <FadeSection key={p.name} delay={i * 0.1}>
              <div
                className={`group relative rounded-2xl p-6 border transition-all duration-300 h-full flex flex-col ${
                  p.primary
                    ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] to-cyan-500/[0.03]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20'
                }`}
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    p.primary ? 'bg-emerald-500/15 ring-1 ring-emerald-500/30' : 'bg-white/[0.05] ring-1 ring-white/[0.08]'
                  }`}>
                    <span className={p.primary ? 'text-emerald-400' : 'text-zinc-400'}>{p.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{p.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">{p.format}</p>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed mb-5 flex-1">{p.description}</p>

                <a
                  href="#"
                  className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    p.primary
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,245,181,0.2)]'
                      : 'border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  {p.button}
                </a>
              </div>
            </FadeSection>
          ))}
        </div>

        {/* Security notice */}
        <FadeSection delay={0.3}>
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-zinc-400">
                Сборка изолирована через <span className="text-zinc-300 font-medium">Electron Sandbox</span> и защищена политиками <span className="text-zinc-300 font-medium">CSP</span>.
                Context Isolation, отключение Node.js в renderer, запрет навигации.
              </p>
            </div>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-sm">
              Cipher<span className="text-emerald-400">Talk</span>
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            &copy; 2025 CipherTalk. Secure messaging with end-to-end encryption.
          </p>

          <div className="flex gap-5 text-xs text-zinc-500">
            <button onClick={() => document.querySelector('#architecture')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-400 transition-colors">
              Архитектура
            </button>
            <button onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-400 transition-colors">
              Функции
            </button>
            <Link href="/chat" className="hover:text-emerald-400 transition-colors">
              Мессенджер
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen bg-[#05070d]">
        <HeroSection />
        <ArchitectureSection />
        <FeaturesSection />
        <LocalizationSection />
        <DownloadSection />
        <Footer />
      </main>
    </>
  );
}