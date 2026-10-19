import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  badge?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
  idPrefix?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
  idPrefix = 'tab',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-[#E3DED5] overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative py-3 px-3.5 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              isActive ? 'text-[#1F2421]' : 'text-[#7A817B] hover:text-[#1F2421]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  isActive
                    ? 'bg-[#E4ECE7] text-[#24473B]'
                    : 'bg-[#EFEBE4] text-[#7A817B]'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-xs bg-[#F4E6DF] text-[#B5654A]">
                {tab.badge}
              </span>
            )}
            {isActive && variant === 'underline' && (
              <motion.div
                layoutId={`tab-underline-${idPrefix}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#24473B]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
