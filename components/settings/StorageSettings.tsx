'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Trash2, Download, Upload, RefreshCw, AlertTriangle, Check, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface StorageSettingsProps {
  onClearCache?: () => Promise<void>;
  onExportData?: () => Promise<void>;
}

export function StorageSettings({ onClearCache, onExportData }: StorageSettingsProps) {
  const { t } = useLanguage();
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Realistic mock statistics
  const storageStats = {
    total: 2.4, // GB
    used: 1.8, // GB
    free: 0.6, // GB
    messages: 15680,
    media: 1240,
    files: 89,
    cache: 234,
  };

  const storageByType = [
    { type: 'messages', label: 'Сообщения', size: '1.2 GB', percentage: 67, icon: FileText, color: 'emerald' },
    { type: 'media', label: 'Медиа', size: '456 MB', percentage: 23, icon: Image, color: 'cyan' },
    { type: 'files', label: 'Файлы', size: '128 MB', percentage: 7, icon: Archive, color: 'violet' },
    { type: 'cache', label: 'Кэш', size: '64 MB', percentage: 3, icon: RefreshCw, color: 'amber' },
  ];

  const handleClearCache = async () => {
    setIsClearing(true);
    if (onClearCache) {
      await onClearCache();
    } else {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setIsClearing(false);
    setShowClearConfirm(false);
  };

  const handleExportData = async () => {
    if (onExportData) {
      await onExportData();
    } else {
      alert('Экспорт данных начат...');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Storage Overview Card */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30"
            style={{ boxShadow: '0 0 20px rgba(16,245,181,0.2)' }}>
            <HardDrive className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Хранилище</h3>
            <p className="text-xs text-zinc-500">Управление данными и кэшем</p>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Использовано: {storageStats.used} GB из {storageStats.total} GB</span>
            <span className="text-sm font-bold text-emerald-400">{Math.round((storageStats.used / storageStats.total) * 100)}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              style={{ boxShadow: '0 0 20px rgba(16,245,181,0.4)' }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-xl font-bold text-emerald-400 mb-0.5">{storageStats.messages.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Сообщений</div>
          </div>
          <div className="rounded-xl p-3 border border-cyan-500/20 bg-cyan-500/5">
            <div className="text-xl font-bold text-cyan-400 mb-0.5">{storageStats.media.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Медиа</div>
          </div>
          <div className="rounded-xl p-3 border border-violet-500/20 bg-violet-500/5">
            <div className="text-xl font-bold text-violet-400 mb-0.5">{storageStats.files.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Файлов</div>
          </div>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <h3 className="text-base font-bold text-white mb-4">Разбивка по типам</h3>
        <div className="space-y-3">
          {storageByType.map((item) => {
            const Icon = item.icon;
            const colorMap = {
              emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20',
              cyan: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/20',
              violet: 'text-violet-400 bg-violet-500/15 border-violet-500/20',
              amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
            };
            return (
              <div key={item.type} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[item.color as keyof typeof colorMap]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                    <span className="text-xs text-zinc-400">{item.size}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-cyan-500/60"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <h3 className="text-base font-bold text-white mb-4">Действия</h3>
        <div className="space-y-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleExportData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-white">Экспорт данных</div>
              <div className="text-[10px] text-zinc-500">Скачать все сообщения и медиа</div>
            </div>
            <Check className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowClearConfirm(true)}
            disabled={isClearing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all group disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-white">Очистить кэш</div>
              <div className="text-[10px] text-zinc-500">Удалить временные файлы ({storageStats.cache} MB)</div>
            </div>
            {isClearing ? (
              <RefreshCw className="w-4 h-4 text-red-400 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Clear Cache Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
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
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Очистить кэш?</h3>
                  <p className="text-xs text-zinc-400">Это действие нельзя отменить</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mb-6">
                Будут удалены временные файлы размером {storageStats.cache} MB. Ваши сообщения и медиафайлы останутся intact.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Отмена
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-400 transition-colors text-sm font-bold disabled:opacity-50"
                >
                  {isClearing ? 'Очистка...' : 'Очистить'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}