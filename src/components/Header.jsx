import React from 'react';
import { UserDropdown } from './UserDropdown';
import {useNavigate} from 'react-router-dom'


export function Header() {
const navigate = useNavigate()


  return (
    <header className="bg-#f8f9fc border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between"
      onClick={()=> navigate('/Inicio')}>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">ARCHIVOS - UMSS</h2>
          <p className="text-sm text-gray-500">Sistema de Información Digital</p>
        </div>
        
        <UserDropdown />
      </div>
    </header>
  );
}