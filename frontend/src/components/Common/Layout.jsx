import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 md:ml-72 p-8 min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
