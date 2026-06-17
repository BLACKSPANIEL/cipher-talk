'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowRight, Download, Lock, Globe, Monitor, Smartphone,
  Languages, Check, ChevronDown, ChevronUp, MessageSquare, Bell,
  Users, Fingerprint, Trash2, Sparkles, Zap, Server, Eye,
  ChevronRight, Github, Star, Command, Quote, X, Menu
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

/* ═══════════════════════════════════════════════════════════════════════════════
   UTILITY: Detect Neutralino runtime
   ═══════════════════════════════════════════════════════════════════════════════ */
function isDesktopApp(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).__NL__ || !!(window as any).__TAURI_INTERNALS__;
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12.5h8.5V21l-8.5-1.2V12.5zm0-1h8.5V3l-8.5 1.2v7.3zM12.5 3v8.5H21V3.8L12.5 3zm0 9.5V21l8.5-1.2V12.5h-8.5z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

function FadeSection({ children, className = '', delay = 0 }: {
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

function SectionHeader({
  badge, title, description,
}: { badge: string; title: string; description: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 mb-4"
      >
        <Sparkles className="w-3 h-3" />
        {badge}
      </motion.span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight leading-[1.15]">
        {title}
      </h2>
      <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════════════════════════════════ */

function TypewriterText({ texts, className = '' }: { texts: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayed === current) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    } else {
      const speed = isDeleting ? 30 : 60;
      timer = setTimeout(() => {
        setDisplayed(isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index, texts]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-0.5 h-[1em] bg-emerald-400 ml-0.5 animate-pulse align-middle" />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1. HERO SECTION (DESKTOP-OPTIMIZED)
   ═══════════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  const isDesktop = isDesktopApp();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-12 overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary neon glow */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full bg-emerald-400/[0.06] blur-[150px]" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-cyan-400/[0.04] blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/[0.03] blur-[100px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,245,181,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,245,181,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Radial edge fading */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05070d]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* ── Left: Text ── */}
          <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 mb-5">
                <Shield className="w-3 h-3" />
                E2EE <span className="text-zinc-500 mx-1">·</span> Zero Logs <span className="text-zinc-500 mx-1">·</span> Open Source
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {isDesktop ? (
                <>Добро пожаловать в Cipher Talk</>
              ) : (
                <>
                  Приватный{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    мессенджер
                  </span>
                </>
              )}
            </motion.h1>

            {!isDesktop && (
              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white/80 leading-[1.15] tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                с{' '}
                <TypewriterText
                  texts={['E2EE шифрованием', 'disappearing messages', 'нулевой политикой логов', 'открытым исходным кодом']}
                  className="text-emerald-400"
                />
              </motion.h2>
            )}

            {isDesktop && (
              <motion.h2
                className="text-xl sm:text-2xl font-bold text-emerald-400 leading-[1.3] mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Это нативное desktop-приложение. Без Electron. Без компромиссов. 🚀
              </motion.h2>
            )}

            <motion.p
              className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isDesktop
                ? 'Всё работает локально. Сообщения защищены сквозным шифрованием. Никаких логов, никакого доступа к вашим данным. Только приватность.'
                : 'Безопасный мессенджер с сквозным шифрованием. Работает везде — в браузере, на Windows, macOS и Linux. Одна платформа, полная приватность.'}
            </motion.p>

            {/* ── CTA buttons ── */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isDesktop ? (
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,245,181,0.35)] hover:shadow-[0_0_50px_rgba(16,245,181,0.5)] active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Открыть чат
                </Link>
              ) : (
                <>
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,245,181,0.35)] hover:shadow-[0_0_50px_rgba(16,245,181,0.5)] active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Открыть веб-версию
                  </Link>
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    Скачать .exe
                  </a>
                </>
              )}
            </motion.div>

            {/* ── Trust indicators ── */}
            <motion.div
              className="flex flex-wrap items-center gap-5 mt-8 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.12em]">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-500/50" />
                E2EE
              </div>
              <div className="w-px h-4 bg-zinc-700/50" />
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.12em]">
                <Trash2 className="w-3.5 h-3.5 text-emerald-500/50" />
                Disappear
              </div>
              <div className="w-px h-4 bg-zinc-700/50" />
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.12em]">
                <Eye className="w-3.5 h-3.5 text-emerald-500/50" />
                Zero Logs
              </div>
              <div className="w-px h-4 bg-zinc-700/50" />
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.12em]">
                <Github className="w-3.5 h-3.5 text-emerald-500/50" />
                Open Source
              </div>
            </motion.div>

            {/* ── Platform badges ── */}
            {!isDesktop && (
              <motion.div
                className="flex items-center gap-4 mt-6 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                {[
                  { icon: <Globe className="w-3.5 h-3.5" />, label: 'Web' },
                  { icon: <WindowsIcon className="w-3.5 h-3.5" />, label: 'Windows' },
                  { icon: <AppleIcon className="w-3.5 h-3.5" />, label: 'macOS' },
                  { icon: <Command className="w-3.5 h-3.5" />, label: 'Linux' },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                    {p.icon}
                    {p.label}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Right: App Mockup ── */}
          <motion.div
            className="flex-1 max-w-lg mx-auto lg:mx-0 w-full"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-10 bg-emerald-500/[0.05] blur-3xl rounded-full" />

              {/* Mac-style Window Mockup */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
                style={{
                  background: 'linear-gradient(180deg, rgba(14,20,28,0.95) 0%, rgba(8,12,18,0.98) 100%)',
                  boxShadow:
                    '0 -12px 60px rgba(0,0,0,0.5), 0 0 80px rgba(16,245,181,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* ── Title bar with traffic lights ── */}
                <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-zinc-400 font-medium tracking-wider">CIPHER TALK</span>
                    </div>
                  </div>
                  <div className="w-16" />
                </div>

                {/* ── Content: Sidebar + Chat ── */}
                <div className="flex" style={{ height: '380px' }}>
                  {/* Sidebar */}
                  <div className="w-24 border-r border-white/[0.06] p-2 space-y-2.5">
                    {/* Search */}
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-[9px] text-zinc-500">Поиск</span>
                    </div>

                    {[
                      { name: 'Алексей', initial: 'A', status: 'online', active: true },
                      { name: 'Мария', initial: 'M', status: 'online', active: false },
                      { name: 'Дмитрий', initial: 'Д', status: 'away', active: false },
                      { name: 'Елена', initial: 'Е', status: 'offline', active: false },
                    ].map((user) => (
                      <div
                        key={user.name}
                        className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                          user.active
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            user.active
                              ? 'bg-gradient-to-br from-emerald-500/25 to-cyan-500/10 ring-1 ring-emerald-500/25'
                              : 'bg-white/[0.05] ring-1 ring-white/[0.08]'
                          }`}>
                            <span className="text-xs font-bold text-zinc-300">{user.initial}</span>
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0e141c] ${
                            user.status === 'online' ? 'bg-emerald-400' :
                            user.status === 'away' ? 'bg-yellow-400' : 'bg-zinc-500'
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-white font-medium truncate">{user.name}</p>
                          <p className="text-[8px] text-zinc-500 truncate">
                            {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Отошёл' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 flex flex-col">
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/10 flex items-center justify-center ring-1 ring-emerald-500/25">
                        <span className="text-xs font-bold text-emerald-300">A</span>
                      </div>
                      <div>
                        <p className="text-[12px] text-white font-medium">Алексей</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <p className="text-[9px] text-emerald-400/80">Online</p>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="text-[8px] text-emerald-400 font-semibold">E2EE</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-hidden">
                      {/* Date divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-[9px] text-zinc-500 font-medium">Сегодня</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                      </div>

                      {/* Received message */}
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-[8px] font-bold text-emerald-300">A</span>
                        </div>
                        <div>
                          <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-3.5 py-2.5">
                            <p className="text-xs text-zinc-100">Привет! Как дела? 👋</p>
                          </div>
                          <p className="text-[8px] text-zinc-600 mt-1">14:32</p>
                        </div>
                      </div>

                      {/* Sent message */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%]">
                          <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl rounded-br-md px-3.5 py-2.5">
                            <div className="flex items-center gap-1 mb-1">
                              <Lock className="w-2 h-2 text-emerald-400/70" />
                              <span className="text-[7px] uppercase tracking-widest text-emerald-400/70 font-medium">E2EE</span>
                            </div>
                            <p className="text-xs text-emerald-50">Отлично! Только что обновил приложение 🚀</p>
                          </div>
                          <p className="text-[8px] text-zinc-600 mt-1 text-right">14:33 ✓✓</p>
                        </div>
                      </div>

                      {/* Received message */}
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-[8px] font-bold text-emerald-300">A</span>
                        </div>
                        <div>
                          <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-3.5 py-2.5">
                            <p className="text-xs text-zinc-100">Скинь ссылку на новую версию, тоже хочу попробовать 🔥</p>
                          </div>
                          <p className="text-[8px] text-zinc-600 mt-1">14:34</p>
                        </div>
                      </div>

                      {/* Typing indicator */}
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-[8px] font-bold text-emerald-300">A</span>
                        </div>
                        <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="px-4 pb-4 pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-zinc-700/50 transition-all focus-within:border-emerald-500/40 focus-within:shadow-[0_0_20px_rgba(16,245,181,0.06)]" style={{ background: 'rgba(39,39,42,0.3)' }}>
                        <Lock className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                        <div className="flex-1 h-5 rounded-md bg-transparent flex items-center">
                          <span className="text-[11px] text-zinc-400">Напишите сообщение…</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors cursor-pointer">
                            <ArrowRight className="w-3 h-3 text-emerald-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-3 -right-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-lg">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">E2EE</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 -left-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md shadow-lg">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-[9px] text-cyan-400 font-semibold tracking-wide">Realtime</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-1 text-zinc-600 hover:text-zinc-400 transition-colors"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[9px] uppercase tracking-widest">Узнать больше</span>
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   2. WHY CIPHER TALK (3 CORE PILLARS)
   ═══════════════════════════════════════════════════════════════════════════════ */

function WhySection() {
  const pillars = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Полная приватность',
      subtitle: 'E2EE + Zero Logs',
      description: 'Сквозное шифрование — только вы и ваш собеседник имеете доступ к сообщениям. Мы не храним логи, метаданные или историю.',
      gradient: 'from-emerald-500/5 to-emerald-500/0',
      borderColor: 'border-emerald-500/15',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      features: ['AES-256 + XChaCha20', 'Zero-knowledge архитектура', 'Только клиентское шифрование'],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Мгновенная доставка',
      subtitle: 'Realtime + Offline',
      description: 'Сообщения доставляются через Supabase Realtime каналы. Работает мгновенно даже при слабом соединении — очередность гарантирована.',
      gradient: 'from-cyan-500/5 to-cyan-500/0',
      borderColor: 'border-cyan-500/15',
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      features: ['Supabase Realtime', 'Offline queue', 'Typing indicators'],
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Современный дизайн',
      subtitle: 'Glassmorphism + Neon',
      description: 'Интерфейс в стиле Cipher Talk: глубокая тёмная тема, неоновые акценты, стеклянные панели и плавные анимации.',
      gradient: 'from-violet-500/5 to-violet-500/0',
      borderColor: 'border-violet-500/15',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400',
      features: ['Framer Motion', 'Responsive UI', 'Desktop & Mobile'],
    },
  ];

  return (
    <section id="features" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Почему Cipher Talk"
            title="Три причины выбрать нас"
            description="Создавая Cipher Talk, мы ставили во главу угла приватность, скорость и эстетику."
          />
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {pillars.map((p, i) => (
            <FadeSection key={p.title} delay={i * 0.1}>
              <div
                className={`group relative rounded-2xl p-6 md:p-7 border ${p.borderColor} bg-gradient-to-br ${p.gradient} backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,245,181,0.04)] h-full flex flex-col`}
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center mb-4 ring-1 ring-white/[0.08] ${p.iconColor}`}>
                  {p.icon}
                </div>

                <h3 className="text-white font-semibold text-lg mb-1">{p.title}</h3>
                <p className="text-[11px] text-emerald-400 font-medium mb-3">{p.subtitle}</p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5 flex-1">{p.description}</p>

                <div className="space-y-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-xs text-zinc-300">{f}</span>
                    </div>
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

/* ═══════════════════════════════════════════════════════════════════════════════
   3. FEATURES GALLERY
   ═══════════════════════════════════════════════════════════════════════════════ */

function FeaturesGallerySection() {
  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Disappearing Messages',
      description: 'Сообщения, которые самоуничтожаются через заданный промежуток времени.',
      gradient: 'from-emerald-500/[0.06] to-emerald-500/[0.01]',
      border: 'border-emerald-500/15',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Smart Notifications',
      description: 'Уведомления о новых сообщениях, статусе пользователя и сессиях.',
      gradient: 'from-cyan-500/[0.06] to-cyan-500/[0.01]',
      border: 'border-cyan-500/15',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Групповые чаты',
      description: 'Создавайте группы с E2EE шифрованием для всех участников.',
      gradient: 'from-violet-500/[0.06] to-violet-500/[0.01]',
      border: 'border-violet-500/15',
    },
    {
      icon: <Fingerprint className="w-5 h-5" />,
      title: 'Биометрия',
      description: 'Вход по отпечатку пальца или Face ID на поддерживаемых устройствах.',
      gradient: 'from-emerald-500/[0.06] to-emerald-500/[0.01]',
      border: 'border-emerald-500/15',
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      title: 'Zero Logs',
      description: 'Абсолютное отсутствие логов. Мы не знаем, с кем и когда вы общаетесь.',
      gradient: 'from-cyan-500/[0.06] to-cyan-500/[0.01]',
      border: 'border-cyan-500/15',
    },
    {
      icon: <Server className="w-5 h-5" />,
      title: 'Supabase Backend',
      description: 'Надёжная инфраструктура на Supabase с Realtime и Row Level Security.',
      gradient: 'from-violet-500/[0.06] to-violet-500/[0.01]',
      border: 'border-violet-500/15',
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-transparent via-emerald-500/[0.01] to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Возможности"
            title="Всё, что нужно для безопасного общения"
            description="Современный набор функций, которые делают Cipher Talk лучшим выбором для приватной коммуникации."
          />
        </FadeSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <FadeSection key={f.title} delay={i * 0.05}>
              <div
                className={`group relative rounded-xl p-5 border ${f.border} bg-gradient-to-br ${f.gradient} transition-all duration-300 hover:border-emerald-500/30`}
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <div className={`w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3 ring-1 ring-white/[0.08] ${f.gradient.includes('emerald') ? 'text-emerald-400' : f.gradient.includes('cyan') ? 'text-cyan-400' : 'text-violet-400'}`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{f.description}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   4. TESTIMONIAL / SOCIAL PROOF
   ═══════════════════════════════════════════════════════════════════════════════ */

function TestimonialSection() {
  const testimonials = [
    {
      text: 'Наконец-то мессенджер, который реально заботится о приватности. E2EE работает из коробки, никаких компромиссов.',
      author: 'Алексей К.',
      role: 'Security Engineer',
      stars: 5,
    },
    {
      text: 'Дизайн на уровне премиум-продуктов. Тёмная тема, неоновые акценты, плавные анимации — глаз радуется.',
      author: 'Мария С.',
      role: 'UI/UX Designer',
      stars: 5,
    },
    {
      text: 'Desktop-версия на Neutralino — это прорыв. Всего 15 MB, а работает как нативный софт. Без тормозов Electron.',
      author: 'Дмитрий И.',
      role: 'Fullstack Developer',
      stars: 5,
    },
  ];

  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Отзывы"
            title="Что говорят пользователи"
            description="Cipher Talk уже используют сотни людей, ценящих свою приватность."
          />
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <FadeSection key={t.author} delay={i * 0.1}>
              <div className="relative rounded-2xl p-6 border border-white/[0.06] bg-white/[0.02] h-full flex flex-col"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <Quote className="w-8 h-8 text-emerald-500/20 mb-3" />
                <p className="text-sm text-zinc-300 leading-relaxed mb-5 flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center text-xs font-bold text-emerald-300">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">{t.author}</p>
                    <p className="text-[9px] text-zinc-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5. DOWNLOAD SECTION
   ═══════════════════════════════════════════════════════════════════════════════ */

function DownloadSection() {
  const isDesktop = isDesktopApp();

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
      icon: <Command className="w-6 h-6" />,
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
            badge={isDesktop ? 'У вас уже есть приложение!' : 'Скачать'}
            title={isDesktop ? 'Версия для вашей платформы' : 'CipherTalk для вашей платформы'}
            description={isDesktop
              ? 'Вы запустили Desktop-приложение Cipher Talk. Весь функционал доступен без установки — просто откройте чат.'
              : 'Бесплатное десктопное приложение с полной поддержкой E2EE шифрования и всех функций веб-версии.'}
          />
        </FadeSection>

        {isDesktop ? (
          <FadeSection>
            <div className="max-w-lg mx-auto text-center">
              <div className="relative rounded-2xl p-8 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-cyan-500/[0.02]"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-500/30">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cipher Talk Desktop</h3>
                <p className="text-sm text-zinc-400 mb-6">Версия 0.1.0 · Neutralino.js · ~15 MB</p>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,245,181,0.3)]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Открыть чат
                </Link>
              </div>
            </div>
          </FadeSection>
        ) : (
          <>
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
            <FadeSection delay={0.3}>
              <div className="max-w-2xl mx-auto mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03]">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs text-zinc-400">
                    Сборка на <span className="text-zinc-300 font-medium">Neutralino.js</span> — самый лёгкий Desktop-рантайм.
                    Размер ~15 MB. Никакого Electron, Node.js или Rust.
                  </p>
                </div>
              </div>
            </FadeSection>
          </>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6. APP GALLERY (SCREENSHOTS)
   ═══════════════════════════════════════════════════════════════════════════════ */

function AppGallerySection() {
  const items = [
    {
      label: 'Чат',
      emoji: '💬',
      description: 'Интуитивный интерфейс с E2EE индикатором',
      gradient: 'from-emerald-500/10 to-cyan-500/5',
    },
    {
      label: 'Поиск',
      emoji: '🔍',
      description: 'Мгновенный поиск контактов с debounce',
      gradient: 'from-cyan-500/10 to-violet-500/5',
    },
    {
      label: 'Настройки',
      emoji: '⚙️',
      description: 'Управление профилем, сессиями и безопасностью',
      gradient: 'from-violet-500/10 to-emerald-500/5',
    },
  ];

  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Интерфейс"
            title="Красивый и функциональный"
            description="Каждый экран продуман до мелочей. Стеклянные панели, неоновые акценты, идеальная типографика."
          />
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <FadeSection key={item.label} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-6 border border-white/[0.06] bg-gradient-to-br ${item.gradient} h-full"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-white font-semibold text-base mb-1">{item.label}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.description}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   7. FOOTER
   ═══════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-sm">
              Cipher<span className="text-emerald-400">Talk</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-zinc-500">
            <button onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-emerald-400 transition-colors">Возможности</button>
            <button onClick={() => document.querySelector('#download')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-emerald-400 transition-colors">Скачать</button>
            <Link href="/chat" className="hover:text-emerald-400 transition-colors">Мессенджер</Link>
            <a href="https://github.com/BLACKSPANIEL/cipher-talk" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Github className="w-3 h-3" /> GitHub
            </a>
          </div>

          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} CipherTalk. E2EE messaging.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen bg-[#05070d]">
        <HeroSection />
        <WhySection />
        <FeaturesGallerySection />
        <TestimonialSection />
        <DownloadSection />
        <AppGallerySection />
        <Footer />
      </main>
    </>
  );
}