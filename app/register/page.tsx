'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { TermsModal } from '@/components/ui/TermsModal';
import { PrivacyModal } from '@/components/ui/PrivacyModal';
import { useLanguage } from '@/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage(t('auth.fill_all'));
      return;
    }

    if (username.trim().length < 2) {
      setErrorMessage(t('auth.username_min'));
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t('auth.password_min'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('auth.passwords_mismatch'));
      return;
    }

    setIsLoading(true);

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
      setErrorMessage(error.message === 'User already registered'
        ? t('auth.user_exists')
        : error.message
      );
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#05070d] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute -inset-1 bg-emerald-500/5 rounded-2xl blur-xl" />
              <div className="relative bg-[#0a0f17] border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('auth.register_success')}</h2>
                <p className="text-sm text-gray-400">
                  {t('auth.register_success_desc', { email })}
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all mt-4"
                >
                  {t('auth.go_to_login')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-500/10 bg-[#0a0f17]/80">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition" />
          <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition">
            Cipher Talk
          </span>
        </button>
      </div>

      {/* Register card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500/5 rounded-2xl blur-xl" />
            <div className="relative bg-[#0a0f17] border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-white mb-1">
                {t('auth.register_title')}
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                {t('auth.register_subtitle')}
              </p>

              {errorMessage && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Username */}
                <div>
                  <label htmlFor="reg-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    {t('auth.username')}
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="cyber_user"
                    autoComplete="username"
                    className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    {t('auth.email')}
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.password_placeholder')}
                      autoComplete="new-password"
                      className="w-full bg-black/40 border border-emerald-500/20 rounded-xl pl-4 pr-11 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    {t('auth.confirm_password')}
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('auth.creating')}
                    </>
                  ) : (
                    t('auth.register_button')
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-emerald-500/10" />
                <span className="text-xs text-gray-600">{t('auth.or')}</span>
                <div className="flex-1 border-t border-emerald-500/10" />
              </div>

              <p className="text-center text-sm text-gray-500">
                {t('auth.has_account')}{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-emerald-400 hover:text-emerald-300 transition font-medium"
                >
                  {t('auth.login_link')}
                </button>
              </p>

              {/* Legal notice */}
               <p className="text-xs text-zinc-500 mt-4 text-center leading-relaxed">
                 Регистрируясь, вы соглашаетесь с{' '}
                 <button
                   type="button"
                   onClick={() => setIsTermsOpen(true)}
                   className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors font-medium"
                 >
                   Правилами использования
                 </button>{' '}
                 и{' '}
                 <button
                   type="button"
                   onClick={() => setIsPrivacyOpen(true)}
                   className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors font-medium"
                 >
                   Политикой конфиденциальности
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