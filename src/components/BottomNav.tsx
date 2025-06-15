
import { Home, FileText, Compass, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'betslip', label: 'Betslip', icon: FileText },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-emerald-400 bg-emerald-500/10" 
                  : "text-slate-400 hover:text-slate-300"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
