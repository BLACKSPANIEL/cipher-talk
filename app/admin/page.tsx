'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Users, Crown, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { TierBadge } from '@/components/chat/TierBadge';
import { useLanguage } from '@/lib/i18n';

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: me } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!me || !(me as any).is_admin) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (allUsers) setUsers(allUsers as Profile[]);
      setIsLoading(false);
    })();
  }, [router]);

  const handleSetTier = async (userId: string, tier: 'free' | 'pro' | 'elite') => {
    setUpdatingId(userId);
    await supabase
      .from('profiles')
      .update({ tier })
      .eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, tier } : u));
    setUpdatingId(null);
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    setUpdatingId(userId);
    await supabase
      .from('profiles')
      .update({ is_admin: !currentIsAdmin })
      .eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u));
    setUpdatingId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-950/40 mx-auto"
            style={{ boxShadow: '0 0 40px rgba(239,68,68,0.25)' }}
          >
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('admin.access_denied')}</h1>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto">{t('admin.access_denied_desc')}</p>
          <button
            onClick={() => router.push('/chat')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition text-sm"
          >
            {t('common.back')} → Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-neon-green/[0.06] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-emerald-500/[0.05] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{t('admin.title')}</h1>
              <p className="text-xs text-zinc-500">{t('admin.users')} · {users.length}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/chat')}
            className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-700/60 hover:text-white transition text-sm"
          >
            {t('common.back')} → Chat
          </button>
        </div>

        {/* Users table — glassmorphism card */}
        <div
          className="rounded-2xl border border-zinc-800/80 backdrop-blur-xl overflow-hidden"
          style={{
            background: 'rgba(9, 9, 11, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/30 text-xs uppercase tracking-wider text-zinc-500">
            <div className="col-span-2">{t('admin.column.username')}</div>
            <div className="col-span-2 hidden sm:block">{t('admin.column.email')}</div>
            <div>{t('admin.column.tier')}</div>
            <div>{t('admin.column.actions')}</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-800/50">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-6 gap-4 px-5 py-3 items-center hover:bg-zinc-800/20 transition text-sm"
              >
                {/* Username + Admin badge */}
                <div className="col-span-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">{user.username}</span>
                    {user.is_admin && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] uppercase font-bold text-emerald-300">
                        <Shield className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-600 truncate mt-0.5">{user.id.slice(0, 12)}…</p>
                </div>

                {/* Email */}
                <div className="col-span-2 hidden sm:block text-zinc-400 text-xs truncate">
                  {user.id}
                </div>

                {/* Tier badge */}
                <div>
                  <TierBadge tier={user.tier ?? 'free'} size="sm" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {updatingId === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
                  ) : (
                    <>
                      {/* Tier buttons */}
                      <button
                        onClick={() => handleSetTier(user.id, 'pro')}
                        className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition text-[10px] font-bold"
                        title="Назначить PRO"
                      >
                        <Sparkles className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleSetTier(user.id, 'elite')}
                        className="p-1.5 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition text-[10px] font-bold"
                        title="Назначить ELITE"
                      >
                        <Crown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleSetTier(user.id, 'free')}
                        className="px-2 py-1 rounded-lg text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700/50 transition text-[10px] uppercase"
                        title="Снять Premium"
                      >
                        ✕
                      </button>
                      {/* Admin toggle */}
                      <button
                        onClick={() => handleToggleAdmin(user.id, !!user.is_admin)}
                        className={`p-1.5 rounded-lg transition border ${
                          user.is_admin
                            ? 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                            : 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80'
                        }`}
                        title={user.is_admin ? t('admin.revoke_admin') : t('admin.grant_admin')}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="py-12 text-center text-zinc-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm">Нет зарегистрированных пользователей</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}