import { createClient } from '@supabase/supabase-js';

// Эти переменные должны быть определены в .env.local
// Создайте проект в Supabase и скопируйте URL и Anon Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Тип сообщения, который соответствует структуре таблицы Supabase
export interface DbMessage {
  id: string;          // uuid — генерируется базой данных
  created_at: string;  // timestamp — генерируется базой данных
  room_id: string;     // text — идентификатор комнаты
  sender: string;      // text — 'me' или 'other'
  text: string;        // text — содержимое сообщения (может быть зашифрованным)
  cipher_type: string; // text — 'none' | 'caesar' | 'base64'
}