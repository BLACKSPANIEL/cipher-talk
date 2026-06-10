'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Архитектура', href: '#architecture' },
  { label: 'Функции', href: '#features' },
  { label: 'Локализация', href: '#localization' },
  { label: 'Скачать', href: '#download' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Glassmorphism background */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          scrolled
            ? 'bg-[#05070d]/80 backdrop-blur-xl border-b border-emerald-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      />

      <div className="container relative flex items-center justify-between h-16 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo with neon glow */}
        <Link href="/" className="flex items-center gap-2.5 group relative">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30"
              style={{ boxShadow: '0 0 20px rgba(16,245,181,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}
            >
              <Shield className="w-4 h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16,245,181,0.7))' }} />
            </div>
            <div className="absolute inset-0 bg-emerald-500/30 blur-lg group-hover:bg-emerald-500/50 transition-colors" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide">
            Cipher<span className="text-emerald-400">Talk</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors rounded-lg hover:bg-white/[0.03]"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
          >
            Войти
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 hover:border-emerald-500/60 transition-all"
            style={{ boxShadow: '0 0 20px rgba(16,245,181,0.12)' }}
          >
            <Rocket className="w-3.5 h-3.5" />
            Запустить Web
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-white/[0.05] transition-colors"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-[#05070d]/95 backdrop-blur-xl border-b border-emerald-500/10 px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="block w-full text-left text-sm text-zinc-400 hover:text-emerald-400 transition-colors py-2.5 px-3 rounded-lg hover:bg-white/[0.03]"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-white/[0.06]">
                <Link
                  href="/chat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-sm font-semibold"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Запустить Web-версию
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}