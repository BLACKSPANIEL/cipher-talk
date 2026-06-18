'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Trash2, Download, FileJson, Image, MessageSquare, Info } from 'lucide-react';

interface StorageSettingsProps {
  onClearCache: () => void;
  onExportData: () => void;
}

export function StorageSettings({ onClearCache, onExportData }: StorageSettingsProps) {
  const storageItems = [
    { icon: MessageSquare, label: 'Сообщения', size: '2.4 GB', color: 'emerald' },
    { icon: Image, label: 'Изображения', size: '1.8 GB', color: 'cyan' },
    { icon: FileJson, label: 'Кэш данных', size: '456 MB', color: 'violet' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Storage Overview */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Использовано 4.7 GB из 10 GB</span>
            <span className="text-xs text-emerald-400">47%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[47%] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
          </div>
        </div>

        {/* Storage Items */}
        <div className="space-y-3">
          {storageItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-500">{item.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Действия</h3>
            <p className="text-[10px] text-gray-500">Управление данными</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClearCache}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-red-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Очистить кэш</p>
              <p className="text-[10px] text-gray-500">Удалить временные файлы</p>
            </div>
          </button>

          <button
            onClick={onExportData}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-emerald-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Экспорт данных</p>
              <p className="text-[10px] text-gray-500">Скачать архив с данными</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default StorageSettings;