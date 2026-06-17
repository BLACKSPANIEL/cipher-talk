/**
 * Generate updater.json for Cipher Talk GitHub Releases
 * 
 * Использование:
 *   node desktop/generate-updater-json.mjs [version] [notes]
 * 
 * Пример:
 *   node desktop/generate-updater-json.mjs 0.1.1 "Новые функции:\n- Улучшенная безопасность\n- Исправлены баги"
 * 
 * Результат:
 *   Создаёт dist/updater.json — этот файл нужно загрузить в GitHub Release
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Получаем версию из аргументов или package.json ──
let version = process.argv[2];
let releaseNotes = process.argv[3] || '';

if (!version) {
  // Пробуем прочитать из package.json
  try {
    const pkg = JSON.parse(
      await import('fs').then(fs =>
        fs.readFileSync(join(ROOT, 'package.json'), 'utf-8')
      )
    );
    version = pkg.version;
  } catch {
    console.error('❌ Не указана версия. Использование: node generate-updater-json.mjs <version> [notes]');
    process.exit(1);
  }
}

// ── Формируем updater.json ──
const updater = {
  version: version,
  notes: releaseNotes || '✓ Исправления и улучшения',
  pub_date: new Date().toISOString(),
  platforms: {
    'win32-x64': {
      signature: '',
      url: `https://github.com/BLACKSPANIEL/cipher-talk/releases/download/v${version}/CipherTalk-Setup.exe`,
    },
    'linux-x64': {
      signature: '',
      url: `https://github.com/BLACKSPANIEL/cipher-talk/releases/download/v${version}/CipherTalk-linux-x64.AppImage`,
    },
    'darwin-x64': {
      signature: '',
      url: `https://github.com/BLACKSPANIEL/cipher-talk/releases/download/v${version}/CipherTalk-darwin-x64.dmg`,
    },
    'darwin-arm64': {
      signature: '',
      url: `https://github.com/BLACKSPANIEL/cipher-talk/releases/download/v${version}/CipherTalk-darwin-arm64.dmg`,
    },
  },
};

// ── Сохраняем ──
const distDir = join(__dirname, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

const outputPath = join(distDir, 'updater.json');
writeFileSync(outputPath, JSON.stringify(updater, null, 2) + '\n', 'utf-8');

console.log(`\n✅ updater.json created at: ${outputPath}`);
console.log(`   Version: ${version}`);
console.log(`   Date:    ${updater.pub_date}`);
console.log(`\n📌 Загрузи этот файл в GitHub Release:`);
console.log(`   https://github.com/BLACKSPANIEL/cipher-talk/releases/new`);
console.log(`   Имя файла: updater.json`);
console.log(`   Путь:      releases/latest/download/updater.json\n`);