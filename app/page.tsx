'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { Sandbox } from '@/components/Sandbox';
import { InfoCards } from '@/components/InfoCards';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function HomePage() {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleScrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden min-h-screen">
        {/* Hero Section */}
        <HeroSection onScrollToHowItWorks={handleScrollToHowItWorks} />

        {/* Info Cards */}
        <div ref={howItWorksRef}>
          <InfoCards />
        </div>

        {/* Sandbox */}
        <Sandbox />

        {/* CTA Section */}
        <section className="relative py-24 border-t border-neon-green/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-r from-neon-green/10 to-green-400/5 border border-neon-green/30 rounded-2xl p-12 text-center space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Готов попробовать?
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                Открой Cipher Talk прямо в браузере и начни безопасное общение
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-green text-black font-semibold hover:bg-neon-dark-green transition-all shadow-neon-glow-lg"
                >
                  <span>Открыть мессенджер</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-neon-green/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-green" />
                <span className="font-bold text-white">Cipher Talk</span>
              </div>
              <p className="text-sm text-gray-500">
                © 2024 Cipher Talk. Все права защищены.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#how-it-works" className="hover:text-neon-green transition">Как это работает</a>
                <a href="#sandbox" className="hover:text-neon-green transition">Песочница</a>
                <Link href="/chat" className="hover:text-neon-green transition">Мессенджер</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}