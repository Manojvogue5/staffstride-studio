import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Database,
  Activity,
  AlertTriangle,
  TrendingUp,
  Search,
  UserCog
} from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '189',
    change: '+8 this month',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'System Uptime',
    value: '99.9%',
    change: 'Last 30 days',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Open Issues',
    value: '5',
    change: 'Needs attention',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Data Usage',
    value: '2.4GB',
    change: 'This month',
    icon: Database,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

const systemAlerts = [
  { type: 'Security', message: 'Failed login attempts detected', severity: 'high', time: '2h ago' },
  { type: 'Performance', message: 'Server response time increased', severity: 'medium', time: '6h ago' },
  { type: 'Backup', message: 'Daily backup completed successfully', severity: 'low', time: '1d ago' }
];

const recentActivities = [
  { user: 'Sarah Johnson (HR)', action: 'Approved leave request for John Smith', time: '30m ago' },
  { user: 'Mike Wilson (Admin)', action: 'Updated system settings', time: '1h ago' },
  { user: 'Alice Brown (Employee)', action: 'Raised a support ticket', time: '2h ago' }
];

const userStats = [
  { role: 'Employees', count: 156, change: '+5' },
  { role: 'HR Staff', count: 8, change: '+1' },
  { role: 'Admins', count: 3, change: '0' }
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-professional bg-[var(--gradient-card)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Admin Control Center 🔧
            </h2>
            <p className="text-muted-foreground">
              Complete system oversight and management capabilities.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Shield className="text-primary mb-2" size={24} />
              <p className="text-sm font-medium">System Status</p>
              <p className="text-lg font-bold text-green-600">All Good</p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Statistics */}
        <Card className="card-professional">
          <h3 className="text-lg font-semibold text-foreground mb-4">User Statistics</h3>
          <div className="space-y-4">
            {userStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users size={16} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{stat.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-foreground">{stat.count}</span>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <AlertTriangle 
                  size={16} 
                  className={`mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' : 
                    alert.severity === 'medium' ? 'text-orange-500' : 'text-green-500'
                  }`} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{alert.type}</p>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="card-professional">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
            <Button variant="outline" size="sm">View Log</Button>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <Activity size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Admin Quick Actions */}
      <Card className="card-professional">
        <h3 className="text-lg font-semibold text-foreground mb-4">Admin Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <UserCog size={24} />
            <span>User Management</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <BarChart3 size={24} />
            <span>System Reports</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <Search size={24} />
            <span>Search & Monitor</span>
          </Button>
          <Button className="btn-professional h-auto p-4 flex-col space-y-2">
            <Settings size={24} />
            <span>System Settings</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};