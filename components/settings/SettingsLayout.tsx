'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={isModal ? 'h-full' : 'min-h-screen bg-[#05070d] flex items-center justify-center p-0 md:p-6 lg:p-8'}>
      {/* Main Premium Glass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`backdrop-blur-2xl bg-[#0a0f17]/95 border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(16,245,181,0.08)] flex overflow-hidden relative ${
          isModal
            ? 'h-full w-full md:rounded-3xl rounded-none'
            : 'w-full max-w-7xl h-[100dvh] md:h-[850px] md:rounded-3xl'
        }`}
      >
        {/* Premium inner glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-cyan-500/[0.02] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Ambient glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/[0.04] blur-3xl pointer-events-none" />

        {/* Version Badge */}
        <div className="absolute top-4 right-4 z-20 hidden md:block">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] text-gray-500 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm"
          >
            v2.1 Premium
          </motion.span>
        </div>

        {/* Close button for modal — top right corner */}
        {isModal && onClose && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(16,245,181,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-emerald-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </motion.button>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden absolute top-4 left-4 z-50 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/10 bg-black/40 backdrop-blur-xl"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-[#0a0f17] border-r border-white/10 shadow-2xl"
              >
                <div className="pt-16 pb-4 h-full overflow-y-auto">
                  <SettingsSidebar
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                      onTabChange(tab);
                      setMobileMenuOpen(false);
                    }}
                    username={username}
                    status={status}
                    tier={tier}
                    onLogout={onLogout}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Two-panel layout: Sidebar + Content */}
        <div className="flex flex-row h-full w-full">
          {/* Left Sidebar — fixed width, hidden on mobile */}
          <div className="hidden md:block w-[280px] flex-shrink-0 h-full border-r border-white/5">
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={onTabChange}
              username={username}
              status={status}
              tier={tier}
              onLogout={onLogout}
            />
          </div>

          {/* Right Content Area — fills remaining space with independent scroll */}
          <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative z-10">
            <div className="p-4 md:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <div className="w-full flex flex-col gap-6 md:gap-8">
                    {children}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Bottom spacer for mobile */}
            <div className="h-6 md:h-0" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsLayout;