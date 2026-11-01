import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-parchment relative pb-20 text-charcoal">
      {children}
    </div>
  );
};

export default AppLayout;
