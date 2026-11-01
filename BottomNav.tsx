import React from 'react';
import { Home, LayoutGrid, Database, Wind } from 'lucide-react';

export type NavTab = 'home' | 'features' | 'vault' | 'breathe';

interface BottomNavProps {
  activeTab: NavTab | 'harness' | 'sankalpa';
  onTabChange: (tab: NavTab) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'features', label: 'Features', icon: LayoutGrid },
  { id: 'vault', label: 'Vault', icon: Database },
  { id: 'breathe', label: 'Breathe', icon: Wind },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 z-30 shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  if (document.documentElement) document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-colors duration-150 ${
                isActive
                  ? 'text-[#D97706]'
                  : 'text-[#64748B] hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? 'scale-110 text-[#D97706]' : 'text-[#64748B]'
                }`}
              />
              <span
                className={`text-[11px] mt-1 font-medium leading-none ${
                  isActive ? 'text-[#D97706] font-bold' : 'text-[#64748B]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
