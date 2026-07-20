-- ============================================================
-- Cipher Talk — E2EE Key Exchange & Storage Setup
-- Выполните этот SQL в Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. Таблица публичных ключей пользователей
-- ============================================================
CREATE TABLE IF NOT EXISTS user_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  key_type TEXT NOT NULL DEFAULT 'ECDH-P256',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, key_type)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_user_keys_user_id ON user_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_keys_key_type ON user_keys(key_type);

-- RLS
ALTER TABLE user_keys ENABLE ROW LEVEL SECURITY;

-- Политики
CREATE POLICY "Users can view public keys" ON user_keys
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own keys" ON user_keys
  FOR ALL USING (user_id = auth.uid());

-- Trigger для updated_at
CREATE OR REPLACE FUNCTION update_user_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_keys_updated_at ON user_keys;
CREATE TRIGGER trigger_user_keys_updated_at
  BEFORE UPDATE ON user_keys
  FOR EACH ROW EXECUTE FUNCTION update_user_keys_updated_at();

-- ============================================================
-- 2. Таблица typing indicators
-- ============================================================
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_typing_indicators_room_id ON typing_indicators(room_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_user_id ON typing_indicators(user_id);

ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view typing indicators in their rooms" ON typing_indicators
  FOR SELECT USING (
    room_id IN (
      SELECT room_id FROM room_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own typing status" ON typing_indicators
  FOR ALL USING (user_id = auth.uid());

-- Auto-cleanup old typing indicators
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM typing_indicators
  WHERE updated_at < NOW() - INTERVAL '30 seconds';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cleanup_typing ON typing_indicators;
CREATE TRIGGER trigger_cleanup_typing
  AFTER INSERT OR UPDATE ON typing_indicators
  FOR EACH ROW EXECUTE FUNCTION cleanup_old_typing_indicators();

-- ============================================================
-- 3. Дополнительные индексы для производительности
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================================
-- 4. Realtime: включение для новых таблиц
-- ============================================================
-- Включите Realtime для этих таблиц в Supabase Dashboard:
-- Database → Replication → Edit
-- - user_keys
-- - typing_indicators
-- - message_status

-- ============================================================
-- ГОТОВО!
-- После выполнения:
-- 1. Публичные ключи будут храниться в user_keys
-- 2. Typing indicators будут работать через Realtime
-- 3. Все индексы созданы для быстрой работы
-- ============================================================

</parameter>
<task_progress>
- [x] Изучить текущую структуру БД и SQL миграции
- [ ] Проверить/улучшить Realtime логику
- [ ] Проверить/улучшить E2EE реализацию
- [ ] Проверить/добавить RLS и индексы
- [ ] Добавить/улучшить серверные функции
- [ ] Добавить документацию по E2EE
- [ ] npm run build + коммит + push
</parameter>
</write_to_file>