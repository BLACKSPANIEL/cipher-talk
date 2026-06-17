'use client';

import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Locale = 'ru' | 'en';

export const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
];

const STORAGE_KEY = 'ciphertalk.locale';

const dictionaries = {
  ru: {
    // Common
    'app.name': 'Cipher Talk',
    'common.cancel': 'Отмена',
    'common.close': 'Закрыть',
    'common.save': 'Сохранить',
    'common.save_changes': 'Сохранить изменения',
    'common.saving': 'Сохранение…',
    'common.saved': 'Сохранено!',
    'common.logout': 'Выйти из аккаунта',
    'common.logging_out': 'Выход…',
    'common.search': 'Поиск…',
    'common.send': 'Отправить',
    'common.back': 'Назад',
    'common.loading': 'Загрузка…',
    'common.online': 'В сети',
    'common.offline': 'Не в сети',
    'common.away': 'Отошёл',

    // Sidebar
    'sidebar.encrypted_chat': 'Зашифрованный чат',
    'sidebar.new_chat': 'Новый чат',
    'sidebar.search_placeholder': 'Поиск чатов…',
    'sidebar.no_chats': 'Нет чатов',
    'sidebar.no_chats_hint': 'Нажмите «Новый чат» чтобы найти собеседника',

    // Chat window
    'chat.no_messages': 'Нет сообщений',
    'chat.no_messages_hint': 'Напишите что-нибудь, чтобы начать защищённый E2EE диалог',
    'chat.empty_title': 'Cipher Talk',
    'chat.empty_desc': 'Ваши сообщения защищены сквозным шифрованием (E2EE). Создайте или выберите чат-комнату слева, чтобы начать безопасное общение.',
    'chat.e2ee_badge': 'E2EE',
    'chat.typing': '{name} печатает…',
    'chat.messages_count': '{count} сообщ.',
    'chat.input_placeholder': 'Напишите сообщение…',
    'chat.encrypting': 'Шифрование…',
    'chat.status.sending': 'Отправка…',
    'chat.status.sent': 'Отправлено',
    'chat.status.error': 'Ошибка отправки',
    'chat.decrypt': 'расшифровать',
    'chat.decrypted': 'расшифровано',

    // Search modal
    'search.title': 'Новый чат',
    'search.placeholder': 'Поиск по nickname…',
    'search.hint': 'Введите nickname пользователя из таблицы profiles',
    'search.empty_start': 'Начните вводить nickname',
    'search.empty_results': 'Пользователи не найдены',
    'search.creating': 'Создаём чат…',

    // Settings
    'settings.title': 'Настройки профиля',
    'settings.tab.profile': 'Профиль',
    'settings.tab.security': 'Безопасность',
    'settings.tab.language': 'Язык / Language',
    'settings.avatar': 'Аватар',
    'settings.upload_photo': 'Загрузить фото',
    'settings.remove_avatar': 'Удалить аватар',
    'settings.avatar_presets': 'Или выберите из эмодзи',
    'settings.nickname': 'Nickname',
    'settings.nickname_placeholder': 'Ваш nickname',
    'settings.tier': 'Тариф',
    'settings.tier.free': 'Бесплатный',
    'settings.tier.pro': 'PRO',
    'settings.tier.elite': 'ELITE',
    'settings.tier_desc': 'Tier назначается администратором. Поле доступно только для чтения.',
    'settings.security_desc': 'Сессия защищена через защищённые HttpOnly Cookies. Используйте кнопку ниже, чтобы завершить все остальные сессии при подозрении на взлом.',
    'settings.language_desc': 'Выберите язык интерфейса. Изменения применяются мгновенно.',

    // Admin
    'admin.title': 'Админ-панель',
    'admin.access_denied': 'Доступ запрещён',
    'admin.access_denied_desc': 'У вашего аккаунта нет прав администратора.',
    'admin.users': 'Пользователи',
    'admin.column.id': 'ID',
    'admin.column.email': 'Email',
    'admin.column.username': 'Username',
    'admin.column.tier': 'Tier',
    'admin.column.role': 'Роль',
    'admin.column.actions': 'Действия',
    'admin.role.user': 'Пользователь',
    'admin.role.admin': 'Админ',
    'admin.set_free': 'Снять Premium',
    'admin.set_pro': 'Назначить PRO',
    'admin.set_elite': 'Назначить ELITE',
    'admin.grant_admin': 'Выдать админа',
    'admin.revoke_admin': 'Снять админа',

    // Tiers
    'tier.pro': 'PRO',
    'tier.elite': 'ELITE',
    'tier.free': 'FREE',

    // Legal
    'legal.agree_prefix': 'Регистрируясь, вы соглашаетесь с',
    'legal.terms': 'Правилами использования',
    'legal.privacy': 'Политикой конфиденциальности',

    // Settings — sessions
    'settings.nickname_empty': 'Nickname не может быть пустым',
    'settings.active_sessions': 'Активные сессии',
    'settings.sessions_desc': 'Управление устройствами, на которых вы вошли в аккаунт',
    'settings.session_current': 'Текущая',
    'settings.sign_out_others': 'Завершить другие сессии',
    'settings.signing_out_others': 'Завершение…',
    'settings.others_signed_out': 'Другие сессии завершены!',

    // Login / Register
    'auth.login_title': 'Вход в Cipher Talk',
    'auth.login_subtitle': 'Защищённый мессенджер с E2EE',
    'auth.register_title': 'Создать аккаунт',
    'auth.register_subtitle': 'Защищённая регистрация в Cipher Talk',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirm_password': 'Подтвердите пароль',
    'auth.username': 'Имя пользователя',
    'auth.login_button': 'Войти',
    'auth.logging_in': 'Вход…',
    'auth.register_button': 'Создать аккаунт',
    'auth.creating': 'Создание…',
    'auth.no_account': 'Нет аккаунта?',
    'auth.has_account': 'Уже есть аккаунт?',
    'auth.register_link': 'Зарегистрироваться',
    'auth.login_link': 'Войти',
    'auth.or': 'или',
    'auth.fill_all': 'Заполните все поля',
    'auth.username_min': 'Имя пользователя должно быть не менее 2 символов',
    'auth.password_min': 'Пароль должен быть не менее 6 символов',
    'auth.passwords_mismatch': 'Пароли не совпадают',
    'auth.invalid_credentials': 'Неверный email или пароль',
    'auth.email_not_confirmed': 'Email не подтверждён. Проверьте почту',
    'auth.user_exists': 'Пользователь с таким email уже существует',
    'auth.register_success': 'Регистрация успешна!',
    'auth.register_success_desc': 'Мы отправили письмо с подтверждением на {email}. Перейдите по ссылке в письме, чтобы активировать аккаунт.',
    'auth.go_to_login': 'Перейти к входу',
    'auth.password_placeholder': 'Минимум 6 символов',

    // Chat window (additional)
    'chat.back': 'Назад к списку',
    'chat.device_mobile': 'Мобильное устройство',
    'chat.device_desktop': 'Компьютер',
    'chat.encrypting_indicator': 'Шифрование…',
    'chat.decrypting_indicator': 'Расшифровка…',
    'chat.cipher_caesar': 'Цезарь',
    'chat.cipher_base64': 'Base64',
    'chat.cipher_none': 'Обычный текст',
    'chat.e2ee_label': 'End-to-end encrypted',
    'chat.typing_indicator': '{name} печатает…',
    'chat.messages_count_short': '{count} сообщ.',
  },
  en: {
    'app.name': 'Cipher Talk',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.save_changes': 'Save changes',
    'common.saving': 'Saving…',
    'common.saved': 'Saved!',
    'common.logout': 'Log out',
    'common.logging_out': 'Logging out…',
    'common.search': 'Search…',
    'common.send': 'Send',
    'common.back': 'Back',
    'common.loading': 'Loading…',
    'common.online': 'Online',
    'common.offline': 'Offline',
    'common.away': 'Away',

    'sidebar.encrypted_chat': 'Encrypted chat',
    'sidebar.new_chat': 'New chat',
    'sidebar.search_placeholder': 'Search chats…',
    'sidebar.no_chats': 'No chats',
    'sidebar.no_chats_hint': 'Click "New chat" to find a contact',

    'chat.no_messages': 'No messages',
    'chat.no_messages_hint': 'Send something to start a secure E2EE conversation',
    'chat.empty_title': 'Cipher Talk',
    'chat.empty_desc': 'Your messages are protected by end-to-end encryption (E2EE). Create or pick a chat room on the left to start secure communication.',
    'chat.e2ee_badge': 'E2EE',
    'chat.typing': '{name} is typing…',
    'chat.messages_count': '{count} messages',
    'chat.input_placeholder': 'Write a message…',
    'chat.encrypting': 'Encrypting…',
    'chat.status.sending': 'Sending…',
    'chat.status.sent': 'Sent',
    'chat.status.error': 'Send failed',
    'chat.decrypt': 'decrypt',
    'chat.decrypted': 'decrypted',

    'search.title': 'New chat',
    'search.placeholder': 'Search by nickname…',
    'search.hint': 'Enter a user nickname from the profiles table',
    'search.empty_start': 'Start typing a nickname',
    'search.empty_results': 'No users found',
    'search.creating': 'Creating chat…',

    'settings.title': 'Profile settings',
    'settings.tab.profile': 'Profile',
    'settings.tab.security': 'Security',
    'settings.tab.language': 'Language',
    'settings.avatar': 'Avatar',
    'settings.upload_photo': 'Upload photo',
    'settings.remove_avatar': 'Remove avatar',
    'settings.avatar_presets': 'Or pick an emoji',
    'settings.nickname': 'Nickname',
    'settings.nickname_placeholder': 'Your nickname',
    'settings.tier': 'Tier',
    'settings.tier.free': 'Free',
    'settings.tier.pro': 'PRO',
    'settings.tier.elite': 'ELITE',
    'settings.tier_desc': 'Tier is assigned by an administrator. This field is read-only.',
    'settings.security_desc': 'Your session is protected via secure HttpOnly cookies. Use the button below to sign out of all other sessions if you suspect a breach.',
    'settings.language_desc': 'Choose the interface language. Changes apply instantly.',

    'admin.title': 'Admin panel',
    'admin.access_denied': 'Access denied',
    'admin.access_denied_desc': 'Your account has no administrator privileges.',
    'admin.users': 'Users',
    'admin.column.id': 'ID',
    'admin.column.email': 'Email',
    'admin.column.username': 'Username',
    'admin.column.tier': 'Tier',
    'admin.column.role': 'Role',
    'admin.column.actions': 'Actions',
    'admin.role.user': 'User',
    'admin.role.admin': 'Admin',
    'admin.set_free': 'Revoke premium',
    'admin.set_pro': 'Assign PRO',
    'admin.set_elite': 'Assign ELITE',
    'admin.grant_admin': 'Grant admin',
    'admin.revoke_admin': 'Revoke admin',

    'tier.pro': 'PRO',
    'tier.elite': 'ELITE',
    'tier.free': 'FREE',

    'legal.agree_prefix': 'By signing up, you agree to the',
    'legal.terms': 'Terms of Service',
    'legal.privacy': 'Privacy Policy',

    'settings.nickname_empty': 'Nickname cannot be empty',
    'settings.active_sessions': 'Active Sessions',
    'settings.sessions_desc': 'Manage devices where you are signed in',
    'settings.session_current': 'Current',
    'settings.sign_out_others': 'Sign out all other sessions',
    'settings.signing_out_others': 'Signing out…',
    'settings.others_signed_out': 'Other sessions signed out!',

    'auth.login_title': 'Sign in to Cipher Talk',
    'auth.login_subtitle': 'Secure messenger with E2EE',
    'auth.register_title': 'Create account',
    'auth.register_subtitle': 'Secure registration for Cipher Talk',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm password',
    'auth.username': 'Username',
    'auth.login_button': 'Sign in',
    'auth.logging_in': 'Signing in…',
    'auth.register_button': 'Create account',
    'auth.creating': 'Creating…',
    'auth.no_account': "Don't have an account?",
    'auth.has_account': 'Already have an account?',
    'auth.register_link': 'Sign up',
    'auth.login_link': 'Sign in',
    'auth.or': 'or',
    'auth.fill_all': 'Please fill in all fields',
    'auth.username_min': 'Username must be at least 2 characters',
    'auth.password_min': 'Password must be at least 6 characters',
    'auth.passwords_mismatch': 'Passwords do not match',
    'auth.invalid_credentials': 'Invalid email or password',
    'auth.email_not_confirmed': 'Email not confirmed. Please check your inbox',
    'auth.user_exists': 'A user with this email already exists',
    'auth.register_success': 'Registration successful!',
    'auth.register_success_desc': 'We sent a confirmation email to {email}. Follow the link in the email to activate your account.',
    'auth.go_to_login': 'Go to sign in',
    'auth.password_placeholder': 'At least 6 characters',

    'chat.back': 'Back to list',
    'chat.device_mobile': 'Mobile device',
    'chat.device_desktop': 'Desktop',
    'chat.encrypting_indicator': 'Encrypting…',
    'chat.decrypting_indicator': 'Decrypting…',
    'chat.cipher_caesar': 'Caesar',
    'chat.cipher_base64': 'Base64',
    'chat.cipher_none': 'Plain text',
    'chat.e2ee_label': 'End-to-end encrypted',
    'chat.typing_indicator': '{name} is typing…',
    'chat.messages_count_short': '{count} msgs',
  },
} as const;

type Dictionary = typeof dictionaries.ru;
type Key = keyof Dictionary;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru');
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'ru' || stored === 'en') {
        setLocaleState(stored);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Save on change (after hydration to avoid clobbering)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    document.documentElement.lang = locale;
  }, [locale, hydrated]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = dictionaries[locale] as unknown as Record<string, string>;
    return {
      locale,
      setLocale: setLocaleState,
      t: (key, vars) => {
        const ruDict = dictionaries.ru as unknown as Record<string, string>;
        let str = dict[key as string] ?? ruDict[key as string] ?? String(key);
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
          }
        }
        return str;
      },
    };
  }, [locale]);

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Graceful fallback for components rendered outside provider
    return {
      locale: 'ru',
      setLocale: () => {},
      t: (key) => String(key),
    };
  }
  return ctx;
}