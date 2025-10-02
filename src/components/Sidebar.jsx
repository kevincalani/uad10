import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems, adminMenuItems } from '../data/menuItems';
import { 
  GraduationCap, 
  FileText, 
  Settings, 
  Stamp, 
  ShieldX, 
  Building, 
  PenTool, 
  Users, 
  UserCheck,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const iconMap = {
  'diplomas': <GraduationCap className="w-4 h-4" />,
  'resoluciones': <FileText className="w-4 h-4" />,
  'resoluciones-rfc-rcc': <FileText className="w-4 h-4" />,
  'servicios': <Settings className="w-4 h-4" />,
  'apostilla': <Stamp className="w-4 h-4" />,
  'no-atentado': <ShieldX className="w-4 h-4" />,
  'unidades': <Building className="w-4 h-4" />,
  'firma': <PenTool className="w-4 h-4" />,
  'claustros': <Users className="w-4 h-4" />,
  'funcionarios': <UserCheck className="w-4 h-4" />,
  'usuarios': <Users className="w-4 h-4" />,
  'corregir-datos': <UserCheck className="w-4 h-4" />,
  'programacion': <Settings className="w-4 h-4" />,
  'reporte': <FileText className="w-4 h-4" />
};

export function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const renderMenuItem = (item) => {
    const isExpanded = expandedMenus.includes(item.id);
    const hasActiveChild = item.submenuItems?.some(sub => location.pathname === sub.route);
    const isActive = location.pathname === item.route || hasActiveChild;
    
    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (item.hasSubmenu) {
              toggleMenu(item.id);
            } else if (item.route) {
              handleNavigation(item.route);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150 ${
            isActive
              ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-500' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {iconMap[item.id] || <FileText className="w-4 h-4" />}
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {!isCollapsed && item.hasSubmenu && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {!isCollapsed && item.hasSubmenu && isExpanded && item.submenuItems && (
          <div className="bg-gray-50 border-l-4 border-blue-200">
            {item.submenuItems.map((subItem) => (
              <button
                key={subItem.id}
                onClick={() => handleNavigation(subItem.route)}
                className={`w-full text-left px-8 py-2 text-sm transition-colors duration-150 ${
                  location.pathname === subItem.route
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                {subItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-1">
              <img 
                src="/src/assets/logo archivos.png" 
                alt="UMSS Archives Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-bold text-gray-800">ARCHIVOS</h1>
                <p className="text-xs text-gray-500">UMSS</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          <div className="mb-6">
            {menuItems.map(renderMenuItem)}
          </div>

          <div className="px-4 py-2">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className={`w-full flex items-center justify-between text-sm font-semibold text-gray-700 py-2 ${isCollapsed ? 'justify-center' : ''}`}
            >
              {!isCollapsed && <span>ADMINISTRACIÓN</span>}
              {!isCollapsed && (showAdmin ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            </button>
          </div>

          {showAdmin && (
            <div className="mb-4">
              {adminMenuItems.map(renderMenuItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}