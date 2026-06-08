export function caesarEncrypt(text: string, shift: number): string {
  return text
    .split('')
    .map((char) => {
      if (char >= 'А' && char <= 'Я') {
        return String.fromCharCode(((char.charCodeAt(0) - 1040 + shift) % 32) + 1040);
      }
      if (char >= 'а' && char <= 'я') {
        return String.fromCharCode(((char.charCodeAt(0) - 1072 + shift) % 32) + 1072);
      }
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export function base64Encode(text: string): string {
  try {
    return btoa(encodeURIComponent(text));
  } catch {
    return btoa(text);
  }
}

export function base64Decode(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    return atob(encoded);
  }
}

export type CipherType = 'none' | 'caesar' | 'base64';

export function encryptText(text: string, cipher: CipherType, shift?: number): string {
  switch (cipher) {
    case 'caesar':
      return caesarEncrypt(text, shift ?? 3);
    case 'base64':
      return base64Encode(text);
    case 'none':
    default:
      return text;
  }
}

export const CIPHER_OPTIONS: { value: CipherType; label: string }[] = [
  { value: 'none', label: 'Обычный текст' },
  { value: 'caesar', label: 'Шифр Цезаря' },
  { value: 'base64', label: 'Base64' },
];