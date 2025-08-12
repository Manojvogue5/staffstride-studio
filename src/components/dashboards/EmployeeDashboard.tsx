import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  Plus,
  Filter,
  Search,
  X
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
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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

  // Filter functions
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedDate(undefined);
    setTypeFilter('all');
    setUrgencyFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || selectedDate || typeFilter !== 'all' || urgencyFilter !== 'all';

  const getFilteredData = () => {
    let filteredData = [];
    
    switch (activeSection) {
      case 'tasks':
        filteredData = tasks.filter(task => {
          const matchesSearch = !searchQuery || 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
          const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
          const matchesDate = !selectedDate || task.dueDate === format(selectedDate, 'yyyy-MM-dd');
          
          return matchesSearch && matchesStatus && matchesPriority && matchesDate;
        });
        break;
      
      case 'leaves':
        filteredData = leaves.filter(leave => {
          const matchesSearch = !searchQuery || 
            leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.type.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
          const matchesType = typeFilter === 'all' || leave.type === typeFilter;
          const matchesDate = !selectedDate || leave.startDate === format(selectedDate, 'yyyy-MM-dd');
          
          return matchesSearch && matchesStatus && matchesType && matchesDate;
        });
        break;
        
      case 'tickets':
        filteredData = tickets.filter(ticket => {
          const matchesSearch = !searchQuery || 
            ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
          const matchesUrgency = urgencyFilter === 'all' || ticket.urgency === urgencyFilter;
          const matchesDate = !selectedDate || ticket.createdAt === format(selectedDate, 'yyyy-MM-dd');
          
          return matchesSearch && matchesStatus && matchesUrgency && matchesDate;
        });
        break;
        
      default:
        return [];
    }
    
    return filteredData;
  };

  const renderFilterPanel = () => {
    if (activeSection === 'overview' || activeSection === 'payslips' || activeSection === 'holidays') return null;

    return (
      <Card className="p-4 mb-6">
        <div className="space-y-4">
          {/* Main Filter Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center space-x-2">
                  <Filter size={16} />
                  <span>{hasActiveFilters ? 'Filters Applied' : 'All Filters'}</span>
                </div>
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                    {[
                      searchQuery && 'Search',
                      statusFilter !== 'all' && 'Status',
                      priorityFilter !== 'all' && 'Priority',
                      typeFilter !== 'all' && 'Type',
                      urgencyFilter !== 'all' && 'Urgency',
                      selectedDate && 'Date'
                    ].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filter {activeSection}</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                      <X size={14} className="mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder={`Search ${activeSection}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {activeSection === 'tasks' && (
                        <>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="inprogress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </>
                      )}
                      {activeSection === 'leaves' && (
                        <>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </>
                      )}
                      {activeSection === 'tickets' && (
                        <>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter (Tasks only) */}
                {activeSection === 'tasks' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Type Filter (Leaves only) */}
                {activeSection === 'leaves' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Urgency Filter (Tickets only) */}
                {activeSection === 'tickets' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Urgency</label>
                    <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgency</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar size={16} className="mr-2" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
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
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {searchQuery && (
                <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                  <Search size={12} className="mr-1" />
                  Search: "{searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="ml-1 h-auto p-0 text-blue-700 hover:text-blue-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
              
              {statusFilter !== 'all' && (
                <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                  Status: {statusFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 h-auto p-0 text-green-700 hover:text-green-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}

              {priorityFilter !== 'all' && (
                <div className="flex items-center bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs">
                  Priority: {priorityFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPriorityFilter('all')}
                    className="ml-1 h-auto p-0 text-orange-700 hover:text-orange-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}

              {typeFilter !== 'all' && (
                <div className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                  Type: {typeFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTypeFilter('all')}
                    className="ml-1 h-auto p-0 text-purple-700 hover:text-purple-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}

              {urgencyFilter !== 'all' && (
                <div className="flex items-center bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">
                  Urgency: {urgencyFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUrgencyFilter('all')}
                    className="ml-1 h-auto p-0 text-red-700 hover:text-red-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
              
              {selectedDate && (
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                  <Calendar size={12} className="mr-1" />
                  Date: {format(selectedDate, "MMM dd")}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(undefined)}
                    className="ml-1 h-auto p-0 text-indigo-700 hover:text-indigo-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            {activeSection !== 'overview' && `Showing ${getFilteredData().length} items`}
          </div>
        </div>
      </Card>
    );
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
        {renderFilterPanel()}
        {renderSection()}
      </div>
    </div>
  );
};