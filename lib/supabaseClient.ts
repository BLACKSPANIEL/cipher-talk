import { createClient } from '@supabase/supabase-js';

// Эти переменные должны быть определены в .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Тип сообщения — соответствует таблице messages
export interface DbMessage {
  id: string;
  created_at: string;
  room_id: string;
  sender_id: string;   // UUID пользователя из auth.users
  text: string;
  cipher_type: string;
}

// Тип профиля — соответствует таблице profiles
export interface Profile {
  id: string;           // совпадает с auth.users.id
  username: string;
  status: 'online' | 'offline' | 'away';
  created_at: string;
}