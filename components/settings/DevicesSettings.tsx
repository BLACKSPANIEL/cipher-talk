'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Trash2, Shield, Clock, MapPin, Globe, Activity } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser?: string;
  location: string;
  ip?: string;
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

  const getDeviceTypeLabel = (type: Device['type']) => {
    switch (type) {
      case 'mobile': return 'Мобильное устройство';
      case 'tablet': return 'Планшет';
      default: return 'Компьютер';
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
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
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
              <motion.div
                key={device.id}
                className={`p-5 rounded-xl border transition-all ${
                  device.current
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/[0.08] bg-black/40 hover:border-white/10'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    device.current ? 'bg-emerald-500/15' : 'bg-white/5'
                  }`}>
                    <Icon className={`w-7 h-7 ${device.current ? 'text-emerald-400' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium text-white truncate">{device.name}</p>
                      {device.current && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          Текущее
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Activity className="w-3 h-3" />
                        <span>{device.os}</span>
                        {device.browser && <span className="text-gray-600">· {device.browser}</span>}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{device.location}</span>
                        {device.ip && <span className="text-gray-600 font-mono">({device.ip})</span>}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Активно {device.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!device.current && (
                    <motion.button
                      onClick={() => onRevoke(device.id)}
                      className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-6 rounded-2xl bg-black/30 border border-cyan-500/20 backdrop-blur-xl">
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
      <motion.button 
        className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        Завершить все другие сессии
      </motion.button>
    </motion.div>
  );
}

export default DevicesSettings;