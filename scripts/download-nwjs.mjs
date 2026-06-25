/**
 * Скрипт для загрузки NW.js SDK через китайское зеркало npmmirror,
 * так как dl.nwjs.io может быть недоступен в некоторых регионах.
 *
 * Загружает nwjs-sdk для win64 и помещает в кэш nw-builder.
 */
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { get } from 'https';
import { join } from 'path';
import { extract } from 'tar-fs';
import { createGunzip } from 'node:zlib';

const VERSION = '0.92.0';
const PLATFORM = 'win64';
const CACHE_DIR = join(process.env.USERPROFILE || 'C:\\Users\\seryu', '.nwjs-cache');

const NW_VERSION_MAP = {
  '0.92.0': 'v0.92.0',
  '0.91.0': 'v0.91.0',
  '0.90.0': 'v0.90.0',
};

const tag = NW_VERSION_MAP[VERSION] || `v${VERSION}`;
const filename = `nwjs-sdk-v${VERSION}-win-x64.zip`;
const mirrorUrl = `https://npmmirror.com/mirrors/nwjs/${tag}/${filename}`;
const destDir = join(CACHE_DIR, `${VERSION}-${PLATFORM}`);
const destFile = join(CACHE_DIR, filename);

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`[NW.js] Already cached: ${dest}`);
      resolve();
      return;
    }
    console.log(`[NW.js] Downloading ${url} ...`);
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode >= 300 && res.headers.location) {
        console.log(`[NW.js] Redirect to ${res.headers.location}`);
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[NW.js] Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  try {
    await download(mirrorUrl, destFile);
    console.log(`[NW.js] SDK ready at ${destFile}`);
    console.log(`[NW.js] To build, run: nwbuild -p win64 -v ${VERSION} -o ./dist .`);
    console.log(`[NW.js] Or with custom cache: nwbuild -p win64 -v ${VERSION} -o ./dist --cacheDir "${CACHE_DIR}" .`);
  } catch (err) {
    console.error(`[NW.js] Download failed: ${err.message}`);
    
    // Fallback: try GitHub releases direct download
    const ghUrl = `https://github.com/nwjs/nw.js/releases/download/${tag}/${filename}`;
    console.log(`[NW.js] Trying fallback: ${ghUrl}`);
    try {
      await download(ghUrl, destFile);
      console.log(`[NW.js] SDK downloaded from GitHub: ${destFile}`);
    } catch (err2) {
      console.error(`[NW.js] GitHub download also failed: ${err2.message}`);
      console.log(`[NW.js] Please manually download NW.js SDK from:`);
      console.log(`  ${mirrorUrl}`);
      console.log(`  or from GitHub releases:`);
      console.log(`  ${ghUrl}`);
      console.log(`  Extract to: ${destDir}`);
      process.exit(1);
    }
  }
}

main();