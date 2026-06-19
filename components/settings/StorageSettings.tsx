'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Trash2, Download, FileJson, Image, MessageSquare, Info, BarChart3, X } from 'lucide-react';
import { useStorageInfo } from '@/lib/hooks/useStorageInfo';

interface StorageSettingsProps {
  onClearCache: () => Promise<void>;
  onExportData: () => Promise<void>;
}

const CATEGORIES = [
  { key: 'messages' as const, icon: MessageSquare, label: 'Сообщения', color: 'emerald' as const },
  { key: 'media' as const, icon: Image, label: 'Изображения и видео', color: 'cyan' as const },
  { key: 'cache' as const, icon: FileJson, label: 'Кэш и временные файлы', color: 'violet' as const },
  { key: 'other' as const, icon: BarChart3, label: 'Прочие данные', color: 'amber' as const },
];

const COLOR_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500',
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
};

const ICON_COLOR_MAP: Record<string, string> = {
  emerald: 'text-emerald-400',
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  amber: 'text-amber-400',
};

export function StorageSettings({ onClearCache: onClearCacheExternal, onExportData }: StorageSettingsProps) {
  const { storage, clearCache: hookClearCache, isClearing } = useStorageInfo();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const usedPercent = storage.used > 0 ? (storage.used / storage.total) * 100 : 0;

  const handleClearCache = async () => {
    setShowClearConfirm(false);
    await hookClearCache();
    await onClearCacheExternal();
  };

  const getCategorySizes = () => {
    const c = storage.categories;
    const used = storage.used || 1;
    return [
      { size: c.messages, percent: (c.messages / used) * 100 },
      { size: c.media, percent: (c.media / used) * 100 },
      { size: c.cache, percent: (c.cache / used) * 100 },
      { size: c.other, percent: (c.other / used) * 100 },
    ];
  };

  const categorySizes = getCategorySizes();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-8"
    >
      {/* Storage Overview Card */}
      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Хранилище</h3>
            <p className="text-[10px] text-gray-500">Использование памяти</p>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm text-white font-medium">{formatSize(storage.used)}</span>
              <span className="text-xs text-gray-500 ml-2">из {formatSize(storage.total)}</span>
            </div>
            <span className="text-sm text-emerald-400 font-semibold">{usedPercent.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden w-full">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${usedPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Storage Categories */}
        <div className="flex flex-col gap-4 w-full">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const sizeData = categorySizes[idx];

            return (
              <motion.div 
                key={cat.key} 
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${cat.color}-500/10 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${ICON_COLOR_MAP[cat.color]}`} />
                    </div>
                    <span className="text-sm text-white">{cat.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatSize(sizeData.size)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full">
                  <motion.div 
                    className={`h-full ${COLOR_MAP[cat.color]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(sizeData.percent, 0.5)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions Card */}
      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Действия с данными</h3>
            <p className="text-[10px] text-gray-500">Управление хранилищем</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <motion.button
            onClick={() => setShowClearConfirm(true)}
            disabled={isClearing}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-red-500/30 transition-all group disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Очистить кэш</p>
              <p className="text-[10px] text-gray-500">
                {isClearing ? 'Очистка...' : `Освободить ~${formatSize(storage.categories.cache)}`}
              </p>
            </div>
          </motion.button>

          <motion.button
            onClick={onExportData}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-emerald-500/30 transition-all group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Экспорт данных</p>
              <p className="text-[10px] text-gray-500">Скачать архив ({formatSize(storage.used)})</p>
            </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="p-6 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Подтверждение</h3>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-300 mb-6">
                Вы уверены, что хотите очистить кэш? Это освободит ~{formatSize(storage.categories.cache)}.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm"
                >
                  Отмена
                </button>
                <button
                  onClick={handleClearCache}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                >
                  Очистить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default StorageSettings;