'use client';

import React from 'react';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';

type SettingsTab = 'profile' | 'security' | 'language';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  username: string;
  status: string;
  tier?: string;
  onLogout: () => void;
}

export function SettingsLayout({
  children,
  activeTab,
  onTabChange,
  username,
  status,
  tier,
  onLogout,
}: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center p-4">
      {/* Main Glass Container */}
      <div className="backdrop-blur-xl bg-[#0e0f12]/90 border border-white/[0.08] shadow-[0_25px_50px_rgba(0,0,0,0.7)] rounded-2xl flex overflow-hidden min-h-[550px] w-full max-w-4xl relative">
        
        {/* Version Indicator */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] text-gray-600 font-mono bg-black/30 px-2 py-1 rounded-lg border border-white/5">
            v2.1 Glassmorphism
          </span>
        </div>

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
        <div className="flex-1 p-6 overflow-y-auto max-h-[550px] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SettingsLayout;