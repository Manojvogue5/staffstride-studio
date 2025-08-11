import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  CalendarDays
} from 'lucide-react';
import { LeaveModal } from '@/components/modals/LeaveModal';
import { LeaveRequest } from '@/types/user';
import { useUser } from '@/contexts/UserContext';

interface EmployeeLeavesProps {
  searchQuery: string;
}

const mockLeaves: LeaveRequest[] = [
  { 
    id: '1',
    userId: '1',
    type: 'vacation', 
    startDate: '2024-12-25',
    endDate: '2024-12-30',
    reason: 'Christmas holidays with family',
    status: 'approved',
    appliedAt: '2024-12-10',
    approvedBy: 'Sarah Johnson',
    approvedAt: '2024-12-11'
  },
  { 
    id: '2',
    userId: '1',
    type: 'sick', 
    startDate: '2025-01-05',
    endDate: '2025-01-05',
    reason: 'Medical appointment and check-up',
    status: 'pending',
    appliedAt: '2024-12-15'
  },
  { 
    id: '3',
    userId: '1',
    type: 'personal', 
    startDate: '2024-11-15',
    endDate: '2024-11-16',
    reason: 'Personal family matter',
    status: 'rejected',
    appliedAt: '2024-11-10',
    rejectedBy: 'Sarah Johnson',
    rejectedAt: '2024-11-12',
    rejectionReason: 'Insufficient notice period'
  },
  { 
    id: '4',
    userId: '1',
    type: 'casual', 
    startDate: '2025-02-14',
    endDate: '2025-02-14',
    reason: 'Personal work',
    status: 'approved',
    appliedAt: '2024-12-01',
    approvedBy: 'Sarah Johnson',
    approvedAt: '2024-12-02'
  }
];

export const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ searchQuery }) => {
  const { user } = useUser();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter leaves based on search query and filters
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leave.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSubmitLeave = (leaveData: Partial<LeaveRequest>) => {
    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      ...leaveData as Omit<LeaveRequest, 'id' | 'userId'>
    };
    setLeaves([newLeave, ...leaves]);
    setIsLeaveModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-600" size={16} />;
      case 'rejected': return <XCircle className="text-red-600" size={16} />;
      case 'pending': return <Clock className="text-orange-600" size={16} />;
      default: return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sick': return 'text-red-600 bg-red-50';
      case 'vacation': return 'text-blue-600 bg-blue-50';
      case 'personal': return 'text-purple-600 bg-purple-50';
      case 'casual': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleSubmitLeave}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Leaves</h2>
          <p className="text-muted-foreground">View and manage your leave requests</p>
        </div>
        <Button onClick={() => setIsLeaveModalOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Apply Leave</span>
        </Button>
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CalendarDays className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Annual Leave</p>
              <p className="text-xl font-bold">15/25 days</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Sick Leave</p>
              <p className="text-xl font-bold">2/10 days</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Casual Leave</p>
              <p className="text-xl font-bold">5/12 days</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Personal Leave</p>
              <p className="text-xl font-bold">1/5 days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation</option>
            <option value="personal">Personal</option>
            <option value="casual">Casual</option>
          </select>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredLeaves.length} of {leaves.length} requests
          </div>
        </div>
      </Card>

      {/* Leave Requests */}
      <div className="grid gap-4">
        {filteredLeaves.map((leave) => (
          <Card key={leave.id} className="p-4 hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getStatusIcon(leave.status)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-foreground capitalize">{leave.type} Leave</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(leave.type)}`}>
                      {leave.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{leave.reason}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{leave.startDate} to {leave.endDate}</p>
                      <p className="text-muted-foreground">{calculateDays(leave.startDate, leave.endDate)} day(s)</p>
                    </div>
                    
                    <div>
                      <span className="font-medium">Applied:</span>
                      <p>{leave.appliedAt}</p>
                    </div>
                    
                    {leave.status === 'approved' && leave.approvedBy && (
                      <div>
                        <span className="font-medium">Approved by:</span>
                        <p>{leave.approvedBy}</p>
                        <p className="text-muted-foreground">{leave.approvedAt}</p>
                      </div>
                    )}
                    
                    {leave.status === 'rejected' && leave.rejectedBy && (
                      <div>
                        <span className="font-medium">Rejected by:</span>
                        <p>{leave.rejectedBy}</p>
                        <p className="text-muted-foreground">{leave.rejectedAt}</p>
                        {leave.rejectionReason && (
                          <p className="text-red-600 text-xs mt-1">{leave.rejectionReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(leave.status)}`}>
                {leave.status}
              </span>
            </div>
          </Card>
        ))}

        {filteredLeaves.length === 0 && (
          <Card className="p-8 text-center">
            <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No leave requests found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No leave requests match your search criteria.' : 'You haven\'t applied for any leaves yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsLeaveModalOpen(true)}>Apply for your first leave</Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};