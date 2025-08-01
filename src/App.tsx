import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { RoleSelector } from "@/components/RoleSelector";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmployeeDashboard } from "@/components/dashboards/EmployeeDashboard";
import { HRDashboard } from "@/components/dashboards/HRDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Dashboard = () => {
  const { user } = useUser();
  
  switch (user?.role) {
    case 'employee':
      return <EmployeeDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

const AppContent = () => {
  const { user } = useUser();

  if (!user) {
    return <RoleSelector />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Placeholder routes - will be implemented in subsequent iterations */}
        <Route path="tasks" element={<div className="p-6">Tasks page coming soon...</div>} />
        <Route path="leaves" element={<div className="p-6">Leaves page coming soon...</div>} />
        <Route path="payslips" element={<div className="p-6">Payslips page coming soon...</div>} />
        <Route path="tickets" element={<div className="p-6">Tickets page coming soon...</div>} />
        <Route path="holidays" element={<div className="p-6">Holidays page coming soon...</div>} />
        <Route path="employees" element={<div className="p-6">Employees page coming soon...</div>} />
        <Route path="leave-management" element={<div className="p-6">Leave Management page coming soon...</div>} />
        <Route path="payslip-management" element={<div className="p-6">Payslip Management page coming soon...</div>} />
        <Route path="complaints" element={<div className="p-6">Complaints page coming soon...</div>} />
        <Route path="holiday-management" element={<div className="p-6">Holiday Management page coming soon...</div>} />
        <Route path="user-management" element={<div className="p-6">User Management page coming soon...</div>} />
        <Route path="reports" element={<div className="p-6">Reports page coming soon...</div>} />
        <Route path="search" element={<div className="p-6">Search & Monitor page coming soon...</div>} />
        <Route path="settings" element={<div className="p-6">Settings page coming soon...</div>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
