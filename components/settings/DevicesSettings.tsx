'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Laptop, Shield, ShieldCheck, ShieldOff, MapPin, Clock, LogOut, Trash2, Check, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'laptop';
  os: string;
  browser?: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  isTrusted: boolean;
}

interface DevicesSettingsProps {
  devices?: Device[];
  onRevoke?: (id: string) => Promise<void>;
}

export function DevicesSettings({ devices: externalDevices, onRevoke }: DevicesSettingsProps) {
  const { t } = useLanguage();
  const [internalDevices, setInternalDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro 16"',
      type: 'laptop',
      os: 'macOS 14.5',
      browser: 'Chrome 125',
      location: 'Москва, Россия',
      ip: '192.168.1.xxx',
      lastActive: 'Сейчас',
      isCurrent: true,
      isTrusted: true,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      os: 'iOS 17.5',
      location: 'Москва, Россия',
      ip: '192.168.1.xxx',
      lastActive: '2 часа назад',
      isCurrent: false,
      isTrusted: true,
    },
    {
      id: '3',
      name: 'Windows Desktop',
      type: 'desktop',
      os: 'Windows 11',
      browser: 'Edge 125',
      location: 'Санкт-Петербург, Россия',
      ip: '192.168.2.xxx',
      lastActive: '3 дня назад',
      isCurrent: false,
      isTrusted: false,
    },
    {
      id: '4',
      name: 'iPad Air',
      type: 'tablet',
      os: 'iPadOS 17.5',
      location: 'Москва, Россия',
      ip: '192.168.1.xxx',
      lastActive: '1 неделю назад',
      isCurrent: false,
      isTrusted: true,
    },
  ]);

  const [showRevokeConfirm, setShowRevokeConfirm] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const devices = externalDevices || internalDevices;
  const setDevices = externalDevices ? (() => {}) : setInternalDevices;

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      case 'laptop': return Laptop;
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    setIsRevoking(true);
    if (onRevoke) {
      await onRevoke(deviceId);
    } else {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    }
    setIsRevoking(false);
    setShowRevokeConfirm(null);
  };

  const handleRevokeAll = async () => {
    setIsRevoking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDevices(prev => prev.filter(d => d.isCurrent));
    setIsRevoking(false);
  };

  const trustedCount = devices.filter(d => d.isTrusted).length;
  const currentDevice = devices.find(d => d.isCurrent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Current Device Card */}
      {currentDevice && (
        <div className="rounded-3xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-2xl"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 30px rgba(16,245,181,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Текущее устройство</h3>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/30"
              style={{ boxShadow: '0 0 20px rgba(16,245,181,0.2)' }}>
              {(() => {
                const Icon = getDeviceIcon(currentDevice.type);
                return <Icon className="w-7 h-7 text-emerald-400" />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-white mb-1">{currentDevice.name}</h4>
              <p className="text-xs text-zinc-400 mb-2">{currentDevice.os} {currentDevice.browser && `· ${currentDevice.browser}`}</p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{currentDevice.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentDevice.lastActive}</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Активно</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Доверенных</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{trustedCount}</div>
        </div>
        <div className="rounded-2xl p-4 border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Всего</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{devices.length}</div>
        </div>
      </div>

      {/* Devices List */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Все устройства</h3>
          {devices.length > 1 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRevokeAll}
              disabled={isRevoking}
              className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 font-medium"
            >
              Завершить все сессии
            </motion.button>
          )}
        </div>
        <div className="space-y-2.5">
          <AnimatePresence>
            {devices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`p-4 rounded-xl border transition-all ${
                    device.isCurrent
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      device.isCurrent ? 'bg-emerald-500/15 ring-1 ring-emerald-500/30' : 'bg-white/5'
                    }`}>
                      <Icon className={`w-5 h-5 ${device.isCurrent ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white truncate">{device.name}</h4>
                        {device.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                            Сейчас
                          </span>
                        )}
                        {device.isTrusted && !device.isCurrent && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mb-1.5">{device.os} {device.browser && `· ${device.browser}`}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{device.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{device.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    {!device.isCurrent && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowRevokeConfirm(device.id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                        title="Завершить сессию"
                      >
                        <LogOut className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      <AnimatePresence>
        {showRevokeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRevokeConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl p-6 border border-red-500/30 bg-[#0a0f17] backdrop-blur-2xl max-w-sm w-full"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center">
                  <ShieldOff className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Завершить сессию?</h3>
                  <p className="text-xs text-zinc-400">Устройство потеряет доступ</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mb-6">
                Это устройство будет отключено от вашего аккаунта. Для повторного входа потребуется аутентификация.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowRevokeConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Отмена
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => showRevokeConfirm && handleRevokeDevice(showRevokeConfirm)}
                  disabled={isRevoking}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-400 transition-colors text-sm font-bold disabled:opacity-50"
                >
                  {isRevoking ? 'Отключение...' : 'Отключить'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}