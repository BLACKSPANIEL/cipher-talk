# Cipher Talk — Android Implementation Plan

## 📱 Выбор технологии: Tauri Mobile (рекомендуется)

### Сравнение вариантов:

| Критерий | Tauri Mobile | React Native | Flutter |
|-----------|-------------|--------------|---------|
| Общий код с web | ✅ 90%+ | ❌ 30% | ❌ 20% |
| Производительность | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Размер APK | ~8 MB | ~15 MB | ~12 MB |
| Rust backend | ✅ | ❌ | ❌ |
| E2EE криптография | Web Crypto API | Expo Crypto | Dart Crypto |
| Hot reload | ⚠️ Ограничен | ✅ | ✅ |
| Community | 🔄 Растёт | ✅✅✅ | ✅✅✅ |
| Стабильность | ⚠️ Alpha | ✅ Stable | ✅ Stable |

**Решение: Tauri Mobile** (альфа-версия уже доступна, общий кодbase с Desktop)

---

## 🏗️ Архитектура

```
cipher-talk/
├── app/                    # Next.js (web + desktop)
│   ├── chat/
│   ├── settings/
│   └── ...
├── mobile/                 # 🆕 Tauri Mobile
│   ├── src/
│   │   ├── main.rs        # Rust entry point
│   │   ├── lib.rs         # Rust backend
│   │   └── components/    # React components (shared)
│   ├── tauri.conf.json
│   └── Cargo.toml
├── shared/                 # 🆕 Общий код
│   ├── crypto/
│   │   ├── utils.ts       # Web Crypto API
│   │   └── ciphers.ts     # Caesar, Base64
│   ├── supabase/
│   │   └── client.ts      # Supabase client
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   └── hooks/
│       └── useRealtime.ts # Realtime subscription
└── packages/
    └── ui/                 # 🆕 Shared UI components
        ├── MessageBubble.tsx
        ├── ChatWindow.tsx
        └── Sidebar.tsx
```

---

## 📋 План реализации (2 недели)

### Неделя 1: Базовая структура

#### День 1-2: Настройка Tauri Mobile
```bash
# 1. Установка Tauri CLI
cargo install tauri-cli

# 2. Создание мобильного проекта
npm create tauri-app@latest mobile -- --template react-ts

# 3. Добавление зависимостей
cd mobile
npm install @supabase/supabase-js
npm install framer-motion
npm install lucide-react
npm install zustand

# 4. Настройка tauri.conf.json для Android
```

#### День 3-4: Перенос общего кода
```typescript
// shared/crypto/utils.ts — переносим из lib/cryptoUtils.ts
// shared/supabase/client.ts — переносим из lib/supabaseClient.ts
// shared/types/index.ts — общие TypeScript интерфейсы
```

#### День 5-6: Мобильные компоненты
```
mobile/src/components/
├── chat/
│   ├── MobileChatScreen.tsx  # Основной экран чата
│   ├── MessageBubble.tsx     # Переносим из web
│   ├── ChatInput.tsx         # Адаптируем под мобильные
│   └── RoomList.tsx          # Список чатов
├── settings/
│   └── MobileSettings.tsx
└── common/
    ├── BottomNav.tsx
    └── AppHeader.tsx
```

#### День 7: Тестирование на эмуляторе
```bash
# Запуск на Android эмуляторе
cd mobile
cargo tauri android dev
```

---

### Неделя 2: Адаптация и полировка

#### День 8-9: Мобильный UI/UX
- Адаптация glassmorphism для Android Material Design 3
- Touch-оптимизация (кнопки 48x48dp минимум)
- Swipe-жесты (удаление чата, архив)
- Pull-to-refresh
- Haptic feedback

#### День 10-11: Платформенные фичи
```rust
// mobile/src/lib.rs — Rust backend

// 1. Уведомления
#[tauri::command]
async fn send_notification(title: &str, body: &str) -> Result<(), String> {
    // Используем Tauri Notification plugin
}

// 2. Биометрия (Fingerprint/Face ID)
#[tauri::command]
async fn authenticate_with_biometrics() -> Result<bool, String> {
    // Используем Tauri Biometric plugin
}

// 3. Хранилище ключей (Keystore)
#[tauri::command]
async fn store_key_securely(key: &str) -> Result<(), String> {
    // Android Keystore
}

// 4. Share API
#[tauri::command]
async fn share_text(text: &str) -> Result<(), String> {
    // Android Share Intent
}
```

#### День 12-13: Сборка и тестирование
```bash
# Debug сборка
cargo tauri android build --debug

# Release сборка
cargo tauri android build --release

# Генерация APK/AAB
# Файлы будут в: mobile/src-tauri/target/release/apk/
```

