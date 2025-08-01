import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, Moon, Sun } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header className="bg-white border-b border-border shadow-[var(--shadow-soft)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-foreground">
            {getPageTitle(user?.role)}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings size={20} />
          </Button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const getPageTitle = (role?: string) => {
  switch (role) {
    case 'employee':
      return 'Employee Dashboard';
    case 'hr':
      return 'HR Management';
    case 'admin':
      return 'Admin Portal';
    default:
      return 'Dashboard';
  }
};