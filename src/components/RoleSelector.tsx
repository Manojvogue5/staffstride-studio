import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Shield, Briefcase } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/user';

const roles = [
  {
    role: 'employee' as UserRole,
    title: 'Employee',
    description: 'Manage tasks, leaves, and view payslips',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    role: 'hr' as UserRole,
    title: 'HR Manager',
    description: 'Manage employees, leaves, and payslips',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100'
  },
  {
    role: 'admin' as UserRole,
    title: 'Administrator',
    description: 'Full system access and management',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  }
];

export const RoleSelector: React.FC = () => {
  const { selectRole } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-[var(--shadow-card)]">
              <UserCheck size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Employee Management System
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your role to access the dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((roleData, index) => (
            <Card
              key={roleData.role}
              className={`card-professional hover-lift cursor-pointer border-2 hover:border-primary/20 group animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => selectRole(roleData.role)}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${roleData.bgColor} ${roleData.hoverColor} transition-colors duration-300 mb-4 group-hover:scale-110`}>
                  <roleData.icon className={`w-8 h-8 ${roleData.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {roleData.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {roleData.description}
                </p>
                
                <Button 
                  className="w-full btn-professional group-hover:btn-primary-gradient"
                  variant="outline"
                >
                  Access Dashboard
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Demo system - All roles use mock data for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};