
import React from 'react';
import { Home, Tag, Repeat, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'promotions', icon: Tag, label: 'Ofertas' },
    { id: 'compare', icon: Repeat, label: 'Comparar' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 pb-safe transition-colors">
      <div className="max-w-md mx-auto flex justify-between px-6 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className="flex flex-col items-center gap-1 p-2 group"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-200 dark:shadow-emerald-950/40' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
