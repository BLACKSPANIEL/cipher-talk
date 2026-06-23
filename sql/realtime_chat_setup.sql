-- ============================================================
-- Cipher Talk — Realtime Chat & E2EE Setup
-- Выполните этот SQL в Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Убедимся что extension для UUID доступна
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. Таблица статусов сообщений (read receipts)
-- ============================================================
CREATE TABLE IF NOT EXISTS message_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'sent', -- sent | delivered | read
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_message_status_message_id ON message_status(message_id);
CREATE INDEX IF NOT EXISTS idx_message_status_user_id ON message_status(user_id);
CREATE INDEX IF NOT EXISTS idx_message_status_status ON message_status(status);

-- RLS
ALTER TABLE message_status ENABLE ROW LEVEL SECURITY;

-- Policy: пользователи могут управлять статусами сообщений в своих чатах
CREATE POLICY "Users can manage message status in their rooms" ON message_status
  FOR ALL USING (
    user_id = auth.uid() AND
    message_id IN (
      SELECT m.id FROM messages m
      JOIN room_members rm ON m.room_id = rm.room_id
      WHERE rm.user_id = auth.uid()
    )
  );

-- Trigger для auto-update updated_at
CREATE OR REPLACE FUNCTION update_message_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_message_status_updated_at ON message_status;
CREATE TRIGGER trigger_message_status_updated_at
  BEFORE UPDATE ON message_status
  FOR EACH ROW EXECUTE FUNCTION update_message_status_updated_at();

-- ============================================================
-- 3. Добавляем поля в messages для read receipts
-- ============================================================
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Индекс для сортировки
CREATE INDEX IF NOT EXISTS idx_messages_room_created ON messages(room_id, created_at);

-- ============================================================
-- 4. Presence / Online status (используем Supabase Realtime Presence)
-- ============================================================
-- Presence работает через Realtime API, отдельная таблица не нужна.
-- Достаточно channel с config: { presence: { key: userId } }

-- ============================================================
-- 5. Функция: автоматически отмечаем сообщение как delivered
-- ============================================================
CREATE OR REPLACE FUNCTION mark_message_delivered()
RETURNS TRIGGER AS $$
BEGIN
  -- Отмечаем доставку для получателя
  INSERT INTO message_status (message_id, user_id, status)
  SELECT NEW.id, rm.user_id, 'delivered'
  FROM room_members rm
  WHERE rm.room_id = NEW.room_id
    AND rm.user_id != NEW.sender_id
    AND NOT EXISTS (
      SELECT 1 FROM message_status ms
      WHERE ms.message_id = NEW.id AND ms.user_id = rm.user_id
    )
  ON CONFLICT (message_id, user_id) DO NOTHING;

  -- Обновляем delivered_at в самом сообщении
  UPDATE messages SET delivered_at = NOW() WHERE id = NEW.id AND delivered_at IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mark_delivered ON messages;
CREATE TRIGGER trigger_mark_delivered
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION mark_message_delivered();

-- ============================================================
-- 6. Функция: автоматически отмечаем как read при получении
-- ============================================================
CREATE OR REPLACE FUNCTION mark_message_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'read' AND OLD.status != 'read' THEN
    UPDATE messages SET read_at = NOW() WHERE id = NEW.message_id AND read_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mark_read ON message_status;
CREATE TRIGGER trigger_mark_read
  AFTER UPDATE OF status ON message_status
  FOR EACH ROW WHEN (NEW.status = 'read')
  EXECUTE FUNCTION mark_message_read();

-- ============================================================
-- 7. RLS Policies для messages (убедимся что всё работает)
-- ============================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Пользователи видят сообщения только из своих комнат
CREATE POLICY "Users can view messages in their rooms" ON messages
  FOR SELECT USING (
    room_id IN (
      SELECT room_id FROM room_members WHERE user_id = auth.uid()
    )
  );

-- Пользователи могут отправлять сообщения в свои комнаты
CREATE POLICY "Users can insert messages in their rooms" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    room_id IN (
      SELECT room_id FROM room_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- 8. Seed: тестовые данные (опционально)
-- ============================================================
-- INSERT INTO profiles (id, username, status, created_at)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001', 'TestUser', 'online', NOW())
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ГОТОВО!
-- После выполнения этого SQL:
-- 1. Realtime сообщения будут работать
-- 2. Read receipts (статусы прочитанности) будут сохраняться
-- 3. Online presence будет работать через Supabase Realtime Presence
-- ============================================================