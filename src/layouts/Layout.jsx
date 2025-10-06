import React from 'react';
import  {Sidebar}  from '../components/Sidebar';
import  {Header}  from '../components/Header';
import { Outlet } from 'react-router-dom';

export function Layout( ) {
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className=" bg-white flex-1 overflow-y-auto">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}