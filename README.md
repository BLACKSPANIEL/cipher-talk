# Cipher Talk 🔐

**Премиальный приватный мессенджер с E2EE шифрованием**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-green)](https://supabase.com/)
[![Tauri](https://img.shields.io/badge/Tauri-Desktop-yellow)](https://tauri.app/)

---

## ✨ Возможности

### 🔒 Безопасность
- **E2EE шифрование** — AES-256-GCM для сообщений
- **ECDH P-256** — обмен ключами между пользователями
- **Zero-knowledge архитектура** — мы не читаем ваши сообщения
- **Самодеструкция сообщений** (опционально)

### 💬 Чат
- **Realtime сообщения** через Supabase
- **Typing indicators** — "печатает..."
- **Read receipts** — статусы прочитанности
- **Online presence** — онлайн статус пользователей
- **Несколько шифров** — Caesar, Base64 (для демонстрации)

### 🎨 Дизайн
- **Glassmorphism** — стеклянные панели с blur
- **Neon акценты** — emerald/cyan/violet
- **Адаптивный UI** — mobile + desktop
- **Плавные анимации** — Framer Motion

### 🖥️ Платформы
- **Web** — Next.js 15
- **Desktop** — Tauri (Windows, macOS, Linux)
- **Android** — Tauri Mobile (в разработке)

---

## 🚀 Быстрый старт

### Требования
- Node.js 20+
- npm или pnpm
- Git

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/BLACKSPANIEL/cipher-talk.git
cd cipher-talk

# 2. Установите зависимости
npm install

# 3. Настройте переменные окружения
cp .env.example .env.local
# Отредактируйте .env.local — добавьте Supabase credentials

# 4. Запустите dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Конфигурация

### 1. Supabase Setup

Создайте проект в [Supabase](https://supabase.com/) и выполните SQL миграции:

```bash
# Выполните в Supabase Dashboard → SQL Editor:
# 1. sql/admin_logs.sql — базовая схема
# 2. sql/realtime_chat_setup.sql — Realtime чат
```

### 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🏗️ Структура проекта

```
cipher-talk/
├── app/                      # Next.js App Router
│   ├── chat/                 # Чат страница
│   ├── settings/             # Настройки
│   ├── login/                # Авторизация
│   └── page.tsx              # Landing page
├── components/               # React компоненты
│   ├── chat/                 # Чат компоненты
│   │   ├── MessageBubble.tsx
│   │   ├── ChatWindow.tsx
│   │   └── Sidebar.tsx
│   └── settings/             # Компоненты настроек
├── lib/                      # Утилиты
│   ├── cryptoUtils.ts        # E2EE шифрование
│   ├── ciphers.ts            # Caesar, Base64
│   └── supabaseClient.ts     # Supabase клиент
├── stores/                   # Zustand stores
├── sql/                      # SQL миграции
│   ├── admin_logs.sql
│   └── realtime_chat_setup.sql
├── src-tauri/                # Tauri Desktop
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   └── tauri.conf.json
├── docs/                     # Документация
│   └── ANDROID_PLAN.md
└── .github/workflows/        # CI/CD
    └── desktop-build.yml
```

---

## 🔧 Сборка

### Web (Production)

```bash
npm run build
npm start
```

### Desktop (Tauri)

```bash
# Установите Tauri CLI
cargo install tauri-cli

# Development
cd src-tauri
cargo tauri dev

# Production сборка
cargo tauri build
```

**Готовые сборки:**
- Windows: `src-tauri/target/release/CipherTalk.exe`
- macOS: `src-tauri/target/release/bundle/dmg/CipherTalk.dmg`
- Linux: `src-tauri/target/release/bundle/appimage/CipherTalk.AppImage`

### GitHub Releases (Автоматически)

```bash
# 1. Создайте тег
git tag v0.1.0
git push origin v0.1.0

# 2. GitHub Actions автоматически:
#    - Соберёт .exe, .dmg, .AppImage
#    - Создаст Release с артефактами
```

---

## 🔐 E2EE Архитектура

### Уровни шифрования:

1. **AES-256-GCM** — симметричное шифрование сообщений
   - Ключ хранится в localStorage (web) / secure storage (desktop)
   - Автоматически генерируется при первом запуске

2. **ECDH P-256** — асимметричный обмен ключами
   - Каждый пользователь имеет пару ключей (public/private)
   - Shared secret вычисляется на клиенте

3. **Caesar / Base64** — видимый слой шифрования
   - Для демонстрации работы шифрования
   - Может быть расширен

### Flow:

```
User A → Шифрует сообщение → AES-256-GCM → Base64(IV + Ciphertext)
     ↓
User B → Получает ciphertext → Дешифрует AES-256-GCM → Читает сообщение
```

---

## 📱 Android (в разработке)

См. [docs/ANDROID_PLAN.md](docs/ANDROID_PLAN.md)

**План:**
- Tauri Mobile (общий код с Desktop)
- 2 недели разработки
- ~8 MB APK

---

## 🧪 Тестирование

```bash
# Unit тесты
npm test

# E2E тесты
npm run test:e2e

# Линтинг
npm run lint
```

---

## 📦 Скрипты

```bash
npm run dev          # Development сервер
npm run build        # Production сборка
npm start            # Запуск production
npm run lint         # ESLint
npm run type-check   # TypeScript проверка
```

---

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing`)
5. Откройте Pull Request

---

## 📄 Лицензия

MIT © 2024 CipherTalk

---

## 🙏 Благодарности

- [Supabase](https://supabase.com/) — Backend & Realtime
- [Tauri](https://tauri.app/) — Desktop framework
- [Next.js](https://nextjs.org/) — React framework
- [Framer Motion](https://www.framer.com/motion/) — Анимации
- [Lucide](https://lucide.dev/) — Иконки

---

## 📞 Контакты

- **GitHub:** [BLACKSPANIEL/cipher-talk](https://github.com/BLACKSPANIEL/cipher-talk)
- **Issues:** [GitHub Issues](https://github.com/BLACKSPANIEL/cipher-talk/issues)

---

**Сделано с ❤️ для приватности.**