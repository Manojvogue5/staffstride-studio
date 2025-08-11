import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Calendar
} from 'lucide-react';
import { TicketModal } from '@/components/modals/TicketModal';
import { Ticket } from '@/types/user';
import { useUser } from '@/contexts/UserContext';

interface EmployeeTicketsProps {
  searchQuery: string;
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    userId: '1',
    title: 'Computer running slow',
    description: 'My laptop has been running very slowly for the past few days, especially when opening multiple applications.',
    urgency: 'medium',
    status: 'pending',
    createdAt: '2024-12-17',
    assignedTo: 'IT Support Team',
    category: 'Technical'
  },
  {
    id: '2',
    userId: '1',
    title: 'Access card not working',
    description: 'My office access card stopped working since yesterday morning. Cannot enter the building.',
    urgency: 'high',
    status: 'resolved',
    createdAt: '2024-12-15',
    resolvedAt: '2024-12-16',
    assignedTo: 'Security Team',
    category: 'Facilities',
    resolution: 'Replaced access card with new one. Issue resolved.'
  },
  {
    id: '3',
    userId: '1',
    title: 'Payroll inquiry',
    description: 'I have questions about my recent payslip and deductions. Need clarification on tax calculations.',
    urgency: 'low',
    status: 'pending',
    createdAt: '2024-12-10',
    assignedTo: 'HR Team',
    category: 'Payroll'
  },
  {
    id: '4',
    userId: '1',
    title: 'Office chair broken',
    description: 'My office chair has a broken wheel and is uncomfortable to use. Need replacement.',
    urgency: 'medium',
    status: 'resolved',
    createdAt: '2024-12-05',
    resolvedAt: '2024-12-08',
    assignedTo: 'Facilities Team',
    category: 'Facilities',
    resolution: 'Chair has been replaced with a new ergonomic office chair.'
  }
];

export const EmployeeTickets: React.FC<EmployeeTicketsProps> = ({ searchQuery }) => {
  const { user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  // Filter tickets based on search query and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (ticket.category && ticket.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || ticket.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleSubmitTicket = (ticketData: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      status: 'pending',
      ...ticketData as Omit<Ticket, 'id' | 'userId' | 'status'>
    };
    setTickets([newTicket, ...tickets]);
    setIsTicketModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="text-green-600" size={16} />;
      case 'pending': return <Clock className="text-orange-600" size={16} />;
      default: return <MessageSquare className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'text-blue-600 bg-blue-50';
      case 'Facilities': return 'text-purple-600 bg-purple-50';
      case 'Payroll': return 'text-green-600 bg-green-50';
      case 'HR': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmit={handleSubmitTicket}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Support Tickets</h2>
          <p className="text-muted-foreground">Track and manage your support requests</p>
        </div>
        <Button onClick={() => setIsTicketModalOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Raise Ticket</span>
        </Button>
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="text-orange-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Pending Tickets</p>
              <p className="text-xl font-bold">{tickets.filter(t => t.status === 'pending').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Resolved Tickets</p>
              <p className="text-xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-xl font-bold">{tickets.filter(t => t.urgency === 'high' || t.urgency === 'critical').length}</p>
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
            <option value="resolved">Resolved</option>
          </select>

          <select 
            value={urgencyFilter} 
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="p-4 hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getStatusIcon(ticket.status)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                    {ticket.category && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                        {ticket.category}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{ticket.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{ticket.createdAt}</span>
                      </p>
                    </div>
                    
                    {ticket.assignedTo && (
                      <div>
                        <span className="font-medium">Assigned to:</span>
                        <p>{ticket.assignedTo}</p>
                      </div>
                    )}
                    
                    {ticket.status === 'resolved' && ticket.resolvedAt && (
                      <div>
                        <span className="font-medium">Resolved:</span>
                        <p>{ticket.resolvedAt}</p>
                      </div>
                    )}
                  </div>

                  {ticket.resolution && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">Resolution:</p>
                      <p className="text-sm text-green-700">{ticket.resolution}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(ticket.urgency)}`}>
                  {ticket.urgency}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <Card className="p-8 text-center">
            <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No tickets match your search criteria.' : 'You haven\'t raised any support tickets yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsTicketModalOpen(true)}>Raise your first ticket</Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};