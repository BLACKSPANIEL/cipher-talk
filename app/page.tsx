'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, EyeOff, Lock, Sparkles, MessageCircle, Wifi, Smartphone, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: 'End-to-End шифрование',
    description: 'Каждое сообщение шифруется на устройстве отправителя и остаётся приватным только у получателя.'
  },
  {
    icon: EyeOff,
    title: 'Никаких логов',
    description: 'Мы не храним историю переписок, метаданные и ключи доступов на серверах.'
  },
  {
    icon: Zap,
    title: 'Disappearing messages',
    description: 'Сообщения автоматически исчезают по таймеру после того, как их прочитают.'
  },
  {
    icon: Lock,
    title: 'Биометрия и пароль',
    description: 'Вход в приложение защищён отпечатком, Face ID или паролем на устройстве.'
  }
];

const productHighlights = [
  {
    title: 'Скоростные чаты',
    description: 'Молниеносная отправка сообщений, голосовых заметок и файлов без задержек.'
    , icon: MessageCircle
  },
  {
    title: 'Группы и каналы',
    description: 'Создавайте приватные группы, делитесь ссылками и контролируйте доступ.'
    , icon: Wifi
  },
  {
    title: 'Интуитивный UI',
    description: 'Минималистичный дизайн с neon-акцентами и удобной навигацией.'
    , icon: Smartphone
  },
  {
    title: 'Доступ из браузера',
    description: 'Открывайте Cipher Talk в любой современной браузере без дополнительных плагинов.'
    , icon: TrendingUp
  }
];

const workflow = [
  {
    step: '1. Регистрация',
    description: 'Создайте защищённый профиль без номера телефона или привязки к почте.'
  },
  {
    step: '2. Подключение',
    description: 'Найти собеседника по коду-шаре и начать безопасный чат.'
  },
  {
    step: '3. Общение',
    description: 'Обменивайтесь голосовыми, фото и секретными сообщениями с полным E2EE.'
  }
];

const trustStatements = [
  {
    quote: 'Cipher Talk — это новая веха приватных сообщений. Мгновенно, красиво и безопасно.',
    author: 'Мария С., security designer'
  },
  {
    quote: 'Каждое движение в интерфейсе выглядит премиально. Действительно ощущается забота о приватности.',
    author: 'Игорь К., CTO стартапа'
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-radial opacity-70" />
      <div className="container relative pt-10">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
          className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-8">
            <Badge className="max-w-fit">Cipher Talk</Badge>
            <div className="space-y-6">
              <motion.h1 variants={fadeIn} className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Приватный мессенджер нового поколения
              </motion.h1>
              <motion.p variants={fadeIn} className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Безопасные чаты с end-to-end шифрованием, disappearing messages и нулевой политикой логов. Стильный интерфейс для тех, кто ценит приватность.
              </motion.p>
            </div>

            <motion.div variants={fadeIn} className="flex flex-col gap-4 sm:flex-row">
              <Button className="min-w-[170px]">Открыть веб-версию</Button>
              <Button variant="secondary" className="min-w-[170px]">Скачать</Button>
            </motion.div>

            <motion.div variants={fadeIn} className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-glow">
                <p className="text-3xl font-semibold text-white">100%</p>
                <p className="mt-2 text-sm text-slate-400">E2EE по умолчанию</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-glow">
                <p className="text-3xl font-semibold text-white">0</p>
                <p className="mt-2 text-sm text-slate-400">логи на сервере</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-glow">
                <p className="text-3xl font-semibold text-white">24/7</p>
                <p className="mt-2 text-sm text-slate-400">анонимная защита</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeIn} className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -right-14 top-16 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-glow">
              <div className="flex items-center justify-between rounded-3xl bg-slate-950/90 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cipher Talk</p>
                  <p className="mt-2 text-sm text-slate-300">Приватный чат</p>
                </div>
                <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">E2EE</span>
              </div>
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl bg-slate-950/90 p-5 shadow-lg shadow-cyan-500/10">
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Секретный канал</span>
                    <span>12:48</span>
                  </div>
                  <p className="text-sm leading-7 text-slate-200">
                    «Привет, я уже настроил disappearing messages. Всё выглядит очень стильно.»
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5 shadow-lg shadow-violet-500/10">
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Сервер</span>
                    <span>…</span>
                  </div>
                  <p className="text-sm leading-7 text-slate-200">
                    «Никаких логов, только зашифрованные сообщения между устройствами.»
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}
          className="mt-24"
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="space-y-4">
              <Badge>Безопасность</Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Проверенные защиты для каждой беседы</h2>
              <p className="max-w-xl leading-7 text-slate-300">
                Cipher Talk сочетает современные протоколы шифрования, автоматическое уничтожение данных и мощные слои авторизации, чтобы ваше общение оставалось полностью приватным.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="group overflow-hidden">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-cyan-300 transition group-hover:bg-cyan-400/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </motion.section>

        <Separator className="my-20" />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}
          className="space-y-12"
        >
          <div className="space-y-4 text-center">
            <Badge>Ключевые возможности</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Все, что нужно для защищённого общения</h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Никаких лишних функций — только мощная приватность, понятный интерфейс и стильный опыт, который хочется использовать каждый день.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {productHighlights.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="rounded-[2rem] border-white/10 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </motion.section>

        <Separator className="my-20" />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="space-y-6">
            <Badge>Как это работает</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Три шага до защищённого разговора</h2>
            <p className="max-w-xl leading-7 text-slate-400">
              Упростили поток общения так, чтобы функциональность оставалась предельно понятной и доступной на любых устройствах.
            </p>
          </div>
          <div className="grid gap-5">
            {workflow.map((item, index) => (
              <Card key={item.step} className="grid gap-4 rounded-[2rem] border-white/10 p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-200">{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.step}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        <Separator className="my-20" />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}
          className="space-y-10"
        >
          <div className="space-y-4 text-center">
            <Badge>Дизайн интерфейса</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Стильный glassmorphism для современного мессенджера</h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Интуитивный интерфейс с глубокой тёмной палитрой, неоновыми акцентами и стеклянными панелями — всё для захватывающего user experience.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow"
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-violet-400 to-sky-400 opacity-70" />
                <div className="h-72 rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 shadow-inner">
                  <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/5 bg-slate-950/90 p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Chat</span>
                        <span>00:17</span>
                      </div>
                      <div className="rounded-3xl bg-slate-900/90 p-4 text-sm leading-6 text-slate-300">
                        <p>«Давай обсудим новый дизайн и добавим disappearing messages.»</p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Мокап интерфейса. Заменить на реальные PNG-скриншоты.
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <Separator className="my-20" />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } } }}
          className="space-y-10"
        >
          <div className="space-y-4 text-center">
            <Badge>Отзывы</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Доверяют специалисты</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {trustStatements.map((item) => (
              <Card key={item.author} className="rounded-[2rem] border-white/10 p-8">
                <p className="text-xl leading-8 text-slate-100">“{item.quote}”</p>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-500">{item.author}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        <footer className="mt-24 border-t border-white/10 pt-10 pb-6 text-sm text-slate-500">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-white">Cipher Talk</p>
              <p className="text-slate-500">Приватный мессенджер с фокусом на E2EE и минимализм.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-400">
              <a href="#security" className="hover:text-white">Безопасность</a>
              <a href="#features" className="hover:text-white">Возможности</a>
              <a href="#gallery" className="hover:text-white">Галерея</a>
              <a href="#footer" className="hover:text-white">Контакты</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
