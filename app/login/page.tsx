'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { TermsModal } from '@/components/ui/TermsModal';
import { PrivacyModal } from '@/components/ui/PrivacyModal';
import { useLanguage } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage(t('auth.fill_all'));
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message === 'Invalid login credentials'
        ? t('auth.invalid_credentials')
        : error.message === 'Email not confirmed'
        ? t('auth.email_not_confirmed')
        : error.message
      );
      return;
    }

    // Successful login — redirect to chat + refresh for middleware sync
    router.push('/chat');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neon-green/10 bg-surface-darker/80">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-neon-green transition" />
          <span className="text-sm font-medium text-white group-hover:text-neon-green transition">
            Cipher Talk
          </span>
        </button>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-neon-green/5 rounded-2xl blur-xl" />

            {/* Card */}
            <div className="relative bg-surface-darker border border-neon-green/20 rounded-2xl p-8 backdrop-blur-xl">
              {/* Shield icon */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/20">
                  <Shield className="w-8 h-8 text-neon-green" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-white mb-1">
                {t('auth.login_title')}
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                {t('auth.login_subtitle')}
              </p>

              {/* Error message */}
              {errorMessage && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5"
                  >
                    {t('auth.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full bg-black/40 border border-neon-green/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5"
                  >
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
                      className="w-full bg-black/40 border border-neon-green/20 rounded-xl pl-4 pr-11 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-neon-green text-black font-semibold text-sm hover:bg-neon-dark-green disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('auth.logging_in')}
                    </>
                  ) : (
                    t('auth.login_button')
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-neon-green/10" />
                <span className="text-xs text-gray-600">{t('auth.or')}</span>
                <div className="flex-1 border-t border-neon-green/10" />
              </div>

              {/* Register link */}
              <p className="text-center text-sm text-gray-500">
                {t('auth.no_account')}{' '}
                <button
                  onClick={() => router.push('/register')}
                  className="text-neon-green hover:text-neon-dark-green transition font-medium"
                >
                  {t('auth.register_link')}
                </button>
              </p>

              {/* Legal notice */}
              <p className="text-xs text-zinc-500 mt-4 text-center leading-relaxed">
                {t('legal.agree_prefix')}{' '}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors font-medium"
                >
                  {t('legal.terms')}
                </button>{' '}
                {t('auth.or')}{' '}
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors font-medium"
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