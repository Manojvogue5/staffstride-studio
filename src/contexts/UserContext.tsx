import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  employee: {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'employee',
    teamLead: 'Sarah Johnson',
    department: 'Engineering',
    joinDate: '2023-01-15'
  },
  hr: {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'hr',
    department: 'Human Resources',
    joinDate: '2022-03-10'
  },
  admin: {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'admin',
    department: 'Administration',
    joinDate: '2021-06-01'
  }
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const selectRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, selectRole, logout }}>
      {children}
    </UserContext.Provider>
  );
};