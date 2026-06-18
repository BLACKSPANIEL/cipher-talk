'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Loader2, Crown, Check } from 'lucide-react';
import { TierBadge } from '@/components/chat/TierBadge';

interface ProfileSettingsProps {
  username: string;
  bio: string;
  status: 'online' | 'offline' | 'away';
  tier?: string;
  onSave: (username: string, bio: string, status: 'online' | 'offline' | 'away') => Promise<void>;
  isSaving: boolean;
  saveMessage: { type: 'success' | 'error'; text: string } | null;
}

const STATUS_EMOJIS = ['🟢', '🟡', '🔴', '🌙', '⚡', '🔥', '💤', '🎮'];

export function ProfileSettings({
  username,
  bio,
  status,
  tier,
  onSave,
  isSaving,
  saveMessage,
}: ProfileSettingsProps) {
  const [localUsername, setLocalUsername] = useState(username);
  const [localBio, setLocalBio] = useState(bio);
  const [localStatus, setLocalStatus] = useState(status);
  const [statusEmoji, setStatusEmoji] = useState('🟢');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(localUsername, localBio, localStatus);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Avatar Section */}
      <div className="flex justify-center">
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(16,245,181,0.25)] transition-all duration-300 group-hover:shadow-[0_0_70px_rgba(16,245,181,0.35)] group-hover:border-emerald-500/40">
            <span className="text-5xl">🎮</span>
          </div>
          <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
            <Camera className="w-10 h-10 text-white" />
            <span className="text-[10px] text-white font-medium">Загрузить фото</span>
          </div>
        </div>
      </div>

      {/* Status Emoji Grid */}
      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Эмодзи статуса
        </label>
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar p-3 rounded-xl bg-black/30 border border-white/5">
          {STATUS_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setStatusEmoji(emoji)}
              className={`w-10 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center text-lg ${
                statusEmoji === emoji
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-110'
                  : 'border-white/10 hover:border-white/20 hover:scale-105'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Username Input */}
      <div>
        <label htmlFor="settings-username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Никнейм
        </label>
        <input
          id="settings-username"
          type="text"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
        />
      </div>

      {/* Bio Input */}
      <div>
        <label htmlFor="settings-bio" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          О себе
        </label>
        <textarea
          id="settings-bio"
          value={localBio}
          onChange={(e) => setLocalBio(e.target.value)}
          rows={3}
          placeholder="Расскажите о себе..."
          className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm resize-none"
        />
      </div>

      {/* Status Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Статус
        </label>
        <div className="flex gap-3">
          {[
            { value: 'online' as const, label: 'В сети', emoji: '🟢' },
            { value: 'away' as const, label: 'Отошёл', emoji: '🟡' },
            { value: 'offline' as const, label: 'Не в сети', emoji: '🔴' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLocalStatus(opt.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all flex-1 justify-center ${
                localStatus === opt.value
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ELITE Tier Badge */}
      {tier && tier !== 'free' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Crown className="w-5 h-5 text-amber-400" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-amber-400">Тариф {tier.toUpperCase()}</p>
              <TierBadge tier={tier as any} size="sm" />
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Назначен администратором</p>
          </div>
        </div>
      )}

      {/* Save Message */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {saveMessage.type === 'success' && <Check className="w-4 h-4" />}
          {saveMessage.text}
        </motion.div>
      )}

      {/* Save Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Сохранить изменения
          </>
        )}
      </button>
    </motion.div>
  );
}

export default ProfileSettings;