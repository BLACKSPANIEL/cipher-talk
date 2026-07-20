'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Search, RefreshCw, ChevronDown, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { ROLES, type UserRole, canManageUser } from '@/lib/roles';

interface Profile {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  created_at?: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('user');

  useEffect(() => {
    fetchCurrentUserRole();
    fetchUsers();
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
    const { data } = await supabase
      .from('profiles')
      .select('id, username, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!canManageUser(currentUserRole, newRole)) return;
    
    await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    fetchUsers();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: UserRole) => ROLES[role].color;
  const getRoleLabel = (role: UserRole) => ROLES[role].label;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(ROLES).map(([role, config]) => {
          const count = users.filter(u => u.role === role).length;
          return (
            <div key={role} className="relative p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] overflow-hidden group hover:border-emerald-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className={`text-3xl font-bold ${config.color} mb-1`}>{count}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{config.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск пользователей..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/30 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500/30 transition"
        >
          <option value="all">Все роли</option>
          {Object.entries(ROLES).map(([role, config]) => (
            <option key={role} value={role}>{config.label}</option>
          ))}
        </select>
        <button
          onClick={fetchUsers}
          className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/20 transition"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filteredUsers.map((user, index) => {
              const canEdit = canManageUser(currentUserRole, user.role);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center text-emerald-400 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{user.username}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>

                  {canEdit && (
                    <div className="relative">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="appearance-none bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 pr-8 text-xs text-white focus:outline-none focus:border-emerald-500/30 cursor-pointer"
                      >
                        {Object.entries(ROLES)
                          .filter(([role]) => canManageUser(currentUserRole, role as UserRole))
                          .map(([role, config]) => (
                            <option key={role} value={role}>{config.label}</option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                    </div>
                  )}

                  <div className="text-xs text-zinc-600">
                    {new Date(user.created_at || '').toLocaleDateString('ru-RU')}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}