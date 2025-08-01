import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  UserCheck,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';

const stats = [
  {
    title: 'Total Employees',
    value: '156',
    change: '+5 this month',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Pending Leaves',
    value: '23',
    change: 'Need approval',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Open Tickets',
    value: '8',
    change: 'Awaiting response',
    icon: MessageSquare,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Payslips Uploaded',
    value: '142/156',
    change: 'This month',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

const pendingLeaves = [
  { employee: 'John Smith', type: 'Vacation', dates: 'Dec 25-30', days: 5 },
  { employee: 'Alice Johnson', type: 'Sick', dates: 'Dec 20', days: 1 },
  { employee: 'Bob Wilson', type: 'Personal', dates: 'Dec 22-23', days: 2 }
];

const recentTickets = [
  { employee: 'Sarah Davis', title: 'IT Equipment Issue', urgency: 'high', time: '2h ago' },
  { employee: 'Mike Brown', title: 'Payroll Question', urgency: 'medium', time: '1d ago' },
  { employee: 'Emma Wilson', title: 'Office Access Card', urgency: 'low', time: '2d ago' }
];

export const HRDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-professional bg-[var(--gradient-card)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              HR Management Overview 📊
            </h2>
            <p className="text-muted-foreground">
              Monitor and manage your workforce efficiently.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <UserCheck className="text-primary mb-2" size={24} />
              <p className="text-sm font-medium">Active</p>
              <p className="text-lg font-bold text-foreground">156 Employees</p>
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
        {/* Pending Leave Requests */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Pending Leave Requests</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {pendingLeaves.map((leave, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{leave.employee}</p>
                    <p className="text-sm text-muted-foreground">{leave.type} • {leave.dates} • {leave.days} days</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Tickets */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Tickets</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {recentTickets.map((ticket, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageSquare size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{ticket.employee}</p>
                    <p className="text-sm text-muted-foreground">{ticket.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`status-${ticket.urgency === 'high' ? 'warning' : ticket.urgency === 'medium' ? 'pending' : 'success'}`}>
                    {ticket.urgency}
                  </span>
                  <span className="text-xs text-muted-foreground">{ticket.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-professional">
        <h3 className="text-lg font-semibold text-foreground mb-4">HR Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <Users size={24} />
            <span>Add Employee</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <FileText size={24} />
            <span>Upload Payslips</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <ClipboardList size={24} />
            <span>Manage Leaves</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <TrendingUp size={24} />
            <span>View Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};