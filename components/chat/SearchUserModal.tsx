'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ProfileRow {
  id: string;
  username: string;
  status?: string;
  avatar_url?: string | null;
}

interface SearchUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string | null;
  onStartChat: (otherUser: ProfileRow) => void | Promise<void>;
}

export function SearchUserModal({ isOpen, onClose, currentUserId, onStartChat }: SearchUserModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfileRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // focus input when opened
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search by username
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const handle = setTimeout(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, status, avatar_url')
        .ilike('username', `%${trimmed}%`)
        .limit(20);
      if (!error && data) {
        setResults(data.filter((p) => p.id !== currentUserId));
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(handle);
  }, [query, currentUserId, isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleSelect = async (user: ProfileRow) => {
    setCreating(user.id);
    try {
      await onStartChat(user);
      onClose();
    } finally {
      setCreating(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/85 backdrop-blur-2xl shadow-glass-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-neon-green" />
                <h3 className="font-semibold text-white text-base">Новый чат</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search input */}
            <div className="p-4 border-b border-zinc-800/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по nickname..."
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-neon-green/50 focus:bg-zinc-800/80 transition"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green animate-spin" />
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 px-1">
                Введите nickname пользователя из таблицы <span className="text-zinc-400">profiles</span>
              </p>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {query.trim() === '' ? (
                <div className="text-center py-10 px-4">
                  <Search className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-zinc-500 text-sm">Начните вводить nickname</p>
                </div>
              ) : results.length === 0 && !isSearching ? (
                <div className="text-center py-10 px-4">
                  <p className="text-zinc-500 text-sm">Пользователи не найдены</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => handleSelect(user)}
                        disabled={creating === user.id}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/60 transition text-left disabled:opacity-50"
                      >
                        <div className="w-9 h-9 rounded-full bg-neon-green/15 flex items-center justify-center flex-shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-neon-green">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user.username}</p>
                          {user.status && (
                            <p className="text-xs text-zinc-500 capitalize">{user.status}</p>
                          )}
                        </div>
                        {creating === user.id ? (
                          <Loader2 className="w-4 h-4 text-neon-green animate-spin" />
                        ) : (
                          <MessageCircle className="w-4 h-4 text-zinc-500 group-hover:text-neon-green" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
