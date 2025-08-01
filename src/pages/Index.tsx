import React from 'react';

const Index = () => {
  // This component is no longer used as the app starts with RoleSelector
  // when no user is logged in. Keeping it for fallback purposes.
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Employee Management System</h1>
        <p className="text-xl text-muted-foreground">Redirecting to role selection...</p>
      </div>
    </div>
  );
};

export default Index;
