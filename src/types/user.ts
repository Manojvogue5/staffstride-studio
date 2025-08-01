export type UserRole = 'employee' | 'hr' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teamLead?: string;
  department?: string;
  joinDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'completed';
  dueDate: string;
  createdAt: string;
  userId: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'sick' | 'casual' | 'vacation' | 'personal';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  documents?: string[];
}

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'mandatory' | 'optional';
  description?: string;
}

export interface Payslip {
  id: string;
  userId: string;
  month: string;
  year: number;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
}