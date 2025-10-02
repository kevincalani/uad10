import React from 'react';
import  {Sidebar}  from '../components/Sidebar';
import  {Header}  from '../components/Header';

export function Layout( ) {
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          
        </main>
      </div>
    </div>
  );
}