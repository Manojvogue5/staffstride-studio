import React from 'react';
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
  CalendarDays
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

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

const recentTasks = [
  { title: 'Complete project documentation', priority: 'high', dueDate: 'Today' },
  { title: 'Review code changes', priority: 'medium', dueDate: 'Tomorrow' },
  { title: 'Team meeting preparation', priority: 'low', dueDate: 'Dec 20' }
];

const upcomingLeaves = [
  { type: 'Vacation', dates: 'Dec 25 - Dec 30', status: 'approved' },
  { type: 'Sick Leave', dates: 'Jan 5', status: 'pending' }
];

export const EmployeeDashboard: React.FC = () => {
  const { user } = useUser();

  return (
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Tasks</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckSquare size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <span className={`status-${task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'pending' : 'success'}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Leave Status */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Leave Status</h3>
            <Button variant="outline" size="sm">Apply Leave</Button>
          </div>
          
          <div className="space-y-3">
            {upcomingLeaves.map((leave, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{leave.type}</p>
                    <p className="text-sm text-muted-foreground">{leave.dates}</p>
                  </div>
                </div>
                <span className={`status-${leave.status === 'approved' ? 'success' : 'pending'}`}>
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-professional">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <CheckSquare size={24} />
            <span>Add Task</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <Calendar size={24} />
            <span>Apply Leave</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <FileText size={24} />
            <span>View Payslip</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <MessageSquare size={24} />
            <span>Raise Ticket</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};