'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Trash2, Shield, Clock } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface DevicesSettingsProps {
  devices: Device[];
  onRevoke: (deviceId: number) => void;
}

export function DevicesSettings({ devices, onRevoke }: DevicesSettingsProps) {
  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Active Sessions */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Активные устройства</h3>
            <p className="text-[10px] text-gray-500">Устройства, где вы авторизованы</p>
          </div>
        </div>

        <div className="space-y-3">
          {devices.map((device) => {
            const Icon = getDeviceIcon(device.type);
            return (
              <div
                key={device.id}
                className={`p-4 rounded-xl border transition-all ${
                  device.current
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/[0.08] bg-black/40 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    device.current ? 'bg-emerald-500/15' : 'bg-white/5'
                  }`}>
                    <Icon className={`w-6 h-6 ${device.current ? 'text-emerald-400' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{device.name}</p>
                      {device.current && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          Текущее
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mb-2">{device.os} · {device.location}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>Активно {device.lastActive}</span>
                    </div>
                  </div>
                  {!device.current && (
                    <button
                      onClick={() => onRevoke(device.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-6 rounded-2xl bg-black/30 border border-cyan-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Безопасность устройств</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Если вы не узнаёте какое-либо устройство, завершите его сессию. 
              Все активные сессии будут автоматически завершены при смене пароля.
            </p>
          </div>
        </div>
      </div>

      {/* Revoke All Button */}
      <button className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all duration-200">
        Завершить все другие сессии
      </button>
    </motion.div>
  );
}

export default DevicesSettings;