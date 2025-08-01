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
import { TaskModal } from '@/components/modals/TaskModal';
import { LeaveModal } from '@/components/modals/LeaveModal';
import { TicketModal } from '@/components/modals/TicketModal';
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

  return (
    <div className="space-y-6">
      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={taskModalMode}
      />
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleSubmitLeave}
      />
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmit={handleSubmitTicket}
      />
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Management */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">My Tasks</h3>
            <Button variant="outline" size="sm" onClick={handleAddTask}>
              <Plus size={16} className="mr-1" />
              Add Task
            </Button>
          </div>
          
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckSquare 
                    size={16} 
                    className={`${task.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} 
                  />
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`status-${task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'pending' : 'success'}`}>
                    {task.priority}
                  </span>
                  <span className={`status-${task.status === 'completed' ? 'success' : task.status === 'inprogress' ? 'pending' : 'warning'}`}>
                    {task.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTask(task)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No tasks yet. Click "Add Task" to get started!
              </div>
            )}
          </div>
        </Card>

        {/* Leave Management */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">My Leaves</h3>
            <Button variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(true)}>
              <Plus size={16} className="mr-1" />
              Apply Leave
            </Button>
          </div>
          
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground capitalize">{leave.type} Leave</p>
                    <p className="text-sm text-muted-foreground">{leave.startDate} to {leave.endDate}</p>
                  </div>
                </div>
                <span className={`status-${leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'warning' : 'pending'}`}>
                  {leave.status}
                </span>
              </div>
            ))}
            {leaves.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No leave requests yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Features Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Holidays */}
        <Card className="card-professional">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Holidays</h3>
          <div className="space-y-3">
            {mockHolidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarDays size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{holiday.name}</p>
                    <p className="text-sm text-muted-foreground">{holiday.date}</p>
                  </div>
                </div>
                <span className={`status-${holiday.type === 'mandatory' ? 'success' : 'pending'}`}>
                  {holiday.type}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Payslips */}
        <Card className="card-professional">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payslips</h3>
          <div className="space-y-3">
            {mockPayslips.map((payslip) => (
              <div key={payslip.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{payslip.month} {payslip.year}</p>
                    <p className="text-sm text-muted-foreground">Uploaded: {payslip.uploadedAt}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPayslip(payslip)}
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My Tickets */}
      <Card className="card-professional">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">My Support Tickets</h3>
          <Button variant="outline" size="sm" onClick={() => setIsTicketModalOpen(true)}>
            <Plus size={16} className="mr-1" />
            Raise Ticket
          </Button>
        </div>
        
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageSquare size={16} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{ticket.title}</p>
                  <p className="text-sm text-muted-foreground">Created: {ticket.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`status-${ticket.urgency === 'critical' ? 'warning' : ticket.urgency === 'high' ? 'warning' : ticket.urgency === 'medium' ? 'pending' : 'success'}`}>
                  {ticket.urgency}
                </span>
                <span className={`status-${ticket.status === 'resolved' ? 'success' : 'pending'}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No support tickets yet.
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="card-professional">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            className="btn-professional h-auto p-4 flex-col space-y-2"
            onClick={handleAddTask}
          >
            <CheckSquare size={24} />
            <span>Add Task</span>
          </Button>
          <Button 
            className="btn-professional h-auto p-4 flex-col space-y-2"
            onClick={() => setIsLeaveModalOpen(true)}
          >
            <Calendar size={24} />
            <span>Apply Leave</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <FileText size={24} />
            <span>View Payslip</span>
          </Button>
          <Button 
            className="btn-professional h-auto p-4 flex-col space-y-2"
            onClick={() => setIsTicketModalOpen(true)}
          >
            <MessageSquare size={24} />
            <span>Raise Ticket</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};