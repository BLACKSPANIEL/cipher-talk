'use client';

import { motion } from 'framer-motion';
import { EyeOff, Lock, Timer } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cards = [
  {
    icon: EyeOff,
    title: 'Zero-Knowledge',
    description: 'Мы не храним ключи. Ваши данные известны только вам — никакая третья сторона, включая нас, не имеет к ним доступа.',
    gradient: 'from-emerald-500/20 to-green-500/5',
    borderGlow: 'group-hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Lock,
    title: 'Клиентское шифрование',
    description: 'Все данные кодируются прямо в вашем браузере. Сервер получает только зашифрованные сообщения, которые невозможно прочитать без вашего ключа.',
    gradient: 'from-cyan-500/20 to-blue-500/5',
    borderGlow: 'group-hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Timer,
    title: 'Временные комнаты',
    description: 'Чаты существуют только пока вы в них находитесь. После выхода всех участников комната и все сообщения безвозвратно уничтожаются.',
    gradient: 'from-violet-500/20 to-purple-500/5',
    borderGlow: 'group-hover:border-violet-500/50',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
  },
];

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
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-sm">
              <Lock className="w-4 h-4" />
              <span>Преимущества</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Почему{' '}
              <span className="text-neon-green">Cipher Talk</span>?
            </h2>
            <p className="text-gray-400">
              Три ключевых принципа, которые делают ваше общение по-настоящему приватным
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeInUp}
                  className="group relative overflow-hidden rounded-2xl border border-neon-green/20 bg-surface-dark/50 backdrop-blur hover:shadow-xl transition-all duration-300"
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative p-6 md:p-8 space-y-5">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-green/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}