import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Клиент для браузера — корректно синхронизирует куки с SSR middleware
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Тип сообщения — соответствует таблице messages
export interface DbMessage {
  id: string;
  created_at: string;
  room_id: string;
  sender_id: string;
  text: string;
  cipher_type: string;
}

/** Role-Based Access Control roles */
export type UserRole = 'owner' | 'super_admin' | 'admin' | 'moderator' | 'helper' | 'user';

/** Role hierarchy weight (higher = more powerful) */
export const ROLE_WEIGHT: Record<UserRole, number> = {
  owner: 5,
  super_admin: 4,
  admin: 3,
  moderator: 2,
  helper: 1,
  user: 0,
};

/** Can `actor` perform action on `target`? */
export function canAct(actorRole: UserRole, targetRole: UserRole, action: 'change_role' | 'change_tier' | 'view_logs'): boolean {
  const aw = ROLE_WEIGHT[actorRole];
  const tw = ROLE_WEIGHT[targetRole];
  if (action === 'view_logs') return aw >= ROLE_WEIGHT.moderator;
  if (action === 'change_tier') return aw > tw;
  if (action === 'change_role') {
    if (actorRole === 'owner') return true;
    if (actorRole === 'super_admin') return targetRole === 'admin' || targetRole === 'moderator' || targetRole === 'helper' || targetRole === 'user';
    if (actorRole === 'admin') return targetRole === 'moderator' || targetRole === 'helper' || targetRole === 'user';
    return false;
  }
  return false;
}

// Тип профиля — соответствует таблице profiles
export interface Profile {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  created_at: string;
  avatar_url?: string | null;
  /** Отображаемое имя пользователя */
  display_name?: string | null;
  /** Описание профиля */
  bio?: string | null;
  /** Tier подписки: free / pro / elite. Только для чтения для самого пользователя. */
  tier?: 'free' | 'pro' | 'elite';
  /** Role-Based Access Control: owner | admin | moderator | user */
  role?: UserRole;
  /** Legacy flag —PRECATED, use role instead. Kept for backward compat. */
  is_admin?: boolean;
}
