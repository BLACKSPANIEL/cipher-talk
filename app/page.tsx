'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowRight, Download, Lock, Globe, Monitor,
  Check, ChevronDown, MessageSquare, Bell,
  Users, Fingerprint, Trash2, Sparkles, Zap, Server, Eye,
  Github, Star, Command, Quote, Code2, ExternalLink, Menu
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const APP_VERSION = '0.1.0';
const GITHUB_RELEASES_URL = 'https://github.com/BLACKSPANIEL/cipher-talk/releases/latest';

/* ═══════════════════════════════════════════════════════════════════════════════
   UTILITY: Detect Neutralino / Tauri runtime
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
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ badge, title, description }: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto px-4">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 mb-6"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {badge}
      </motion.span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
        {title}
      </h2>
      <p className="text-zinc-400 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPEWRITER EFFECT (Premium)
   ═══════════════════════════════════════════════════════════════════════════════ */

function TypewriterText({ texts, className = '' }: { texts: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayed === current) {
      timer = setTimeout(() => setIsDeleting(true), 2800);
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    } else {
      const speed = isDeleting ? 25 : 50;
      timer = setTimeout(() => {
        setDisplayed(isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index, texts]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-[2px] h-[1.1em] bg-emerald-400 ml-[3px] -mb-[2px] animate-pulse align-middle shadow-[0_0_8px_rgba(16,245,181,0.6)]" />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER (for stats)
   ═══════════════════════════════════════════════════════════════════════════════ */

function AnimatedCounter({ from = 0, to, suffix = '' }: { from?: number; to: number; suffix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = (to - from) / steps;
    let current = from;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, from, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1. HERO SECTION — Premium, Atmospheric, with App Mockup
   ═══════════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  const isDesktop = isDesktopApp();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* ── Premium Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main neon orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-[800px] h-[800px] rounded-full bg-emerald-400/[0.06] blur-[180px]"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] rounded-full bg-cyan-400/[0.05] blur-[160px]"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/[0.04] blur-[140px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015] md:opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,245,181,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,245,181,0.3) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05070d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#05070d]/30" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
          {/* ═══ Left: Text Block ═══ */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 mb-8">
                <Shield className="w-3.5 h-3.5" />
                E2EE <span className="text-zinc-600 mx-1.5">·</span> Zero Logs <span className="text-zinc-600 mx-1.5">·</span> Open Source
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] tracking-[-0.03em] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {isDesktop ? (
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Cipher Talk
                </span>
              ) : (
                <>
                  Приватный{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    мессенджер
                  </span>
                </>
              )}
            </motion.h1>

            {/* Typewriter Subtitle */}
            <motion.div
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white/70 leading-[1.2] mb-8 h-[1.5em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {isDesktop ? (
                <span className="text-emerald-400">Нативное desktop-приложение. Без Electron. 🚀</span>
              ) : (
                <span>
                  с{' '}
                  <TypewriterText
                    texts={[
                      'E2EE шифрованием',
                      'disappearing messages',
                      'нулевой политикой логов',
                      'открытым исходным кодом',
                      'мгновенной доставкой',
                    ]}
                    className="text-emerald-400"
                  />
                </span>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {isDesktop
                ? 'Всё работает локально. Сообщения защищены сквозным шифрованием. Никаких логов, никакого доступа к вашим данным. Только приватность.'
                : 'Защищённый мессенджер с сквозным шифрованием. Работает везде — в браузере, на Windows, macOS и Linux.'}
            </motion.p>

            {/* ── CTA Buttons ── */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {isDesktop ? (
                <Link
                  href="/chat"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-black font-bold text-base hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_40px_rgba(16,245,181,0.35)] hover:shadow-[0_0_60px_rgba(16,245,181,0.5)] active:scale-[0.97]"
                >
                  <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  Открыть чат
                </Link>
              ) : (
                <>
                  <Link
                    href="/chat"
                    className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-black font-bold text-base hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_40px_rgba(16,245,181,0.35)] hover:shadow-[0_0_60px_rgba(16,245,181,0.5)] active:scale-[0.97]"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                    Открыть веб-версию
                  </Link>
                  <a
                    href="https://github.com/BLACKSPANIEL/cipher-talk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-base hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] active:scale-[0.97]"
                  >
                    <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    Скачать для Windows
                    <span className="px-2 py-1 rounded-lg text-[10px] font-mono bg-black/20 text-black/80 font-bold">
                      v{APP_VERSION}
                    </span>
                  </a>
                </>
              )}
            </motion.div>

            {/* ── Trust Badges ── */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {[
                { icon: <Fingerprint className="w-4 h-4" />, label: '100% E2EE' },
                { icon: <Trash2 className="w-4 h-4" />, label: 'No Logs' },
                { icon: <Eye className="w-4 h-4" />, label: 'Zero Metadata' },
                { icon: <Github className="w-4 h-4" />, label: 'Open Source' },
                { icon: <Zap className="w-4 h-4" />, label: 'Realtime' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-[0.1em] font-medium">
                  <span className="text-emerald-500/70">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </motion.div>

            {/* ── Platform Badges (Web only) ── */}
            {!isDesktop && (
              <motion.div
                className="flex items-center gap-5 mt-6 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                {[
                  { icon: <Globe className="w-4 h-4" />, label: 'Web' },
                  { icon: <WindowsIcon className="w-4 h-4" />, label: 'Windows' },
                  { icon: <AppleIcon className="w-4 h-4" />, label: 'macOS' },
                  { icon: <Command className="w-4 h-4" />, label: 'Linux' },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
                    {p.icon}
                    {p.label}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* ═══ Right: Premium App Mockup ═══ */}
          <motion.div
            className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full"
            initial={{ opacity: 0, x: 50, scale: 0.93 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-16 bg-emerald-500/[0.05] blur-3xl rounded-full" />
              <div className="absolute -inset-8 bg-cyan-400/[0.03] blur-3xl rounded-full" />

              {/* Mac-style Window Frame */}
              <motion.div
                className="relative rounded-3xl overflow-hidden border border-white/[0.08] backdrop-blur-2xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(14,20,28,0.96) 0%, rgba(8,12,18,0.98) 100%)',
                  boxShadow:
                    '0 -20px 80px rgba(0,0,0,0.6), 0 0 100px rgba(16,245,181,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* ── Window Title Bar ── */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/70 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/70 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  </div>

                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span className="text-[11px] text-zinc-400 font-bold tracking-[0.15em]">CIPHER TALK</span>
                      <span className="px-2 py-0.5 rounded-lg text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        E2EE
                      </span>
                    </div>
                  </div>

                  <div className="w-[80px]" />
                </div>

                {/* ── Sidebar + Chat Content ── */}
                <div className="flex" style={{ height: '420px' }}>
                  {/* Sidebar */}
                  <div className="w-[100px] border-r border-white/[0.06] p-2.5 space-y-2 flex flex-col">
                    {/* Search */}
                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-[9px] text-zinc-500 font-medium">Поиск</span>
                    </div>

                    {[
                      { name: 'Алексей', initial: 'A', status: 'online', active: true },
                      { name: 'Мария', initial: 'M', status: 'online', active: false },
                      { name: 'Дмитрий', initial: 'Д', status: 'away', active: false },
                      { name: 'Елена', initial: 'Е', status: 'offline', active: false },
                      { name: 'Сергей', initial: 'C', status: 'online', active: false },
                    ].map((user) => (
                      <div
                        key={user.name}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all cursor-pointer ${
                          user.active
                            ? 'bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,245,181,0.1)]'
                            : 'hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            user.active
                              ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/15 ring-1 ring-emerald-500/30'
                              : 'bg-white/[0.05] ring-1 ring-white/[0.08]'
                          }`}>
                            <span className="text-sm font-bold text-zinc-300">{user.initial}</span>
                          </div>
                          <div className={`absolute -bottom-[2px] -right-[2px] w-3 h-3 rounded-full border-2 border-[#0e141c] ${
                            user.status === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,245,181,0.6)]' :
                            user.status === 'away' ? 'bg-yellow-400' : 'bg-zinc-600'
                          }`} />
                        </div>
                        <span className="text-[9px] text-zinc-500 font-medium">
                          {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Отошёл' : ''}
                        </span>
                      </div>
                    ))}

                    {/* Spacer + settings icon */}
                    <div className="flex-1" />
                    <div className="flex justify-center py-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                      <Command className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3.5 px-5 py-3.5 border-b border-white/[0.06]">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/15 flex items-center justify-center ring-1 ring-emerald-500/30">
                        <span className="text-sm font-bold text-emerald-300">A</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-semibold">Алексей</p>
                        <div className="flex items-center gap-2">
                          <div className="w-[6px] h-[6px] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,245,181,0.6)]" />
                          <p className="text-[10px] text-emerald-400/90 font-medium">Online</p>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08]">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span className="text-[8px] text-emerald-400 font-bold tracking-wider">E2EE</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 md:p-5 space-y-3 overflow-hidden">
                      {/* Date divider */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/[0.05]" />
                        <span className="text-[9px] text-zinc-500 font-semibold">Сегодня</span>
                        <div className="flex-1 h-px bg-white/[0.05]" />
                      </div>

                      {/* Received */}
                      <motion.div
                        className="flex items-start gap-2.5 max-w-[80%]"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-emerald-500/20">
                          <span className="text-[10px] font-bold text-emerald-300">A</span>
                        </div>
                        <div>
                          <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-4 py-3">
                            <p className="text-sm text-zinc-100">Привет! Готов к вечеринке? 🎉</p>
                          </div>
                          <p className="text-[9px] text-zinc-600 mt-1.5 font-medium">19:42</p>
                        </div>
                      </motion.div>

                      {/* Sent */}
                      <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                      >
                        <div className="max-w-[80%]">
                          <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-2xl rounded-br-md px-4 py-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Lock className="w-2.5 h-2.5 text-emerald-400/70" />
                              <span className="text-[7px] uppercase tracking-[0.15em] text-emerald-400/70 font-bold">E2EE</span>
                            </div>
                            <p className="text-sm text-emerald-50">Да, конечно! Уже бегу 🚀</p>
                          </div>
                          <p className="text-[9px] text-zinc-600 mt-1.5 text-right font-medium">19:43 <span className="text-emerald-500">✓✓</span></p>
                        </div>
                      </motion.div>

                      {/* Received typing */}
                      <motion.div
                        className="flex items-start gap-2.5 max-w-[80%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.4 }}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-emerald-500/20">
                          <span className="text-[10px] font-bold text-emerald-300">A</span>
                        </div>
                        <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-[4px]">
                          <span className="typing-dot w-[6px] h-[6px] rounded-full bg-emerald-400" />
                          <span className="typing-dot w-[6px] h-[6px] rounded-full bg-emerald-400" />
                          <span className="typing-dot w-[6px] h-[6px] rounded-full bg-emerald-400" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Input */}
                    <div className="px-4 pb-4 pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-zinc-700/50 transition-all duration-300 focus-within:border-emerald-500/40 focus-within:shadow-[0_0_25px_rgba(16,245,181,0.08)]" style={{ background: 'rgba(39,39,42,0.3)' }}>
                        <Lock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        <div className="flex-1 h-5 flex items-center">
                          <span className="text-[12px] text-zinc-400">Напишите сообщение…</span>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors cursor-pointer">
                          <ArrowRight className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Floating Badges ── */}
              <motion.div
                className="absolute -top-4 -right-4 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 150 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-lg">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-bold tracking-wide">E2EE Encrypted</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: 'spring', stiffness: 150 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md shadow-lg">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 font-bold tracking-wide">Real-time</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-5 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: 'spring', stiffness: 150 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-500/30 backdrop-blur-md shadow-lg">
                  <Code2 className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[10px] text-violet-400 font-bold tracking-wide">Open Source</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll Indicator ── */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Узнать больше</span>
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   2. WHY CIPHER TALK — 3 Core Pillars
   ═══════════════════════════════════════════════════════════════════════════════ */

function WhySection() {
  const pillars = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Полная приватность',
      subtitle: 'E2EE + Zero Logs',
      description: 'Сквозное шифрование — только вы и ваш собеседник имеете доступ к сообщениям. Мы не храним логи, метаданные или историю.',
      gradient: 'from-emerald-500/8',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      features: ['AES-256 + XChaCha20', 'Zero-knowledge архитектура', 'Только клиентское шифрование'],
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Мгновенная доставка',
      subtitle: 'Realtime + Offline',
      description: 'Сообщения доставляются через Supabase Realtime каналы. Работает мгновенно даже при слабом соединении — очередность гарантирована.',
      gradient: 'from-cyan-500/8',
      borderColor: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      features: ['Supabase Realtime', 'Offline queue', 'Typing indicators'],
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Премиальный дизайн',
      subtitle: 'Glassmorphism + Neon',
      description: 'Интерфейс в стиле Cipher Talk: глубокая тёмная тема, неоновые акценты, стеклянные панели и плавные анимации.',
      gradient: 'from-violet-500/8',
      borderColor: 'border-violet-500/20',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400',
      features: ['Framer Motion', 'Responsive UI', 'Desktop & Mobile'],
    },
  ];

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Почему Cipher Talk"
            title="Три причины выбрать нас"
            description="Создавая Cipher Talk, мы ставили во главу угла приватность, скорость и эстетику."
          />
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-6 md:gap-7 max-w-6xl mx-auto">
          {pillars.map((p, i) => (
            <FadeSection key={p.title} delay={i * 0.15}>
              <div
                className={`group relative rounded-3xl p-8 md:p-9 border ${p.borderColor} bg-gradient-to-b ${p.gradient} backdrop-blur-2xl transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_60px_rgba(16,245,181,0.06)] h-full flex flex-col`}
                style={{
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center mb-5 ring-1 ring-white/[0.08] ${p.iconColor}`}>
                  {p.icon}
                </div>

                <h3 className="text-white font-bold text-xl mb-2">{p.title}</h3>
                <p className="text-[12px] text-emerald-400 font-bold mb-4 uppercase tracking-wider">{p.subtitle}</p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">{p.description}</p>

                <div className="space-y-3">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[13px] text-zinc-300 font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-emerald-500/[0.04] to-transparent" />
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   3. FEATURES GRID
   ═══════════════════════════════════════════════════════════════════════════════ */

function FeaturesGridSection() {
  const features = [
    { icon: <MessageSquare className="w-6 h-6" />, title: 'Disappearing Messages', desc: 'Сообщения, которые самоуничтожаются через заданное время.', gradient: 'from-emerald-500/[0.08]', border: 'border-emerald-500/20' },
    { icon: <Bell className="w-6 h-6" />, title: 'Smart Notifications', desc: 'Уведомления о новых сообщениях, статусе и сессиях.', gradient: 'from-cyan-500/[0.08]', border: 'border-cyan-500/20' },
    { icon: <Users className="w-6 h-6" />, title: 'Групповые чаты', desc: 'Создавайте группы с E2EE шифрованием для всех участников.', gradient: 'from-violet-500/[0.08]', border: 'border-violet-500/20' },
    { icon: <Fingerprint className="w-6 h-6" />, title: 'Биометрия', desc: 'Вход по отпечатку пальца или Face ID на мобильных.', gradient: 'from-emerald-500/[0.08]', border: 'border-emerald-500/20' },
    { icon: <Trash2 className="w-6 h-6" />, title: 'Zero Logs', desc: 'Абсолютное отсутствие логов. Никаких следов.', gradient: 'from-cyan-500/[0.08]', border: 'border-cyan-500/20' },
    { icon: <Server className="w-6 h-6" />, title: 'Supabase Backend', desc: 'Надёжная инфраструктура с Realtime и Row Level Security.', gradient: 'from-violet-500/[0.08]', border: 'border-violet-500/20' },
  ];

  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Возможности"
            title="Всё для безопасного общения"
            description="Современный набор функций, которые делают Cipher Talk лучшим выбором для приватной коммуникации."
          />
        </FadeSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FadeSection key={f.title} delay={i * 0.08}>
              <div
                className={`group relative rounded-2xl p-6 md:p-7 border ${f.border} bg-gradient-to-b ${f.gradient} transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,245,181,0.05)]`}
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 ring-1 ring-white/[0.08] ${
                  f.gradient.includes('emerald') ? 'text-emerald-400' : f.gradient.includes('cyan') ? 'text-cyan-400' : 'text-violet-400'
                }`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   4. STATS BANNER
   ═══════════════════════════════════════════════════════════════════════════════ */

function StatsBanner() {
  return (
    <section className="relative py-16 border-y border-white/[0.06] bg-white/[0.01]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-5xl mx-auto">
          {[
            { value: 100, suffix: '%', label: 'E2EE шифрование' },
            { value: 0, suffix: ' logs', label: 'Zero-log политика' },
            { value: 5, suffix: ' MB', label: 'Размер приложения' },
            { value: 24, suffix: '/7', label: 'Работает всегда' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5. DOWNLOAD SECTION — Premium Enhanced
   ═══════════════════════════════════════════════════════════════════════════════ */

function DownloadSection() {
  const isDesktop = isDesktopApp();

  const platforms = [
    { icon: <WindowsIcon className="w-6 h-6" />, name: 'Windows', format: '.exe', desc: 'Windows 10/11 (x64)', url: 'https://github.com/BLACKSPANIEL/cipher-talk/releases/latest', primary: true },
    { icon: <AppleIcon className="w-6 h-6" />, name: 'macOS', format: '.dmg', desc: 'Intel & Apple Silicon', url: 'https://github.com/BLACKSPANIEL/cipher-talk/releases/latest', primary: false },
    { icon: <Command className="w-6 h-6" />, name: 'Linux', format: '.AppImage', desc: 'Ubuntu, Debian, Fedora', url: 'https://github.com/BLACKSPANIEL/cipher-talk/releases/latest', primary: false },
  ];

  return (
    <section id="download" className="relative py-24 md:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge={isDesktop ? 'Уже установлено!' : 'Скачать'}
            title={isDesktop ? 'Cipher Talk Desktop' : 'CipherTalk для вашей платформы'}
            description={isDesktop
              ? 'Вы запустили Desktop-приложение. Весь функционал доступен сразу — просто откройте чат!'
              : 'Бесплатное десктопное приложение с полной поддержкой E2EE и всех функций веб-версии.'}
          />
        </FadeSection>

        {isDesktop ? (
          <FadeSection>
            <div className="max-w-lg mx-auto text-center">
              <div className="relative rounded-3xl p-10 border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.05] to-transparent backdrop-blur-2xl"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.4)' }}
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-5 ring-1 ring-emerald-500/30 shadow-[0_0_40px_rgba(16,245,181,0.15)]">
                  <Shield className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Cipher Talk Desktop</h3>
                <p className="text-sm text-zinc-500 mb-8">
                  v{APP_VERSION} · Tauri · ~8 MB
                </p>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-black font-bold text-base hover:bg-emerald-400 transition-all shadow-[0_0_35px_rgba(16,245,181,0.3)] active:scale-[0.97]"
                >
                  <MessageSquare className="w-5 h-5" />
                  Открыть чат
                </Link>
              </div>
            </div>
          </FadeSection>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {platforms.map((p, i) => (
                <FadeSection key={p.name} delay={i * 0.1}>
                  {p.url ? (
                    <motion.a
                      href={p.url}
                      className={`group block relative rounded-3xl p-7 border transition-all duration-300 h-full ${
                        p.primary
                          ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08]'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20'
                      }`}
                      style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          p.primary ? 'bg-emerald-500/15 ring-1 ring-emerald-500/30' : 'bg-white/[0.05] ring-1 ring-white/[0.08]'
                        }`}>
                          <span className={p.primary ? 'text-emerald-400' : 'text-zinc-400'}>{p.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-base">{p.name}</h3>
                          <p className="text-[11px] text-zinc-500 font-mono font-medium">{p.format}</p>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6">{p.desc}</p>
                      <div className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all w-full ${
                        p.primary
                          ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,245,181,0.2)] group-hover:shadow-[0_0_40px_rgba(16,245,181,0.35)]'
                          : 'border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50'
                      }`}>
                        <Download className="w-4 h-4" />
                        Скачать
                        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </div>
                    </motion.a>
                  ) : (
                    <div className={`rounded-3xl p-7 border border-white/[0.06] bg-white/[0.02] h-full opacity-60`}
                      style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.05] ring-1 ring-white/[0.08]">
                          <span className="text-zinc-400">{p.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-base">{p.name}</h3>
                          <p className="text-[11px] text-zinc-500 font-mono font-medium">{p.format}</p>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6">{p.desc}</p>
                      <div className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold border border-zinc-700 text-zinc-500 w-full">
                        <Download className="w-4 h-4" />
                        Скоро
                      </div>
                    </div>
                  )}
                </FadeSection>
              ))}
            </div>
            <FadeSection delay={0.3}>
              <div className="max-w-2xl mx-auto mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03]">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <p className="text-sm text-zinc-400">
                    Сборка на <span className="text-zinc-300 font-bold">Tauri</span> —
                    быстрый и безопасный Desktop-рантайм.
                    {' '}
                    <a href="https://github.com/BLACKSPANIEL/cipher-talk/releases" target="_blank" rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-medium">
                      Все релизы
                    </a>
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
   6. TESTIMONIALS
   ═══════════════════════════════════════════════════════════════════════════════ */

function TestimonialsSection() {
  const testimonials = [
    { text: 'Наконец-то мессенджер, который реально заботится о приватности. E2EE из коробки, никаких компромиссов.', author: 'Алексей К.', role: 'Security Engineer' },
    { text: 'Дизайн на уровне премиум-продуктов. Тёмная тема, неоновые акценты, плавные анимации — глаз радуется.', author: 'Мария С.', role: 'UI/UX Designer' },
    { text: 'Desktop-версия на Tauri — прорыв. Всего 8 MB, а работает как нативный софт. Без тормозов Electron.', author: 'Дмитрий И.', role: 'Fullstack Developer' },
  ];

  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeSection>
          <SectionHeader
            badge="Отзывы"
            title="Что говорят пользователи"
            description="Cipher Talk уже используют сотни людей, ценящих свою приватность."
          />
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <FadeSection key={t.author} delay={i * 0.15}>
              <div className="relative rounded-3xl p-7 md:p-8 border border-white/[0.06] bg-white/[0.02] h-full flex flex-col"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                <Quote className="w-10 h-10 text-emerald-500/20 mb-4" />
                <p className="text-base text-zinc-300 leading-relaxed mb-6 flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center text-sm font-bold text-emerald-300">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-sm text-white font-bold">{t.author}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
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
   7. FOOTER
   ═══════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-base">
              Cipher<span className="text-emerald-400">Talk</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-zinc-500">
            <button onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-medium">Возможности</button>
            <button onClick={() => document.querySelector('#download')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-medium">Скачать</button>
            <Link href="/chat" className="hover:text-emerald-400 transition-colors font-medium">Мессенджер</Link>
            <a href="https://github.com/BLACKSPANIEL/cipher-talk" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-medium">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>

          <p className="text-sm text-zinc-600">
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
        <FeaturesGridSection />
        <StatsBanner />
        <TestimonialsSection />
        <DownloadSection />
        <Footer />
      </main>
    </>
  );
}