import CryptoJS from 'crypto-js';

/**
 * E2EE (End-to-End Encryption) утилиты для Cipher Talk.
 *
 * Используется AES-256 с общим секретным ключом.
 * В реальном production-проекте ключ должен обмениваться
 * через асимметричную криптографию (например, ECDH + HKDF).
 */

// Секретный ключ шифрования.
// ⚠ ВНИМАНИЕ: в продакшене ключ должен быть уникальным
// для каждого диалога и обмениваться через протокол
// асимметричного шифрования (напр. Signal-протокол).
// Здесь используется единый ключ для демонстрации E2EE.
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_E2EE_KEY || 'cipher-talk-secret-key-2024';

/**
 * Шифрует текст с помощью AES-256 (CryptoJS).
 * Возвращает строку вида: "U2FsdGVkX1..." (base64-кодированный ciphertext).
 */
export function encryptMessage(plaintext: string): string {
  return CryptoJS.AES.encrypt(plaintext, ENCRYPTION_KEY).toString();
}

/**
 * Дешифрует ciphertext, полученный от encryptMessage().
 * Если дешифровка не удалась — возвращает исходный текст как есть
 * (для обратной совместимости с незашифрованными сообщениями).
 */
export function decryptMessage(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // Если расшифровка не удалась — bytes вернёт пустую строку
    return decrypted || ciphertext;
  } catch {
    // Если это не зашифрованное сообщение — отдаём как есть
    return ciphertext;
  }
}

/**
 * Проверяет, является ли строка зашифрованным сообщением.
 * CryptoJS.AES выдаёт строку в формате Base64 с префиксом "U2FsdGVkX1".
 * Это стандартный заголовок ("Salted__") в кодировке Base64 после AES-шифрования.
 */
export function isEncrypted(text: string): boolean {
  try {
    const bytes = CryptoJS.AES.decrypt(text, ENCRYPTION_KEY);
    const result = bytes.toString(CryptoJS.enc.Utf8);
    return result.length > 0 && result !== text;
  } catch {
    return false;
  }
}