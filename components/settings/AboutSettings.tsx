'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info, Heart, Github, Mail, FileText, Shield } from 'lucide-react';

export function AboutSettings() {
  const appInfo = {
    name: 'Cipher Talk',
    version: '2.1.0',
    build: '2024.12.15',
    description: 'Премиальный защищённый мессенджер с E2EE шифрованием',
  };

  const links = [
    { icon: FileText, label: 'Политика конфиденциальности', href: '#' },
    { icon: Shield, label: 'Условия использования', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Mail, label: 'Поддержка', href: 'mailto:support@ciphertalk.app' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* App Info Card */}
      <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(16,245,181,0.2)]">
          <span className="text-4xl">🔐</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{appInfo.name}</h2>
        <p className="text-sm text-gray-400 mb-4">{appInfo.description}</p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>Версия {appInfo.version}</span>
          <span>·</span>
          <span>Сборка {appInfo.build}</span>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">О приложении</h3>
            <p className="text-[10px] text-gray-500">Основные возможности</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { title: 'E2EE Шифрование', desc: 'Сквозное шифрование всех сообщений' },
            { title: 'Кроссплатформенность', desc: 'iOS, Android, Windows, macOS, Linux' },
            { title: 'Открытый исходный код', desc: 'Проверяемый и безопасный код' },
            { title: 'Премиум дизайн', desc: 'Современный glassmorphism интерфейс' },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/[0.08]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{feature.title}</p>
                <p className="text-[10px] text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Ссылки</h3>
            <p className="text-[10px] text-gray-500">Полезные ресурсы</p>
          </div>
        </div>

        <div className="space-y-2">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <link.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4">
        <p className="text-[10px] text-gray-600">
          © 2024 Cipher Talk. Все права защищены.
        </p>
        <p className="text-[10px] text-gray-600 mt-1">
          Сделано с <Heart className="w-3 h-3 inline text-red-400" /> для приватности
        </p>
      </div>
    </motion.div>
  );
}

export default AboutSettings;