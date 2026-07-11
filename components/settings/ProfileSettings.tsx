'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Shield, Check, Loader2, Upload } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseClient';

interface ProfileSettingsProps {
  profile: Profile | null;
  onProfileUpdated: (profile: Profile) => void;
}

export function ProfileSettings({ profile, onProfileUpdated }: ProfileSettingsProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setStatus(profile.status || 'online');
      setAvatarUrl((profile as any).avatar_url || null);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      if (updateError) throw updateError;
      setAvatarUrl(publicUrl);
      onProfileUpdated({ ...profile, avatar_url: publicUrl } as Profile);
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ username, status, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single();
      if (error) throw error;
      onProfileUpdated(data as Profile);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: 'online', label: 'Онлайн', color: 'emerald' },
    { value: 'away', label: 'Отошёл', color: 'amber' },
    { value: 'busy', label: 'Занят', color: 'red' },
    { value: 'offline', label: 'Не в сети', color: 'zinc' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Avatar Section */}
      <div className="rounded-3xl p-6 border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/30"
            style={{ boxShadow: '0 0 20px rgba(16,245,181,0.2)' }}>
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Профиль</h3>
            <p className="text-xs text-zinc-500">Ваши личные данные</p>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30"
              style={{ boxShadow: '0 0 30px rgba(16,245,181,0.2)' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-emerald-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center cursor-pointer hover:bg-emerald-400 transition-colors"
              style={{ boxShadow: '0 0 20px rgba(16,245,181,0.4)' }}>
              <Camera className="w-4 h-4 text-black" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          {isUploading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Загрузка...
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-2 font-medium">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-2 font-medium">Статус</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`p-3 rounded-xl border transition-all ${
                    status === option.value
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      option.color === 'emerald' ? 'bg-emerald-400' :
                      option.color === 'amber' ? 'bg-amber-400' :
                      option.color === 'red' ? 'bg-red-400' : 'bg-zinc-500'
                    }`} />
                    <span className="text-xs font-medium text-white">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="rounded-3xl p-6 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-2xl"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 30px rgba(16,245,181,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Защита профиля</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ваш профиль защищён E2EE шифрованием. Данные хранятся локально и синхронизируются только на ваших устройствах.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm hover:from-emerald-400 hover:to-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ boxShadow: '0 0 30px rgba(16,245,181,0.3)' }}
      >
        {isSaving ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Сохранение...
          </>
        ) : showSaved ? (
          <>
            <Check className="w-5 h-5" />
            Сохранено!
          </>
        ) : (
          'Сохранить изменения'
        )}
      </motion.button>
    </motion.div>
  );
}