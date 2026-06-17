'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import {
  Shield, Eye, EyeOff, Loader2, ArrowLeft, UserPlus, LogIn,
  Sparkles, Lock, Mail, KeyRound
} from 'lucide-react';
import { TermsModal } from '@/components/ui/TermsModal';
import { PrivacyModal } from '@/components/ui/PrivacyModal';
import { useLanguage } from '@/lib/i18n';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage(t('auth.fill_all'));
      return;
    }

    if (mode === 'register' && !username.trim()) {
      setErrorMessage('Введите имя пользователя');
      return;
    }

    setIsLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setIsLoading(false);

      if (error) {
        setErrorMessage(
          error.message === 'Invalid login credentials'
            ? t('auth.invalid_credentials')
            : error.message === 'Email not confirmed'
            ? t('auth.email_not_confirmed')
            : error.message
        );
        return;
      }

      router.push('/chat');
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      setIsLoading(false);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push('/chat');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] flex flex-col relative overflow-hidden">
      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/[0.04] blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Top bar ── */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
          <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
            Cipher Talk
          </span>
        </button>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500/60" />
          <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-wider">E2EE</span>
        </div>
      </div>

      {/* ── Auth card ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-md">
          {/* Glow */}
          <div className="absolute -inset-4 bg-emerald-500/[0.03] blur-3xl rounded-full" />

          {/* Card */}
          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* Inner gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="relative p-8">
              {/* Shield icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/5 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(16,245,181,0.15)]">
                    <Shield className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  {mode === 'login' ? t('auth.login_title') : 'Создать аккаунт'}
                </h1>
                <p className="text-sm text-gray-400">
                  {mode === 'login' ? t('auth.login_subtitle') : 'Зарегистрируйтесь для начала'}
                </p>
              </div>

              {/* Error */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
                >
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username (register only) */}
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label htmlFor="username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Имя пользователя
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        autoComplete="username"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                      />
                      <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pl-11 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all text-sm"
                    />
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-sm hover:from-emerald-400 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_rgba(16,245,181,0.25)] hover:shadow-[0_0_40px_rgba(16,245,181,0.35)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === 'login' ? t('auth.logging_in') : 'Создание...'}
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {mode === 'login' ? t('auth.login_button') : 'Зарегистрироваться'}
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-white/[0.06]" />
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">{t('auth.or')}</span>
                <div className="flex-1 border-t border-white/[0.06]" />
              </div>

              {/* Mode switch */}
              <div className="relative bg-black/30 rounded-xl p-1 border border-white/[0.06]">
                <div className="relative flex">
                  {/* Sliding indicator */}
                  <motion.div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-500/15 border border-emerald-500/25 rounded-lg"
                    initial={false}
                    animate={{ x: mode === 'login' ? 4 : 'calc(100% + 4px)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                  <button
                    onClick={() => setMode('login')}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      mode === 'login' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <LogIn className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                    Вход
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={`relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      mode === 'register' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                    Регистрация
                  </button>
                </div>
              </div>

              {/* Legal */}
              <p className="text-[11px] text-zinc-500 mt-5 text-center leading-relaxed">
                {t('legal.agree_prefix')}{' '}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2 transition-colors font-medium"
                >
                  {t('legal.terms')}
                </button>{' '}
                {t('auth.or')}{' '}
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2 transition-colors font-medium"
                >
                  {t('legal.privacy')}
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}