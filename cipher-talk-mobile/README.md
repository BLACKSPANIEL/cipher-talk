# Cipher Talk Mobile

Flutter-версия Cipher Talk с премиум-дизайном и E2EE шифрованием.

## 🚀 Запуск

```bash
# Установите Flutter: https://flutter.dev/docs/get-started/install

# Установите зависимости
flutter pub get

# Запустите на эмуляторе/устройстве
flutter run

# Сборка APK
flutter build apk --release
```

## 📱 Требования

- Flutter 3.24+
- Dart 3.5+
- Android SDK (для Android сборки)
- Xcode (для iOS сборки)

## 🏗️ Архитектура

```
lib/
├── main.dart                 # Entry point
├── app.dart                  # App widget + theme
├── core/
│   ├── constants/
│   │   ├── colors.dart       # Цветовая палитра
│   │   └── strings.dart      # Строки
│   └── theme/
│       └── app_theme.dart    # Тема
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   └── widgets/
│   └── chat/
│       ├── screens/
│       │   ├── chat_list_screen.dart
│       │   └── chat_screen.dart
│       └── widgets/
│           ├── message_bubble.dart
│           └── chat_input.dart
├── shared/
│   ├── widgets/
│   │   ├── glass_card.dart
│   │   └── neon_button.dart
│   └── utils/
│       └── crypto_utils.dart
└── data/
    ├── models/
    │   ├── message.dart
    │   └── user.dart
    └── repositories/
        └── chat_repository.dart
```

## 🎨 Дизайн

- Тёмная тема (#05070d)
- Неоновые акценты (emerald, cyan, violet)
- Glassmorphism эффекты
- Плавные анимации

## 🔐 Безопасность

- E2EE шифрование (AES-256-GCM)
- Supabase Realtime
- Локальное хранилище ключей

## 📦 Зависимости

```yaml
dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.0.0
  flutter_secure_storage: ^9.0.0
  crypto: ^3.0.3
  flutter_animate: ^4.3.0
  lucide_icons: ^0.3.0
```

**Flutter не установлен.** Проект создан как структура. Установите Flutter и выполните `flutter create` для генерации кода.