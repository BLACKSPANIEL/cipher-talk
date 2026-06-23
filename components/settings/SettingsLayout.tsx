'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';

export type SettingsTab = 'profile' | 'account' | 'security' | 'notifications' | 'appearance' | 'language' | 'devices' | 'storage' | 'about';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  username: string;
  status: string;
  tier?: string;
  onLogout: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export function SettingsLayout({
  children,
  activeTab,
  onTabChange,
  username,
  status,
  tier,
  onLogout,
  isModal = false,
  onClose,
}: SettingsLayoutProps) {
  return (
    <div className={isModal ? 'h-full' : 'min-h-screen bg-[#05070d] flex items-center justify-center p-4 md:p-8'}>
      {/* Main Premium Glass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`backdrop-blur-2xl bg-[#0a0f17]/95 border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(16,245,181,0.08)] rounded-3xl flex overflow-hidden ${isModal ? 'h-full md:h-[90vh] w-full md:max-w-6xl md:rounded-3xl rounded-none' : 'w-full max-w-6xl h-[750px]'} relative`}
      >
        {/* Premium inner glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-cyan-500/[0.02] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Ambient glow orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/[0.04] blur-3xl pointer-events-none" />

        {/* Version Badge */}
        <div className="absolute top-5 right-5 z-20">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] text-gray-500 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm"
          >
            v2.1 Glassmorphism{isModal ? ' Modal' : ''}
          </motion.span>
        </div>

        {/* Close button for modal */}
        {isModal && onClose && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(16,245,181,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-5 left-5 z-20 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-emerald-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </motion.button>
        )}

        {/* Left Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          username={username}
          status={status}
          tier={tier}
          onLogout={onLogout}
        />

        {/* Right Content Area */}
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar pr-4 pl-2 py-10 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <div className="w-full flex flex-col gap-10">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsLayout;