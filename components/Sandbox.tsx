'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import { encryptText, CIPHER_OPTIONS, type CipherType } from '@/lib/ciphers';

export function Sandbox() {
  const [text, setText] = useState('');
  const [cipher, setCipher] = useState<CipherType>('caesar');
  const [copied, setCopied] = useState(false);

  const encrypted = useMemo(() => encryptText(text, cipher, 3), [text, cipher]);

  const handleCopy = async () => {
    if (!encrypted) return;
    try {
      await navigator.clipboard.writeText(encrypted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = encrypted;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="sandbox" className="relative py-24 border-t border-neon-green/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm">
              <Lock className="w-4 h-4" />
              <span>Интерактивная песочница</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Попробуй шифрование{' '}
              <span className="text-neon-green">прямо сейчас</span>
            </h2>
            <p className="text-gray-400">
              Введи текст, выбери алгоритм — и увидишь зашифрованный результат в реальном времени
            </p>
          </div>

          {/* Sandbox Widget */}
          <div className="relative rounded-2xl border border-neon-green/20 bg-surface-dark/50 backdrop-blur p-6 md:p-8 space-y-6">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-neon-green/5 to-green-400/5 blur-xl opacity-50" />

            <div className="relative space-y-6">
              {/* Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Исходный текст
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Введи текст для шифрования..."
                  rows={3}
                  className="w-full bg-black/50 border border-neon-green/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/30 transition resize-none"
                />
              </div>

              {/* Cipher Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Алгоритм шифрования
                </label>
                <select
                  value={cipher}
                  onChange={(e) => setCipher(e.target.value as CipherType)}
                  className="w-full bg-black/50 border border-neon-green/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/30 transition appearance-none cursor-pointer"
                >
                  {CIPHER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Result */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Зашифрованный результат
                  </label>
                  {encrypted && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs text-neon-green hover:text-neon-dark-green transition"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Копировать
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="w-full bg-black/50 border border-neon-green/20 rounded-xl px-4 py-3 min-h-[3rem] flex items-center">
                  {encrypted ? (
                    <code className="text-neon-green break-all text-sm font-mono">
                      {encrypted}
                    </code>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {cipher === 'none'
                        ? 'Режим "Обычный текст" — шифрование отключено'
                        : 'Введи текст для шифрования...'}
                    </span>
                  )}
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-neon-green/10">
                {cipher === 'none' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Шифрование отключено</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-neon-green" />
                    <span>Активно: {CIPHER_OPTIONS.find((o) => o.value === cipher)?.label}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}