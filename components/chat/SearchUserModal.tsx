'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, Loader2, MessageCircle, AtSign, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useLanguage } from '@/lib/i18n';

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

function rankResults(query: string, rows: ProfileRow[]): ProfileRow[] {
  const q = query.toLowerCase();
  return [...rows].sort((a, b) => {
    const aName = a.username.toLowerCase();
    const bName = b.username.toLowerCase();
    const score = (name: string) => {
      if (name === q) return 0;
      if (name.startsWith(q)) return 1;
      if (name.includes(q)) return 2;
      return 3;
    };
    const diff = score(aName) - score(bName);
    if (diff !== 0) return diff;
    return aName.localeCompare(bName);
  });
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-emerald-300 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

function UserAvatar({ user }: { user: ProfileRow }) {
  const isImage = user.avatar_url && (user.avatar_url.startsWith('data:') || user.avatar_url.startsWith('http'));
  const isEmoji = user.avatar_url && !isImage;

  if (isImage) {
    return (
      <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 flex-shrink-0">
        <img src={user.avatar_url!} alt={user.username} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (isEmoji) {
    return (
      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <span className="text-base leading-none">{user.avatar_url}</span>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 ring-1 ring-emerald-500/25 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-emerald-300">{user.username.charAt(0).toUpperCase()}</span>
    </div>
  );
}

/** Skeleton loader for search results */
function SearchSkeleton() {
  return (
    <div className="space-y-0.5 px-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 rounded-md bg-white/[0.06]" />
            <div className="h-2.5 w-16 rounded-md bg-white/[0.04]" />
          </div>
          <div className="w-4 h-4 rounded-md bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

export function SearchUserModal({ isOpen, onClose, currentUserId, onStartChat }: SearchUserModalProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfileRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the query with 300ms delay to avoid spamming Supabase
  const debouncedQuery = useDebounce(query.trim(), 300);

  const sortedResults = useMemo(() => rankResults(debouncedQuery, results), [debouncedQuery, results]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Search effect — uses debouncedQuery to avoid excessive API calls
  useEffect(() => {
    if (!isOpen) return;
    if (!debouncedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const searchUsers = async () => {
      const escaped = debouncedQuery.replace(/[%_]/g, '\\$&');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, status, avatar_url')
        .or(`username.ilike.${escaped}%,username.ilike.%${escaped}%`)
        .limit(24);

      if (cancelled) return;

      if (!error && data) {
        setResults(data.filter((p) => p.id !== currentUserId));
      } else {
        setResults([]);
      }
      setIsSearching(false);
    };

    searchUsers();

    return () => { cancelled = true; };
  }, [debouncedQuery, currentUserId, isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Realtime subscription for user status updates (online/offline)
  useEffect(() => {
    if (!isOpen || results.length === 0) return;

    const userIds = results.map((r) => r.id);
    const channel = supabase
      .channel('search-user-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=in.(${userIds.join(',')})` },
        (payload) => {
          const updated = payload.new as ProfileRow;
          setResults((prev) =>
            prev.map((u) => (u.id === updated.id ? { ...u, status: updated.status } : u))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, results.length]);

  const handleSelect = useCallback(async (user: ProfileRow) => {
    setCreating(user.id);
    try {
      await onStartChat(user);
      onClose();
    } finally {
      setCreating(null);
    }
  }, [onStartChat, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(12,18,26,0.95) 0%, rgba(6,10,16,0.98) 100%)',
              boxShadow: '0 -24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,245,181,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
              border: '1px solid rgba(16,245,181,0.12)',
              borderBottom: 'none',
            }}
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-400/10 blur-3xl" />

            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,245,181,0.15), rgba(6,182,212,0.08))',
                    boxShadow: '0 0 20px rgba(16,245,181,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                    border: '1px solid rgba(16,245,181,0.25)',
                  }}
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16,245,181,0.6))' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-[15px] leading-tight">{t('search.title')}</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{t('search.hint')}</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                title={t('common.close')}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative px-4 sm:px-5 py-3 border-b border-white/[0.06]">
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-10 py-2.5 text-white text-[13px] placeholder-zinc-600 focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] transition-colors"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[min(52vh,320px)] sm:max-h-80 overflow-y-auto overscroll-contain px-2 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <AnimatePresence mode="wait">
                {debouncedQuery === '' ? (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 px-4"
                  >
                    <div
                      className="w-11 h-11 mx-auto mb-2.5 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'rgba(16,245,181,0.06)',
                        border: '1px solid rgba(16,245,181,0.12)',
                        boxShadow: 'inset 0 0 20px rgba(16,245,181,0.04)',
                      }}
                    >
                      <Users className="w-5 h-5 text-emerald-500/50" />
                    </div>
                    <p className="text-zinc-400 text-[13px] font-medium">{t('search.empty_start')}</p>
                    <p className="text-zinc-600 text-[10px] mt-1">{t('search.hint')}</p>
                  </motion.div>
                ) : isSearching && sortedResults.length === 0 ? (
                  /* Skeleton loader while searching */
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SearchSkeleton />
                  </motion.div>
                ) : sortedResults.length === 0 && !isSearching ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 px-4"
                  >
                    <p className="text-zinc-400 text-[13px]">{t('search.empty_results')}</p>
                    <p className="text-zinc-600 text-[10px] mt-1">{t('search.hint')}</p>
                  </motion.div>
                ) : (
                  <motion.ul
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-0.5"
                  >
                    {sortedResults.map((user, i) => {
                      const isOnline = user.status === 'online';
                      return (
                        <motion.li
                          key={user.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.22 }}
                        >
                          <motion.button
                            whileTap={{ scale: 0.985 }}
                            onClick={() => handleSelect(user)}
                            disabled={creating === user.id}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors text-left disabled:opacity-50 group"
                          >
                            <div className="relative">
                              <UserAvatar user={user} />
                              {isOnline && (
                                <span
                                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0a0f17]"
                                  style={{ boxShadow: '0 0 6px rgba(16,245,181,0.8)' }}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-zinc-100 truncate">
                                {highlightMatch(user.username, debouncedQuery)}
                              </p>
                              {user.status && (
                                <p className={`text-[10px] capitalize mt-px ${isOnline ? 'text-emerald-400/80' : 'text-zinc-500'}`}>
                                  {user.status}
                                </p>
                              )}
                            </div>
                            {creating === user.id ? (
                              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
                            ) : (
                              <MessageCircle className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                            )}
                          </motion.button>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}