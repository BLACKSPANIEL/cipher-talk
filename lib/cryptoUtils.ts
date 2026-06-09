import CryptoJS from 'crypto-js';

/**
 * E2EE (End-to-End Encryption) утилиты для Cipher Talk.
 *
 * Используется AES-256. Ключ шифрования хранится в localStorage
 * на клиенте и может быть сгенерирован заново через настройки.
 *
 * ⚠ ВАЖНО: при смене ключа старые сообщения станут нечитаемыми.
 */

const STORAGE_KEY = 'cipher-talk-e2ee-key';

/** Возвращает секретный ключ из localStorage или создаёт дефолтный */
function getKey(): string {
  if (typeof window === 'undefined') return 'cipher-talk-default-key';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  // При первом запуске создаём ключ
  const defaultKey = 'cipher-talk-secret-key-2024';
  localStorage.setItem(STORAGE_KEY, defaultKey);
  return defaultKey;
}

/** Устанавливает новый ключ в localStorage */
export function setEncryptionKey(newKey: string): void {
  localStorage.setItem(STORAGE_KEY, newKey);
}

/** Возвращает текущий ключ (для отображения в настройках) */
export function getEncryptionKey(): string {
  return getKey();
}

/** Генерирует случайный AES-ключ (32 символа hex) */
export function generateRandomKey(): string {
  const chars = '0123456789abcdef';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/**
 * Шифрует текст с помощью AES-256 (CryptoJS).
 * Использует ключ из localStorage.
 */
export function encryptMessage(plaintext: string): string {
  return CryptoJS.AES.encrypt(plaintext, getKey()).toString();
}

/**
 * Дешифрует ciphertext. Если дешифровка не удалась —
 * возвращает исходный текст (для обратной совместимости).
 */
export function decryptMessage(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, getKey());
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || ciphertext;
  } catch {
    return ciphertext;
  }
}

/**
 * Проверяет, является ли строка зашифрованным сообщением.
 */
export function isEncrypted(text: string): boolean {
  try {
    const bytes = CryptoJS.AES.decrypt(text, getKey());
    const result = bytes.toString(CryptoJS.enc.Utf8);
    return result.length > 0 && result !== text;
  } catch {
    return false;
  }
}