'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Trash2, Shield, Clock, MapPin, Activity, AlertTriangle } from 'lucide-react';

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
  onRevoke: (deviceId: number) => Promise<void>;
}

export function DevicesSettings({ devices, onRevoke }: DevicesSettingsProps) {
  const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);
  const [revokingIds, setRevokingIds] = useState<Set<number>>(new Set());
  const [devicesState, setDevicesState] = useState<Device[]>(devices);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const handleRevoke = async (deviceId: number) => {
    setRevokingIds(prev => new Set(prev).add(deviceId));
    await onRevoke(deviceId);
    setDevicesState(prev => prev.filter(d => d.id !== deviceId));
    setRevokingIds(prev => {
      const next = new Set(prev);
      next.delete(deviceId);
      return next;
    });
  };

  const handleRevokeAll = async () => {
    const otherDevices = devicesState.filter(d => !d.current);
    for (const device of otherDevices) {
      await handleRevoke(device.id);
    }
    setShowRevokeAllModal(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
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

        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {devicesState.map((device) => {
              const Icon = getDeviceIcon(device.type);
              const isRevoking = revokingIds.has(device.id);
              
              return (
                <motion.div
                  key={device.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className={`p-5 rounded-xl border transition-all ${
                    device.current
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/[0.08] bg-black/40 hover:border-white/10'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      device.current ? 'bg-emerald-500/15' : 'bg-white/5'
                    }`}>
                      <Icon className={`w-7 h-7 ${device.current ? 'text-emerald-400' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-sm font-medium text-white truncate">{device.name}</p>
                        {device.current && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex-shrink-0">
                            Текущее
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <Activity className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{device.os}</span>
                          {device.browser && <span className="text-gray-600">· {device.browser}</span>}
                        </div>
                        
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{device.location}</span>
                          {device.ip && <span className="text-gray-600 font-mono">({device.ip})</span>}
                        </div>
                        
                        <div className="flex items-center gap-2 text-[11px] text-gray-600">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>Активно {device.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!device.current && (
                      <motion.button
                        onClick={() => handleRevoke(device.id)}
                        disabled={isRevoking}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isRevoking ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
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
        onClick={() => setShowRevokeAllModal(true)}
        className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 font-medium text-sm hover:bg-red-500/10 transition-all duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        Завершить все другие сессии
      </motion.button>

      {/* Revoke All Confirmation Modal */}
      <AnimatePresence>
        {showRevokeAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRevokeAllModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="p-6 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Подтверждение</h3>
              </div>
              <p className="text-sm text-gray-300 mb-6">
                Вы уверены, что хотите завершить все другие сессии? Все устройства, кроме текущего, будут отключены.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevokeAllModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm"
                >
                  Отмена
                </button>
                <button
                  onClick={handleRevokeAll}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                >
                  Завершить все
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DevicesSettings;