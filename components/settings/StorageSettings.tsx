'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Trash2, Download, FileJson, Image, MessageSquare, Info, BarChart3 } from 'lucide-react';

interface StorageSettingsProps {
  onClearCache: () => void;
  onExportData: () => void;
}

export function StorageSettings({ onClearCache, onExportData }: StorageSettingsProps) {
  const storageData = {
    total: 10 * 1024 * 1024 * 1024, // 10 GB
    used: 4.7 * 1024 * 1024 * 1024, // 4.7 GB
    categories: [
      { 
        icon: MessageSquare, 
        label: 'Сообщения', 
        size: 2.4 * 1024 * 1024 * 1024, 
        color: 'emerald',
        percent: 51 
      },
      { 
        icon: Image, 
        label: 'Изображения и видео', 
        size: 1.8 * 1024 * 1024 * 1024, 
        color: 'cyan',
        percent: 38 
      },
      { 
        icon: FileJson, 
        label: 'Кэш и временные файлы', 
        size: 456 * 1024 * 1024, 
        color: 'violet',
        percent: 10 
      },
      { 
        icon: BarChart3, 
        label: 'Прочие данные', 
        size: 44 * 1024 * 1024, 
        color: 'amber',
        percent: 1 
      },
    ],
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const usedPercent = (storageData.used / storageData.total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Storage Overview */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Хранилище</h3>
            <p className="text-[10px] text-gray-500">Использование памяти</p>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm text-white font-medium">{formatSize(storageData.used)}</span>
              <span className="text-xs text-gray-500 ml-2">из {formatSize(storageData.total)}</span>
            </div>
            <span className="text-sm text-emerald-400 font-semibold">{usedPercent.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${usedPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Storage Categories */}
        <div className="space-y-3">
          {storageData.categories.map((category) => (
            <div key={category.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${category.color}-500/10 flex items-center justify-center`}>
                    <category.icon className={`w-4 h-4 text-${category.color}-400`} />
                  </div>
                  <span className="text-sm text-white">{category.label}</span>
                </div>
                <span className="text-xs text-gray-400">{formatSize(category.size)}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden ml-11">
                <motion.div 
                  className={`h-full bg-${category.color}-500/60 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Действия с данными</h3>
            <p className="text-[10px] text-gray-500">Управление хранилищем</p>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={onClearCache}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-red-500/30 transition-all group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Очистить кэш</p>
              <p className="text-[10px] text-gray-500">Освободить ~456 MB</p>
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
              <p className="text-[10px] text-gray-500">Скачать архив (4.7 GB)</p>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default StorageSettings;