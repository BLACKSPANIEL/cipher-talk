/**
 * GitHub Releases API utility
 * Получает информацию о последнем релизе для кнопки скачивания
 */

export interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  assets: GitHubAsset[];
  published_at: string;
}

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

const GITHUB_API_URL = 'https://api.github.com/repos/BLACKSPANIEL/cipher-talk/releases/latest';
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

let cachedRelease: GitHubRelease | null = null;
let cacheTimestamp: number = 0;

/**
 * Получает информацию о последнем релизе с кэшированием
 */
export async function getLatestRelease(): Promise<GitHubRelease | null> {
  const now = Date.now();
  
  // Возвращаем кэш если он ещё актуален
  if (cachedRelease && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRelease;
  }

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 300 }, // Next.js ISR кэш на 5 минут
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return null;
    }

    const data: GitHubRelease = await response.json();
    cachedRelease = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Failed to fetch latest release:', error);
    return null;
  }
}

/**
 * Получает URL для скачивания Windows .exe
 */
export async function getWindowsDownloadUrl(): Promise<string | null> {
  const release = await getLatestRelease();
  if (!release) return null;

  const exeAsset = release.assets.find(asset => 
    asset.name.endsWith('.exe') || asset.name.endsWith('.msi')
  );

  return exeAsset?.browser_download_url || null;
}

/**
 * Получает все доступные платформы
 */
export async function getAvailablePlatforms(): Promise<{
  windows: string | null;
  macos: string | null;
  linux: string | null;
}> {
  const release = await getLatestRelease();
  if (!release) {
    return { windows: null, macos: null, linux: null };
  }

  const windows = release.assets.find(a => a.name.endsWith('.exe') || a.name.endsWith('.msi'))?.browser_download_url || null;
  const macos = release.assets.find(a => a.name.endsWith('.dmg') || a.name.endsWith('.app'))?.browser_download_url || null;
  const linux = release.assets.find(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb'))?.browser_download_url || null;

  return { windows, macos, linux };
}

/**
 * Форматирует размер файла в читаемый вид
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Форматирует дату релиза
 */
export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дней назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
  
  return date.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}