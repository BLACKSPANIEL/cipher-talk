'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Заполните все поля');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Пароль должен быть не менее 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message === 'User already registered'
        ? 'Пользователь с таким email уже существует'
        : error.message
      );
      return;
    }

    // Успешная регистрация
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-black flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute -inset-1 bg-neon-green/5 rounded-2xl blur-xl" />
              <div className="relative bg-surface-darker border border-neon-green/20 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/20 mx-auto">
                  <CheckCircle className="w-8 h-8 text-neon-green" />
                </div>
                <h2 className="text-xl font-bold text-white">Регистрация успешна!</h2>
                <p className="text-sm text-gray-400">
                  Мы отправили письмо с подтверждением на <strong className="text-white">{email}</strong>.
                  Перейдите по ссылке в письме, чтобы активировать аккаунт.
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-green text-black font-semibold hover:bg-neon-dark-green transition-all mt-4"
                >
                  Перейти к входу
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Register card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute -inset-1 bg-neon-green/5 rounded-2xl blur-xl" />
            <div className="relative bg-surface-darker border border-neon-green/20 rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/20">
                  <Shield className="w-8 h-8 text-neon-green" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-white mb-1">
                Создать аккаунт
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                Защищённая регистрация в Cipher Talk
              </p>

              {errorMessage && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full bg-black/40 border border-neon-green/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Пароль
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Минимум 6 символов"
                      autoComplete="new-password"
                      className="w-full bg-black/40 border border-neon-green/20 rounded-xl pl-4 pr-11 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition text-sm"
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
                    Подтвердите пароль
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full bg-black/40 border border-neon-green/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/50 transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-neon-green text-black font-semibold text-sm hover:bg-neon-dark-green disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    'Создать аккаунт'
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-neon-green/10" />
                <span className="text-xs text-gray-600">или</span>
                <div className="flex-1 border-t border-neon-green/10" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Уже есть аккаунт?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-neon-green hover:text-neon-dark-green transition font-medium"
                >
                  Войти
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}