'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Search, RefreshCw, ChevronDown, Crown, Ban, AlertTriangle, FileText, X, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { ROLES, type UserRole, canManageUser } from '@/lib/roles';

interface Profile {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  created_at?: string;
  banned_until?: string | null;
  ban_reason?: string | null;
}

interface LogEntry {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('user');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDays, setBanDays] = useState(7);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUserRole();
    fetchUsers();
  }, []);

  const showFeedback = useCallback((msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  }, []);

  const fetchCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role) setCurrentUserRole(profile.role as UserRole);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('id, username, email, role, created_at, banned_until, ban_reason').order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!canManageUser(currentUserRole, newRole)) return;
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) return showFeedback('Ошибка: ' + error.message);
    showFeedback(`Роль обновлена на ${ROLES[newRole].label}`);
    fetchUsers();
    logAction(userId, 'role_change: ' + newRole);
  };

  const banUser = async () => {
    if (!selectedUser) return;
    const until = banDays > 0 ? new Date(Date.now() + banDays * 86400000).toISOString() : null;
    const { error } = await supabase.from('profiles').update({ banned_until: until, ban_reason: banReason || null }).eq('id', selectedUser.id);
    if (error) return showFeedback('Ошибка бана: ' + error.message);
    showFeedback(`Пользователь ${selectedUser.username} забанен${banDays > 0 ? ' на ' + banDays + ' дн.' : ' навсегда'}`);
    setShowBanModal(false);
    setSelectedUser(null);
    setBanReason('');
    fetchUsers();
    logAction(selectedUser.id, 'banned: ' + (banDays > 0 ? banDays + 'd' : 'permanent') + ' — ' + banReason);
  };

  const unbanUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').update({ banned_until: null, ban_reason: null }).eq('id', userId);
    if (error) return showFeedback('Ошибка разбана');
    showFeedback('Пользователь разбанен');
    fetchUsers();
    logAction(userId, 'unbanned');
  };

  const logAction = async (targetUserId: string, action: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('admin_logs').insert({ admin_id: user.id, target_user_id: targetUserId, action });
  };

  const fetchLogs = async () => {
    const { data } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setLogs(data as LogEntry[]);
    setShowLogs(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isBanned = (user: Profile) => user.banned_until && new Date(user.banned_until) > new Date();
  const getRoleColor = (role: UserRole) => ROLES[role].color;
  const getRoleLabel = (role: UserRole) => ROLES[role].label;

  return (
    <div className="space-y-6 relative">
      {actionFeedback && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm backdrop-blur-xl">
          <CheckCircle className="w-4 h-4 inline mr-2" />
          {actionFeedback}
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(ROLES).map(([role, config]) => (
          <div key={role} className="relative p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] group hover:border-emerald-500/20 transition-all">
            <div className={`text-3xl font-bold ${config.color} mb-1`}>{users.filter(u => u.role === role).length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">{config.label}</div>
          </div>
        ))}
      </div>

      <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-emerald-400 transition text-sm">
        <FileText className="w-4 h-4" />
        Логи действий
      </button>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/30 transition" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as UserRole | 'all')} className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/30 transition">
          <option value="all">Все роли</option>
          {Object.entries(ROLES).map(([role, config]) => <option key={role} value={role}>{config.label}</option>)}
        </select>
        <button onClick={fetchUsers} className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-emerald-400 transition"><RefreshCw className="w-5 h-5" /></button>
      </div>

      <div className="rounded-3xl border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filteredUsers.map((user, index) => {
              const canEdit = canManageUser(currentUserRole, user.role);
              const banned = isBanned(user);
              return (
                <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                  className={'flex items-center gap-4 p-4 hover:bg-white/[0.02] transition group' + (banned ? ' opacity-60' : '')}>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center text-emerald-400 font-bold">{user.username.charAt(0).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white truncate">{user.username}</p>
                      <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ' + getRoleColor(user.role)}>{getRoleLabel(user.role)}</span>
                      {banned && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20">BANNED</span>}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    {banned && user.ban_reason && <p className="text-xs text-red-400/70 truncate mt-0.5">Причина: {user.ban_reason}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setSelectedUser(user); setShowBanModal(true); }} className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition" title="Забанить"><Ban className="w-4 h-4" /></motion.button>
                        {banned && <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => unbanUser(user.id)} className="p-2 rounded-xl text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition" title="Разбанить"><CheckCircle className="w-4 h-4" /></motion.button>}
                        <div className="relative">
                          <select value={user.role} onChange={e => updateUserRole(user.id, e.target.value as UserRole)} className="appearance-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 pr-8 text-xs text-white focus:outline-none focus:border-emerald-500/30 cursor-pointer">
                            {Object.entries(ROLES).filter(([role]) => canManageUser(currentUserRole, role as UserRole)).map(([role, config]) => <option key={role} value={role}>{config.label}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                        </div>
                      </>
                    )}
                    <div className="text-xs text-zinc-600">{new Date(user.created_at || '').toLocaleDateString('ru-RU')}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBanModal && selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowBanModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0a0f17] to-[#05070d] p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><Ban className="w-5 h-5 text-red-400" /> Бан пользователя</h3>
                  <button onClick={() => setShowBanModal(false)} className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">Заблокировать <strong className="text-white">{selectedUser.username}</strong>?</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Срок бана</label>
                    <select value={banDays} onChange={e => setBanDays(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/30">
                      <option value={1}>1 день</option>
                      <option value={3}>3 дня</option>
                      <option value={7}>7 дней</option>
                      <option value={30}>30 дней</option>
                      <option value={365}>1 год</option>
                      <option value={0}>Навсегда</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Причина</label>
                    <textarea value={banReason} onChange={e => setBanReason(e.target.value)} placeholder="Укажите причину бана..." className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/30 transition resize-none h-24" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowBanModal(false)} className="flex-1 py-3 rounded-2xl border border-white/[0.08] text-zinc-400 hover:text-white transition">Отмена</button>
                  <button onClick={banUser} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-400 transition">Забанить</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogs && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowLogs(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl max-h-[70vh] rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0a0f17] to-[#05070d] p-6 shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-400" /> Логи действий</h3>
                  <button onClick={() => setShowLogs(false)} className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"><X className="w-5 h-5" /></button>
                </div>
                {logs.length === 0 ? <p className="text-zinc-500 text-center py-10">Логов пока нет</p> : (
                  <div className="space-y-2">
                    {logs.map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-zinc-300 font-mono">{log.action}</p>
                          <p className="text-xs text-zinc-600 mt-1">{new Date(log.created_at).toLocaleString('ru-RU')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}