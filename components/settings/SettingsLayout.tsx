'use client';

// Fixed: SettingsTab union type + strict typing

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
  const containerClasses = isModal
    ? 'h-full md:h-[90vh] w-full md:max-w-5xl md:rounded-2xl rounded-none'
    : 'w-full max-w-5xl h-[650px]';

  return (
    <div className={isModal ? 'h-full' : 'min-h-screen bg-[#0e0f12] flex items-center justify-center p-4'}>
      {/* Main Glass Container */}
      <div className={`backdrop-blur-xl bg-[#0e0f12]/90 border border-white/[0.08] shadow-[0_25px_50px_rgba(0,0,0,0.7)] rounded-2xl flex overflow-hidden ${containerClasses} relative`}>
        
        {/* Version Indicator */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] text-gray-600 font-mono bg-black/30 px-2 py-1 rounded-lg border border-white/5">
            v2.1 Glassmorphism{isModal ? ' Modal' : ''}
          </span>
        </div>

        {/* Close button for modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
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

        {/* Right Content Area — scrollbar прижат к правому краю */}
        <div className={`flex-1 h-full overflow-y-auto custom-scrollbar pr-4 ${isModal ? 'p-4 md:p-6' : 'py-6 pl-6'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              {/* Внутренний контейнер — все отступы здесь, а не на родителе */}
              <div className="w-full flex flex-col gap-6">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;