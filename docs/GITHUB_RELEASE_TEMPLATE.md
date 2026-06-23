# Cipher Talk — GitHub Release Template

## 📋 Инструкция по созданию релиза

### Автоматический способ (рекомендуется)

```bash
# 1. Создайте тег и запушьте
git tag v0.1.0
git push origin v0.1.0

# 2. GitHub Actions автоматически:
#    - Соберёт .exe (Windows), .dmg (macOS), .AppImage (Linux)
#    - Создаст Release с артефактами
#    - Сгенерирует release notes
```

### Ручной способ

1. Перейдите в [Releases](https://github.com/BLACKSPANIEL/cipher-talk/releases)
2. Нажмите **"Draft a new release"**
3. Заполните форму:

---

## 🎯 Release Title

```
v0.1.0 — Initial Release
```

## 📝 Release Description

```markdown
## 🎉 Cipher Talk v0.1.0 — Первый публичный релиз!

### ✨ Что нового

**Полноценный E2EE мессенджер с премиум-дизайном:**

- 🔒 **E2EE шифрование** — AES-256-GCM + ECDH P-256
- 💬 **Realtime чат** — мгновенная доставка через Supabase
- 📱 **Кроссплатформенность** — Web, Windows, macOS, Linux
- 🎨 **Премиум дизайн** — glassmorphism, neon акценты, Framer Motion
- 🔐 **Zero-knowledge** — мы не читаем ваши сообщения

### 📦 Скачать

#### Windows
- **CipherTalk-0.1.0-x64.exe** (8 MB) — NSIS установщик
- **CipherTalk-0.1.0-x64.msi** (7.5 MB) — MSI установщик

#### macOS
- **CipherTalk-0.1.0-arm64.dmg** (6.2 MB) — Apple Silicon
- **CipherTalk-0.1.0-x64.dmg** (7.1 MB) — Intel

#### Linux
- **CipherTalk-0.1.0-x86_64.AppImage** (8.5 MB) — Universal
- **CipherTalk-0.1.0-amd64.deb** (7.8 MB) — Debian/Ubuntu

### 🔧 Системные требования

- **Windows**: Windows 10/11 (x64)
- **macOS**: 10.15 Catalina или новее
- **Linux**: Ubuntu 20.04+, Debian 11+, Fedora 35+

### 🚀 Быстрый старт

1. Скачайте установщик для вашей ОС
2. Запустите приложение
3. Войдите через Supabase (или зарегистрируйтесь)
4. Начните общение с E2EE!

### 📖 Документация

- [README](https://github.com/BLACKSPANIEL/cipher-talk/blob/main/README.md)
- [Android Plan](https://github.com/BLACKSPANIEL/cipher-talk/blob/main/docs/ANDROID_PLAN.md)
- [SQL Migrations](https://github.com/BLACKSPANIEL/cipher-talk/blob/main/sql/realtime_chat_setup.sql)

### 🐛 Известные проблемы

- [ ] Mobile версия в разработке (Tauri Mobile)
- [ ] Групповые чаты ограничены 10 участниками
- [ ] Нет поддержки стикеров/файлов

### 🙏 Благодарности

Спасибо всем, кто тестировал и оставлял feedback!

### 📄 Лицензия

MIT © 2024 CipherTalk

---

**Full Changelog**: [v0.1.0...v0.0.1](https://github.com/BLACKSPANIEL/cipher-talk/compare/v0.0.1...v0.1.0)
```

---

## 🏷️ Release Tags

### Обязательные теги:
- `v0.1.0` — семантическое версионирование
- `latest` — автоматически обновляется GitHub Actions

### Опциональные теги:
- `stable` — стабильная версия
- `beta` — бета-версия
- `alpha` — альфа-версия

---

## 📦 Артефакты сборки

### Windows
```
CipherTalk-0.1.0-x64.exe      # NSIS Installer (~8 MB)
CipherTalk-0.1.0-x64.msi      # MSI Installer (~7.5 MB)
```

### macOS
```
CipherTalk-0.1.0-arm64.dmg    # Apple Silicon (~6.2 MB)
CipherTalk-0.1.0-x64.dmg      # Intel (~7.1 MB)
```

### Linux
```
CipherTalk-0.1.0-x86_64.AppImage  # Universal (~8.5 MB)
CipherTalk-0.1.0-amd64.deb        # Debian/Ubuntu (~7.8 MB)
```

---

## 🔄 Workflow (GitHub Actions)

Файл: `.github/workflows/desktop-build.yml`

### Триггеры:
1. **Push тега** `v*` — автоматическая сборка
2. **Ручной запуск** — через `workflow_dispatch`

### Шаги:
1. Checkout кода
2. Setup Node.js 20
3. Install зависимости (`npm ci`)
4. Build Next.js (`npm run build`)
5. Setup Rust + Tauri CLI
6. Build для каждой платформы
7. Upload артефактов
8. Создание Release (только для тегов)

---

## ✅ Чеклист перед релизом

- [ ] Все тесты проходят (`npm test`)
- [ ] Build проходит без ошибок (`npm run build`)
- [ ] Обновлён CHANGELOG.md
- [ ] Обновлена версия в `package.json`
- [ ] Обновлена версия в `src-tauri/tauri.conf.json`
- [ ] Проверены все платформы (Windows, macOS, Linux)
- [ ] Подписаны бинарники (code signing)
- [ ] Создан release notes
- [ ] Загружены артефакты в Release
- [ ] Протестирован автообновление

---

## 🔐 Code Signing (опционально)

### Windows (Code Signing Certificate)
```yaml
# Добавить в workflow
- name: Sign Windows
  uses: dlemstra/magick-windows-sign@v1
  with:
    certificate: ${{ secrets.WINDOWS_CERTIFICATE }}
    password: ${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}
```

### macOS (Apple Developer)
```yaml
- name: Sign macOS
  uses: apple-actions/notarize@v1
  with:
    app-path: "*.dmg"
    apple-id: ${{ secrets.APPLE_ID }}
    password: ${{ secrets.APPLE_PASSWORD }}
```

---

## 📊 Мониторинг релиза

### GitHub Insights:
- **Releases** — количество скачиваний
- **Actions** — статус сборок
- **Issues** — баги после релиза

### Метрики:
- Скачивания по платформам
- Время сборки
- Размер артефактов
- Количество issues после релиза

---

## 🚨 Откат релиза

Если релиз сломан:

1. **Удалите тег:**
   ```bash
   git tag -d v0.1.0
   git push origin :refs/tags/v0.1.0
   ```

2. **Удалите Release** на GitHub (вручную)

3. **Создайте новый тег:**
   ```bash
   git tag v0.1.0-hotfix.1
   git push origin v0.1.0-hotfix.1
   ```

---

## 📝 Примеры релизов

### Patch (исправление багов)
```
v0.1.1 — Fix crash on startup
```

### Minor (новые функции)
```
v0.2.0 — Group chats + File sharing
```

### Major (breaking changes)
```
v1.0.0 — Stable release
```

---

**Готово!** После создания релиза пользователи смогут скачать Cipher Talk с GitHub Releases.