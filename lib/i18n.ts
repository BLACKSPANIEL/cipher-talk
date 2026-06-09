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
    'settings.security_desc': 'Сессия защищена через защищённые HttpOnly Cookies. Выйдите со всех остальных устройств через supabase.auth.signOut({ scope: "others" }) в случае подозрения на взлом.',
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

    // Legal (login)
    'legal.agree_prefix': 'Регистрируясь, вы соглашаетесь с',
    'legal.terms': 'Правилами использования',
    'legal.privacy': 'Политикой конфиденциальности',

    // Settings — new keys (sessions)
    'settings.nickname_empty': 'Nickname не может быть пустым',
    'settings.active_sessions': 'Активные сессии',
    'settings.sessions_desc': 'Управление устройствами, на которых вы вошли в аккаунт',
    'settings.session_current': 'Текущая',
    'settings.sign_out_others': 'Завершить другие сессии',
    'settings.signing_out_others': 'Завершение…',
    'settings.others_signed_out': 'Другие сессии завершены!',
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
    'sidebar.no_chats': 'No chats',
    'sidebar.no_chats_hint': 'Click «New chat» to find a contact',

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
    'settings.security_desc': 'Your session is protected via secure HttpOnly cookies. Sign out of all other devices via supabase.auth.signOut({ scope: "others" }) if you suspect a breach.',
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

    // Settings — new keys (sessions)
    'settings.nickname_empty': 'Nickname cannot be empty',
    'settings.active_sessions': 'Active Sessions',
    'settings.sessions_desc': 'Manage devices where you are signed in',
    'settings.session_current': 'Current',
    'settings.sign_out_others': 'Sign out all other sessions',
    'settings.signing_out_others': 'Signing out…',
    'settings.others_signed_out': 'Other sessions signed out!',
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
