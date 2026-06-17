/**
 * Generate Cipher Talk app icons for Tauri 2.0
 * Creates minimal placeholder PNG icons at required sizes.
 * For production: replace with real icon using a proper SVG-to-PNG tool.
 * 
 * Usage: node scripts/generate-icons.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '..', 'src-tauri', 'icons');

mkdirSync(ICONS_DIR, { recursive: true });

function createPNG(w, h) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdr = _createChunk('IHDR', ihdrData);
  
  const rawData = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    rawData[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const offset = y * (w * 4 + 1) + 1 + x * 4;
      const cx = w / 2, cy = h / 2;
      const dx = (x - cx) / cx, dy = (y - cy) / cy;
      // Simple shield shape
      const isShield = dy < 0.3 && dy > -1.0 && Math.abs(dx) < (0.7 - Math.abs(dy) * 0.3);
      const isBorder = isShield && Math.abs(Math.abs(dx) - (0.65 - Math.abs(dy) * 0.25)) < 0.1;
      
      if (isShield) {
        rawData[offset] = isBorder ? 16 : 10;
        rawData[offset + 1] = isBorder ? 245 : 20;
        rawData[offset + 2] = isBorder ? 181 : 35;
        rawData[offset + 3] = isBorder ? 255 : 220;
      } else {
        rawData[offset] = 5;
        rawData[offset + 1] = 7;
        rawData[offset + 2] = 13;
        rawData[offset + 3] = 0;
      }
    }
  }
  
  const compressed = deflateSync(rawData, { level: 9 });
  const idat = _createChunk('IDAT', compressed);
  const iend = _createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function _createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  // CRC32 of type+data
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuf]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return ~crc >>> 0;
}

// Generate required icons
const iconConfig = [
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
  { name: 'icon.png', size: 512 },
];

for (const { name, size } of iconConfig) {
  writeFileSync(join(ICONS_DIR, name), createPNG(size, size));
  console.log(`✓ ${name} (${size}x${size})`);
}

// Create .ico (use 32x32 and 256x256 images)
const ico32 = createPNG(32, 32);
const ico256 = createPNG(256, 256);
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);    // reserved
icoHeader.writeUInt16LE(1, 2);    // ICO type
icoHeader.writeUInt16LE(2, 4);    // count: 2 images

const icoEntry1 = Buffer.alloc(16);
icoEntry1.writeUInt8(32, 0);      // width
icoEntry1.writeUInt8(32, 1);      // height
icoEntry1.writeUInt8(0, 2);       // colors
icoEntry1.writeUInt8(0, 3);       // reserved
icoEntry1.writeUInt16LE(1, 4);    // planes
icoEntry1.writeUInt16LE(32, 6);   // bpp
icoEntry1.writeUInt32LE(ico32.length, 8);
icoEntry1.writeUInt32LE(22, 12);  // offset

const icoEntry2 = Buffer.alloc(16);
icoEntry2.writeUInt8(0, 0);       // width (0=256)
icoEntry2.writeUInt8(0, 1);       // height (0=256)
icoEntry2.writeUInt8(0, 2);
icoEntry2.writeUInt8(0, 3);
icoEntry2.writeUInt16LE(1, 4);
icoEntry2.writeUInt16LE(32, 6);
icoEntry2.writeUInt32LE(ico256.length, 8);
icoEntry2.writeUInt32LE(22 + ico32.length, 12);

const icoBuffer = Buffer.concat([icoHeader, icoEntry1, icoEntry2, ico32, ico256]);
writeFileSync(join(ICONS_DIR, 'icon.ico'), icoBuffer);
console.log('✓ icon.ico');

// Placeholder .icns (copy 512px png)
writeFileSync(join(ICONS_DIR, 'icon.icns'), createPNG(256, 256));
console.log('✓ icon.icns (placeholder)');

console.log('\n✅ All icons generated in src-tauri/icons/');
console.log('   For production, replace with proper icons using: npx tauri icon');