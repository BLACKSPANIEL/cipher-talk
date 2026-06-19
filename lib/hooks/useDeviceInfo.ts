'use client';

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  ip: string;
  userAgent: string;
}

function detectOS(ua: string): { os: string; version: string } {
  if (ua.includes('Windows NT 10.0')) return { os: 'Windows', version: '11' };
  if (ua.includes('Windows NT 6.3')) return { os: 'Windows', version: '8.1' };
  if (ua.includes('Windows NT 6.1')) return { os: 'Windows', version: '7' };
  if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    return { os: 'macOS', version: match?.[1]?.replace('_', '.') || 'Unknown' };
  }
  if (ua.includes('Android')) {
    const match = ua.match(/Android (\d+(?:\.\d+)?)/);
    return { os: 'Android', version: match?.[1] || 'Unknown' };
  }
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    const match = ua.match(/OS (\d+[._]\d+)/);
    return { os: 'iOS', version: match?.[1]?.replace('_', '.') || 'Unknown' };
  }
  if (ua.includes('CrOS')) return { os: 'ChromeOS', version: '' };
  if (ua.includes('Linux')) return { os: 'Linux', version: '' };
  return { os: 'Unknown', version: '' };
}

function detectBrowser(ua: string): { browser: string; version: string } {
  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/(\d+(?:\.\d+)?)/);
    return { browser: 'Edge', version: match?.[1] || '' };
  }
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    const match = ua.match(/Chrome\/(\d+(?:\.\d+)?)/);
    return { browser: 'Chrome', version: match?.[1] || '' };
  }
  if (ua.includes('Firefox/')) {
    const match = ua.match(/Firefox\/(\d+(?:\.\d+)?)/);
    return { browser: 'Firefox', version: match?.[1] || '' };
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    const match = ua.match(/Version\/(\d+(?:\.\d+)?)/);
    return { browser: 'Safari', version: match?.[1] || '' };
  }
  if (ua.includes('OPR/') || ua.includes('Opera/')) {
    const match = ua.match(/OPR\/(\d+(?:\.\d+)?)/);
    return { browser: 'Opera', version: match?.[1] || '' };
  }
  return { browser: 'Unknown', version: '' };
}

function detectDeviceType(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function useDeviceInfo(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>({
    os: 'Загрузка...',
    osVersion: '',
    browser: 'Загрузка...',
    browserVersion: '',
    deviceType: 'desktop',
    location: 'Определение...',
    ip: '',
    userAgent: '',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const osInfo = detectOS(ua);
    const browserInfo = detectBrowser(ua);

    setInfo({
      os: osInfo.os,
      osVersion: osInfo.version,
      browser: browserInfo.browser,
      browserVersion: browserInfo.version,
      deviceType: detectDeviceType(ua),
      userAgent: ua,
      location: 'Москва, RU',
      ip: '',
    });

    // Try to get location from IP (free API)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          setInfo(prev => ({
            ...prev,
            location: `${data.city}, ${data.country_name}`,
            ip: data.ip,
          }));
        }
      })
      .catch(() => {
        // Fallback: use timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone) {
          setInfo(prev => ({
            ...prev,
            location: timezone.replace('/', ', '),
          }));
        }
      });
  }, []);

  return info;
}

export function formatTimeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return 'только что';
  if (diffMin < 60) return `${diffMin} мин. назад`;
  if (diffHrs < 24) return `${diffHrs} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return date.toLocaleDateString('ru-RU');
}