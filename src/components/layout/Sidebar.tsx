import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  MessageSquare,
  Users,
  ClipboardList,
  CalendarDays,
  TicketIcon,
  Settings,
  LogOut,
  UserCog,
  BarChart3,
  Search,
  Shield
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/user';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['employee', 'hr', 'admin']
  },
  // Employee specific
  {
    name: 'My Tasks',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['employee']
  },
  {
    name: 'Leave Requests',
    href: '/leaves',
    icon: Calendar,
    roles: ['employee']
  },
  {
    name: 'Payslips',
    href: '/payslips',
    icon: FileText,
    roles: ['employee']
  },
  {
    name: 'Tickets',
    href: '/tickets',
    icon: MessageSquare,
    roles: ['employee']
  },
  {
    name: 'Holidays',
    href: '/holidays',
    icon: CalendarDays,
    roles: ['employee']
  },
  // HR specific
  {
    name: 'Employees',
    href: '/employees',
    icon: Users,
    roles: ['hr', 'admin']
  },
  {
    name: 'Leave Management',
    href: '/leave-management',
    icon: ClipboardList,
    roles: ['hr', 'admin']
  },
  {
    name: 'Payslip Management',
    href: '/payslip-management',
    icon: FileText,
    roles: ['hr', 'admin']
  },
  {
    name: 'Complaint Box',
    href: '/complaints',
    icon: TicketIcon,
    roles: ['hr', 'admin']
  },
  {
    name: 'Holiday Management',
    href: '/holiday-management',
    icon: CalendarDays,
    roles: ['hr', 'admin']
  },
  // Admin specific
  {
    name: 'User Management',
    href: '/user-management',
    icon: UserCog,
    roles: ['admin']
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    name: 'Search & Monitor',
    href: '/search',
    icon: Search,
    roles: ['admin']
  },
  {
    name: 'System Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin']
  }
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useUser();

  if (!user) return null;

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  );

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'employee': return CheckSquare;
      case 'hr': return Users;
      case 'admin': return Shield;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="h-screen w-64 bg-[var(--gradient-sidebar)] text-white shadow-[var(--shadow-card)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <RoleIcon size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">EMS Portal</h2>
            <p className="text-white/70 text-sm capitalize">{user.role}</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-white/70 text-xs">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} className="mr-3" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full text-white hover:bg-white/10 justify-start"
        >
          <LogOut size={20} className="mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};