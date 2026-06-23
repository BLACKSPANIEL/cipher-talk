/**
 * E2EE (End-to-End Encryption) утилиты для Cipher Talk.
 *
 * Архитектура:
 * 1. AES-256-GCM — шифрование сообщений (симметричное)
 * 2. ECDH P-256 — обмен ключами между пользователями (асимметричное)
 * 3. PBKDF2 — производная ключа из мастер-пароля (опционально)
 *
 * Ключи хранятся в localStorage (web) / secure storage (desktop).
 */

const STORAGE_KEY = 'cipher-talk-e2ee-key';
const KEY_PAIR_KEY = 'cipher-talk-keypair';

// ============================================================
// Вспомогательные функции для Web Crypto API
// ============================================================

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// ============================================================
// 1. Симметричное шифрование (AES-256-GCM)
// ============================================================

/**
 * Создаёт AES-256-GCM ключ из сырых байт (32 байта = 256 бит)
 */
export async function createAesKey(rawKey: string): Promise<CryptoKey> {
  const keyBytes = new TextEncoder().encode(rawKey.padEnd(32, '0').slice(0, 32));
  return crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Шифрует текст AES-256-GCM. Возвращает base64(iv + ciphertext).
 */
export async function encryptMessage(plaintext: string, key?: CryptoKey): Promise<string> {
  const aesKey = key || await getAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoded
  );

  // Объединяем IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return arrayBufferToBase64(combined.buffer);
}

/**
 * Дешифрует base64(iv + ciphertext) → текст.
 */
export async function decryptMessage(ciphertext: string, key?: CryptoKey): Promise<string> {
  try {
    const aesKey = key || await getAesKey();
    const combined = new Uint8Array(base64ToArrayBuffer(ciphertext));

    // Извлекаем IV (первые 12 байт)
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

// ============================================================
// 2. Асимметричное шифрование (ECDH P-256 + AES-GCM)
// ============================================================

/**
 * Генерирует пару ключей ECDH P-256 для пользователя.
 */
export async function generateKeyPair(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    ['deriveKey', 'deriveBits']
  );
  return keyPair;
}

/**
 * Экспортирует публичный ключ в base64 (для отправки другим пользователям).
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  return arrayBufferToBase64(exported);
}

/**
 * Импортирует публичный ключ из base64.
 */
export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey(
    'spki',
    keyData,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    []
  );
}

/**
 * Производная AES-ключ из ECDH (shared secret).
 */
async function deriveAesKeyFromEcdh(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey,
    },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Шифрует сообщение для конкретного получателя (E2EE).
 * Использует ECDH для получения shared secret, затем AES-GCM.
 */
export async function encryptForUser(
  plaintext: string,
  recipientPublicKey: CryptoKey,
  senderPrivateKey: CryptoKey
): Promise<string> {
  const sharedKey = await deriveAesKeyFromEcdh(senderPrivateKey, recipientPublicKey);
  return encryptMessage(plaintext, sharedKey);
}

/**
 * Дешифрует сообщение, зашифрованное для текущего пользователя.
 */
export async function decryptFromUser(
  ciphertext: string,
  senderPublicKey: CryptoKey,
  recipientPrivateKey: CryptoKey
): Promise<string> {
  const sharedKey = await deriveAesKeyFromEcdh(recipientPrivateKey, senderPublicKey);
  return decryptMessage(ciphertext, sharedKey);
}

// ============================================================
// 3. Хранилище ключей
// ============================================================

/**
 * Получает AES-ключ из localStorage (или создаёт новый).
 */
export async function getAesKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('getAesKey can only be called in browser');
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const keyData = base64ToArrayBuffer(stored);
      return crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } catch {
      // Если импорт не удался — генерируем новый
    }
  }

  // Генерируем случайный ключ
  const rawKey = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  // Сохраняем
  const exported = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem(STORAGE_KEY, arrayBufferToBase64(exported));

  return key;
}

/**
 * Сохраняет пару ключей в localStorage.
 */
export async function storeKeyPair(keyPair: { publicKey: CryptoKey; privateKey: CryptoKey }): Promise<void> {
  if (typeof window === 'undefined') return;

  const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
  const privateKeyBase64 = arrayBufferToBase64(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey));

  localStorage.setItem(KEY_PAIR_KEY, JSON.stringify({
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64,
  }));
}

/**
 * Загружает пару ключей из localStorage.
 */
export async function loadKeyPair(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey } | null> {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(KEY_PAIR_KEY);
  if (!stored) return null;

  try {
    const { publicKey, privateKey } = JSON.parse(stored);
    return {
      publicKey: await importPublicKey(publicKey),
      privateKey: await crypto.subtle.importKey(
        'pkcs8',
        base64ToArrayBuffer(privateKey),
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        ['deriveKey', 'deriveBits']
      ),
    };
  } catch {
    return null;
  }
}

/**
 * Удаляет все ключи (при сбросе).
 */
export function clearKeys(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(KEY_PAIR_KEY);
}

// ============================================================
// 4. Вспомогательные функции
// ============================================================

/**
 * Возвращает fingerprint публичного ключа (для верификации).
 */
export async function getKeyFingerprint(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  const hash = await crypto.subtle.digest('SHA-256', exported);
  const hex = arrayBufferToHex(hash);
  // Форматируем как XX:XX:XX:XX:XX:XX:XX:XX
  return hex.match(/.{2}/g)?.slice(0, 8).join(':') || hex;
}

/**
 * Генерирует случайный AES-ключ (для настроек).
 */
export function generateRandomAesKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return arrayBufferToHex(bytes.buffer);
}

// ============================================================
// 5. Обратная совместимость (CryptoJS)
// ============================================================

import CryptoJS from 'crypto-js';

/**
 * Шифрует текст с помощью AES-256 (CryptoJS) — для обратной совместимости.
 * @deprecated Используйте encryptMessage() с Web Crypto API
 */
export function encryptMessageLegacy(plaintext: string): string {
  const key = getKeyLegacy();
  return CryptoJS.AES.encrypt(plaintext, key).toString();
}

/**
 * Дешифрует текст (CryptoJS) — для обратной совместимости.
 * @deprecated Используйте decryptMessage() с Web Crypto API
 */
export function decryptMessageLegacy(ciphertext: string): string {
  try {
    const key = getKeyLegacy();
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || ciphertext;
  } catch {
    return ciphertext;
  }
}

function getKeyLegacy(): string {
  if (typeof window === 'undefined') return 'cipher-talk-default-key';
  const stored = localStorage.getItem('cipher-talk-legacy-key');
  if (stored) return stored;
  const defaultKey = 'cipher-talk-secret-key-2024';
  localStorage.setItem('cipher-talk-legacy-key', defaultKey);
  return defaultKey;
}

/**
 * Проверяет, является ли строка зашифрованным сообщением (AES-GCM).
 */
export async function isEncrypted(text: string): Promise<boolean> {
  try {
    const decoded = base64ToArrayBuffer(text);
    if (decoded.byteLength < 13) return false; // IV (12) + min ciphertext (1)
    await decryptMessage(text);
    return true;
  } catch {
    return false;
  }
}