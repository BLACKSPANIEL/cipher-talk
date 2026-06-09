-- Таблица журнала аудита админ-действий CipherTalk
-- Запустите этот SQL в Supabase SQL Editor (Dashboard → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS admin_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_username   text  NOT NULL,
  target_username  text  NOT NULL,
  action           text  NOT NULL,
  timestamp        timestamptz DEFAULT now()
);

-- Индекс для быстрого поиска по времени (новые записи вверх)
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs (timestamp DESC);

-- RLS: только авторизованные пользователи могут читать, записывать — только через service role
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Разрешаем чтение всем залогиненным (для журнала в UI)
CREATE POLICY "Authenticated users can read admin_logs"
  ON admin_logs FOR SELECT
  TO authenticated
  USING (true);

-- Вставка идёт через клиент (anon key) — разрешаем authenticated
CREATE POLICY "Authenticated users can insert admin_logs"
  ON admin_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);