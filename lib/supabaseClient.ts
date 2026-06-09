import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

// Тип профиля — соответствует таблице profiles
export interface Profile {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  created_at: string;
  avatar_url?: string | null;
  /** Tier подписки: free / pro / elite. Только для чтения для самого пользователя. */
  tier?: 'free' | 'pro' | 'elite';
  /** Флаг администратора. Назначается другим админом через /admin. */
  is_admin?: boolean;
}
