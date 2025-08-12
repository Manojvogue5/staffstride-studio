import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CalendarDays,
  Edit,
  Trash2,
  Download,
  Plus
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { DashboardNav } from '@/components/navigation/DashboardNav';
import { EmployeeTasks } from '@/components/sections/employee/EmployeeTasks';
import { EmployeeLeaves } from '@/components/sections/employee/EmployeeLeaves';
import { EmployeeTickets } from '@/components/sections/employee/EmployeeTickets';
import { EmployeePayslips } from '@/components/sections/employee/EmployeePayslips';
import { EmployeeHolidays } from '@/components/sections/employee/EmployeeHolidays';
import { CheckInOut } from '@/components/features/CheckInOut';
import { Task, LeaveRequest, Ticket, Holiday, Payslip } from '@/types/user';

const stats = [
  {
    title: 'Active Tasks',
    value: '12',
    change: '+2 from last week',
    icon: CheckSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Pending Leaves',
    value: '2',
    change: 'Awaiting approval',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Open Tickets',
    value: '1',
    change: 'Response pending',
    icon: MessageSquare,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'This Month Hours',
    value: '160h',
    change: '8h today',
    icon: Clock,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

// Mock data - in real app this would come from state management or API
const mockTasks: Task[] = [
  { 
    id: '1', 
    title: 'Complete project documentation', 
    description: 'Write comprehensive documentation for the new project',
    priority: 'high', 
    status: 'inprogress',
    dueDate: '2024-12-18',
    createdAt: '2024-12-15',
    userId: '1'
  },
  { 
    id: '2', 
    title: 'Review code changes', 
    description: 'Review pull requests from team members',
    priority: 'medium', 
    status: 'todo',
    dueDate: '2024-12-19',
    createdAt: '2024-12-16',
    userId: '1'
  },
  { 
    id: '3', 
    title: 'Team meeting preparation', 
    description: 'Prepare agenda and materials for weekly team meeting',
    priority: 'low', 
    status: 'completed',
    dueDate: '2024-12-20',
    createdAt: '2024-12-17',
    userId: '1'
  }
];

const mockLeaves: LeaveRequest[] = [
  { 
    id: '1',
    userId: '1',
    type: 'vacation', 
    startDate: '2024-12-25',
    endDate: '2024-12-30',
    reason: 'Christmas holidays',
    status: 'approved',
    appliedAt: '2024-12-10'
  },
  { 
    id: '2',
    userId: '1',
    type: 'sick', 
    startDate: '2025-01-05',
    endDate: '2025-01-05',
    reason: 'Medical appointment',
    status: 'pending',
    appliedAt: '2024-12-15'
  }
];

const mockTickets: Ticket[] = [
  {
    id: '1',
    userId: '1',
    title: 'Computer running slow',
    description: 'My laptop has been running very slowly for the past few days',
    urgency: 'medium',
    status: 'pending',
    createdAt: '2024-12-17'
  }
];

const mockHolidays: Holiday[] = [
  {
    id: '1',
    name: 'Christmas Day',
    date: '2024-12-25',
    type: 'mandatory',
    description: 'Public holiday'
  },
  {
    id: '2',
    name: 'New Year\'s Day',
    date: '2025-01-01',
    type: 'mandatory',
    description: 'Public holiday'
  },
  {
    id: '3',
    name: 'Republic Day (Optional)',
    date: '2025-01-26',
    type: 'optional',
    description: 'Optional holiday'
  }
];

const mockPayslips: Payslip[] = [
  {
    id: '1',
    userId: '1',
    month: 'November',
    year: 2024,
    fileName: 'payslip_nov_2024.pdf',
    uploadedAt: '2024-12-01',
    uploadedBy: 'HR Team'
  },
  {
    id: '2',
    userId: '1',
    month: 'October',
    year: 2024,
    fileName: 'payslip_oct_2024.pdf',
    uploadedAt: '2024-11-01',
    uploadedBy: 'HR Team'
  }
];

export const EmployeeDashboard: React.FC = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskModalMode, setTaskModalMode] = useState<'add' | 'edit'>('add');
  
  // State for data
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  
  // Handlers
  const handleAddTask = () => {
    setSelectedTask(null);
    setTaskModalMode('add');
    setIsTaskModalOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode('edit');
    setIsTaskModalOpen(true);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskModalMode === 'add') {
      const newTask: Task = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        createdAt: new Date().toISOString(),
        ...taskData as Omit<Task, 'id' | 'userId' | 'createdAt'>
      };
      setTasks([...tasks, newTask]);
    } else if (selectedTask) {
      setTasks(tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData }
          : task
      ));
    }
  };
  
  const handleSubmitLeave = (leaveData: Partial<LeaveRequest>) => {
    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      ...leaveData as Omit<LeaveRequest, 'id' | 'userId'>
    };
    setLeaves([...leaves, newLeave]);
  };
  
  const handleSubmitTicket = (ticketData: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      ...ticketData as Omit<Ticket, 'id' | 'userId'>
    };
    setTickets([...tickets, newTicket]);
  };
  
  const handleDownloadPayslip = (payslip: Payslip) => {
    // Mock download - in real app this would trigger actual file download
    alert(`Downloading ${payslip.fileName}...`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'tasks': return <EmployeeTasks searchQuery={searchQuery} />;
      case 'leaves': return <EmployeeLeaves searchQuery={searchQuery} />;
      case 'tickets': return <EmployeeTickets searchQuery={searchQuery} />;
      case 'payslips': return <EmployeePayslips searchQuery={searchQuery} />;
      case 'holidays': return <EmployeeHolidays searchQuery={searchQuery} />;
      default: return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-professional bg-[var(--gradient-card)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your work today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <CalendarDays className="text-primary mb-2" size={24} />
              <p className="text-sm font-medium">Today</p>
              <p className="text-lg font-bold text-foreground">Dec 18, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="card-professional hover-lift animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Check In/Out Section */}
      <CheckInOut />
    </div>
  );

  return (
    <div>
      <DashboardNav 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="p-6">
        {renderSection()}
      </div>
    </div>
  );
};