#### День 14: Подготовка к публикации
- Создание keystore для подписи
- Настройка Google Play Console
- Создание listing (скриншоты, описание)
- Настройка Firebase (опционально)

---

## 🔧 Технические детали

### 1. Tauri Configuration (mobile/tauri.conf.json)

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:3000",
    "frontendDist": "../out"
  },
  "app": {
    "windows": [
      {
        "title": "Cipher Talk",
        "width": 400,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": "default-src 'self'; ..."
    }
  },
  "bundle": {
    "active": true,
    "targets": ["android-apk", "android-aab"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.png"
    ]
  },
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/BLACKSPANIEL/cipher-talk/releases/latest/download/updater.json"
      ]
    },
    "notification": {
      "all": true
    },
    "biometric": {
      "all": true
    }
  }
}
```

### 2. Android Permissions (mobile/src-tauri/AndroidManifest.xml)

```xml
<manifest>
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
  <uses-permission android:name="android.permission.USE_BIOMETRIC" />
  <uses-permission android:name="android.permission.VIBRATE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
```

### 3. Shared State Management

```typescript
// shared/hooks/useRealtime.ts
export function useRealtime(roomId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!roomId) return;
    
    const channel = supabase.channel(`room-${roomId}`);
    
    // Messages
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      setMessages(prev => [...prev, payload.new]);
    });
    
    // Typing
    channel.on('broadcast', { event: 'typing' }, (payload) => {
      setTypingUsers(prev => [...prev, payload.payload.username]);
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== payload.payload.username));
      }, 3000);
    });
    
    // Presence
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const online = new Set(Object.keys(state));
      setOnlineUsers(online);
    });
    
    channel.subscribe();
    return () => supabase.removeChannel(channel);
  }, [roomId]);

  return { messages, typingUsers, onlineUsers };
}
```

---

## 🚀 GitHub Actions для Android

```yaml
# .github/workflows/android-build.yml
name: Build Android

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: 'aarch64-linux-android,armv7-linux-androideabi,x86_64-linux-android,i686-linux-android'
          
      - name: Setup Android NDK
        uses: android-actions/setup-android@v2
        with:
          ndk-version: 25.1.8937393
          
      - name: Build Tauri Android
        run: |
          cd mobile
          cargo tauri android build
          
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: CipherTalk-Android
          path: mobile/src-tauri/target/release/apk/*.apk
```

---

## 📦 Структура APK

```
CipherTalk-0.1.0-arm64-v8a.apk    # 64-bit ARM (современные устройства)
CipherTalk-0.1.0-armeabi-v7a.apk  # 32-bit ARM (старые устройства)
CipherTalk-0.1.0-x86_64.apk       # Эмуляторы
```

**Размер:** ~8-12 MB (без шрифтов и ресурсов)

---

## ✅ Чеклист готовности

### Web (текущее состояние)
- [x] Landing page с премиум дизайном
- [x] Чат с Realtime (сообщения, typing, presence)
- [x] Read receipts
- [x] E2EE (AES-256-GCM + ECDH P-256)
- [x] Настройки (профиль, безопасность, язык, внешний вид)
- [x] GitHub Actions для Desktop сборки

### Desktop (Tauri)
- [ ] Собрать .exe для Windows
- [ ] Собрать .dmg для macOS
- [ ] Собрать .AppImage для Linux
- [ ] Настроить автообновление
- [ ] Кастомный TitleBar
- [ ] System Tray

### Android (Tauri Mobile)
- [ ] Создать проект Tauri Mobile
- [ ] Перенести общий код
- [ ] Адаптировать UI под мобильные
- [ ] Интегрировать биометрию
- [ ] Настроить уведомления
- [ ] Собрать APK/AAB
- [ ] Опубликовать в Google Play

---

## 🎯 Следующие шаги (прямо сейчас)

1. **Выполнить SQL миграции** в Supabase (`sql/realtime_chat_setup.sql`)
2. **Протестировать Realtime чат** локально
3. **Собрать Desktop версию** (Windows .exe)
4. **Создать GitHub Release** с .exe
5. **Начать Android** — создать `mobile/` проект

---

## 📝 Заметки

- Tauri Mobile всё ещё в alpha, возможны баги
- Для production лучше подождать стабильный релиз (Q2 2025)
- Альтернатива: React Native + Expo (быстрее разработка, больше community)
- E2EE ключи на Android должны храниться в Keystore (не в SharedPreferences)

**Готов приступить к реализации. С чего начать?**