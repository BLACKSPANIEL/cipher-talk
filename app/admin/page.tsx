'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Users, Crown, AlertCircle, Sparkles, CheckCircle, Activity, BarChart3, Clock } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabaseClient';
import { TierBadge } from '@/components/chat/TierBadge';
import { useLanguage } from '@/lib/i18n';

interface AdminLog {
  id: string;
  admin_username: string;
  target_username: string;
  action: string;
  timestamp: string;
}

type AdminTab = 'users' | 'logs';

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const logsEndRef = useRef<HTMLDivElement>(null);

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
      setCurrentUser(me as Profile);

      const [usersRes, logsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('username'),
        supabase.from('admin_logs').select('*').order('timestamp', { ascending: false }).limit(200),
      ]);

      if (usersRes.data) setUsers(usersRes.data as Profile[]);
      if (logsRes.data) setLogs(logsRes.data as AdminLog[]);
      setIsLoading(false);
    })();
  }, [router]);

  // Stats
  const totalUsers = users.length;
  const totalPro = users.filter((u) => u.tier === 'pro').length;
  const totalElite = users.filter((u) => u.tier === 'elite').length;
  const totalAdmins = users.filter((u) => u.is_admin).length;

  const insertLog = async (targetUsername: string, action: string) => {
    const adminName = currentUser?.username || 'Unknown';
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_username: adminName,
        target_username: targetUsername,
        action,
      });
    if (error) {
      console.error('Failed to write admin log:', error);
      return;
    }
    // Optimistically add to local state
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        admin_username: adminName,
        target_username: targetUsername,
        action,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleSetTier = async (userId: string, tier: 'free' | 'pro' | 'elite', username: string) => {
    setUpdatingId(userId);
    await supabase
      .from('profiles')
      .update({ tier })
      .eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, tier } : u));
    const tierLabels: Record<string, string> = { free: 'FREE', pro: 'PRO', elite: 'ELITE' };
    await insertLog(username, `Изменил тариф на ${tierLabels[tier]}`);
    setUpdatingId(null);
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean, username: string) => {
    setUpdatingId(userId);
    await supabase
      .from('profiles')
      .update({ is_admin: !currentIsAdmin })
      .eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u));
    await insertLog(username, currentIsAdmin ? 'Снял права администратора' : 'Выдал права администратора');
    setUpdatingId(null);
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${mi}:${ss}`;
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
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{t('admin.title')}</h1>
              <p className="text-xs text-zinc-500">{t('admin.users')} · {totalUsers}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/chat')}
            className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-700/60 hover:text-white transition text-sm"
          >
            {t('common.back')} → Chat
          </button>
        </div>

        {/* ── Stats Dashboard ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: <Users className="w-4 h-4" />, label: t('admin.column.username') === 'Username' ? 'Users' : 'Пользователи', value: totalUsers, color: 'emerald' },
            { icon: <Sparkles className="w-4 h-4" />, label: 'PRO', value: totalPro, color: 'emerald' },
            { icon: <Crown className="w-4 h-4" />, label: 'ELITE', value: totalElite, color: 'amber' },
            { icon: <Shield className="w-4 h-4" />, label: 'Admins', value: totalAdmins, color: 'cyan' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl p-4"
              style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-zinc-500">{stat.icon}</div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 mb-4">
          {([
            { value: 'users' as AdminTab, label: t('admin.column.username') === 'Username' ? 'Пользователи' : 'Users', icon: <Users className="w-4 h-4" /> },
            { value: 'logs' as AdminTab, label: t('admin.column.username') === 'Username' ? 'Журнал аудита' : 'Audit Log', icon: <Activity className="w-4 h-4" /> },
          ]).map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.10)]'
                    : 'text-zinc-400 bg-zinc-800/40 border-zinc-800/60 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div
            className="rounded-2xl border border-zinc-800/80 backdrop-blur-xl overflow-hidden"
            style={{
              background: 'rgba(9, 9, 11, 0.4)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <div className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/30 text-xs uppercase tracking-wider text-zinc-500">
              <div className="col-span-2">{t('admin.column.username')}</div>
              <div className="col-span-2 hidden sm:block">{t('admin.column.id')}</div>
              <div>{t('admin.column.tier')}</div>
              <div>{t('admin.column.actions')}</div>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-6 gap-4 px-5 py-3 items-center hover:bg-zinc-800/20 transition text-sm">
                  <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{user.username}</span>
                      {user.is_admin && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] uppercase font-bold text-emerald-300">
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-600 truncate mt-0.5">{user.id.slice(0, 12)}…</p>
                  </div>
                  <div className="col-span-2 hidden sm:block text-zinc-400 text-xs truncate">{user.id}</div>
                  <div><TierBadge tier={user.tier ?? 'free'} size="sm" /></div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {updatingId === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleSetTier(user.id, 'pro', user.username)}
                          className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition text-[10px] font-bold"
                          title="Назначить PRO"
                        ><Sparkles className="w-3 h-3" /></button>
                        <button
                          onClick={() => handleSetTier(user.id, 'elite', user.username)}
                          className="p-1.5 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition text-[10px] font-bold"
                          title="Назначить ELITE"
                        ><Crown className="w-3 h-3" /></button>
                        <button
                          onClick={() => handleSetTier(user.id, 'free', user.username)}
                          className="px-2 py-1 rounded-lg text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700/50 transition text-[10px] uppercase"
                          title="Снять Premium"
                        >✕</button>
                        <button
                          onClick={() => handleToggleAdmin(user.id, !!user.is_admin, user.username)}
                          className={`p-1.5 rounded-lg transition border ${
                            user.is_admin ? 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20' : 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80'
                          }`}
                          title={user.is_admin ? t('admin.revoke_admin') : t('admin.grant_admin')}
                        ><CheckCircle className="w-3 h-3" /></button>
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
        )}

        {/* ── Audit Log Tab ── */}
        {activeTab === 'logs' && (
          <div
            className="rounded-2xl border border-zinc-800/80 backdrop-blur-xl overflow-hidden"
            style={{
              background: 'rgba(9, 9, 11, 0.4)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            {/* Log header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/30">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                {t('admin.column.username') === 'Username' ? 'Журнал аудита' : 'Audit Log'}
              </span>
              <span className="text-[10px] text-zinc-600 ml-auto">{logs.length} entries</span>
            </div>

            {/* Terminal-style log viewer */}
            <div className="max-h-[500px] overflow-y-auto p-4 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-zinc-600">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p>Нет записей в журнале</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 py-1.5 px-2 rounded hover:bg-zinc-800/30 transition">
                      <span className="text-zinc-600 flex-shrink-0">[{formatTimestamp(log.timestamp)}]</span>
                      <span className="text-emerald-400 flex-shrink-0">{log.admin_username}</span>
                      <span className="text-zinc-500 flex-shrink-0">→</span>
                      <span className="text-amber-300 flex-shrink-0">{log.target_username}</span>
                      <span className="text-zinc-400 break-all">{log.action}</span>
                    </div>
                  ))}
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}