import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  CalendarDays,
  CheckSquare,
  Search,
  LogOut,
  UserCheck,
  BarChart3,
  Shield,
  Filter
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface DashboardNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  activeSection,
  onSectionChange,
  searchQuery,
  onSearchChange
}) => {
  const { user, logout } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const getNavItems = () => {
    switch (user?.role) {
      case 'employee':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
          { id: 'leaves', label: 'Leaves', icon: Calendar },
          { id: 'tickets', label: 'Tickets', icon: MessageSquare },
          { id: 'payslips', label: 'Payslips', icon: FileText },
          { id: 'holidays', label: 'Holidays', icon: CalendarDays }
        ];
      case 'hr':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'leave-management', label: 'Leave Management', icon: Calendar },
          { id: 'complaint-box', label: 'Complaint Box', icon: MessageSquare },
          { id: 'payslip-upload', label: 'Payslip Upload', icon: FileText },
          { id: 'holiday-management', label: 'Holiday Management', icon: CalendarDays },
          { id: 'attendance', label: 'Attendance', icon: UserCheck }
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'team-performance', label: 'Team Performance', icon: BarChart3 },
          { id: 'complaint-box', label: 'Complaint Box', icon: MessageSquare },
          { id: 'leave-management', label: 'Leave Management', icon: Calendar },
          { id: 'attendance', label: 'Attendance Overview', icon: UserCheck },
          { id: 'system-control', label: 'System Control', icon: Shield }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon size={16} />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Filter size={16} className="mr-2" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Filter by Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Sign Out */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};