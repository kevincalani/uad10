import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore';
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
  X
} from 'lucide-react';

const iconMap = {
  'diplomas': GraduationCap,
  'resoluciones': FileText,
  'resoluciones-rfc-rcc': FileText,
  'servicios': Settings,
  'apostilla': Stamp,
  'no-atentado': ShieldX,
  'unidades': Building,
  'firma': PenTool,
  'claustros': Users,
  'funcionarios': UserCheck,
  'usuarios': Users,
  'corregir-datos': UserCheck,
  'programacion': Settings,
  'reporte': FileText
};

// Configuración de menús con permisos
const menuConfig = [
  {
    id: 'diplomas',
    label: 'DIPLOMAS Y TÍTULOS',
    permission: 'acceso al sistema - dyt',
    hasSubmenu: true,
    submenuItems: [
      { id: 'listar-tomos', label: 'Listar Tomos', route: '/diplomas/listar-tomos' },
      { id: 'buscar-titulo', label: 'Buscar título', route: '/diplomas/buscar-titulo', permission: 'busqueda - dyt' },
      { id: 'importar-titulos', label: 'Importar títulos', route: '/diplomas/importar-titulos', permission: 'realizar importación - dyt' },
      { id: 'reportes-diplomas', label: 'Reportes', route: '/diplomas/reportes' },
      { id: 'duplicados', label: 'Duplicados', route: '/diplomas/duplicados', permission: 'corregir duplicados - adm' }
    ]
  },
  {
    id: 'resoluciones',
    label: 'RESOLUCIONES',
    permission: 'acceder al sistema - rr',
    hasSubmenu: true,
    submenuItems: [
      { id: 'listar-tomos-res', label: 'Listar tomos', route: '/resoluciones/listar-tomos', permission: 'ver tomos - rr' },
      { id: 'listar-resoluciones', label: 'Listar resoluciones', route: '/resoluciones/listar-resoluciones', permission: 'listar resoluciones - rr' },
      { id: 'autoridad', label: 'Autoridad', route: '/resoluciones/autoridad', permission: 'ver autoridad - rr' },
      { id: 'codigo-archivado', label: 'Código de archivado', route: '/resoluciones/codigo-archivado', permission: 'acceder al codigo archivado - rr' },
      { id: 'busquedas-res', label: 'Búsquedas', route: '/resoluciones/busquedas', permission: 'buscar - rr' },
      { id: 'importar-res', label: 'Importar Resoluciones', route: '/resoluciones/importar', permission: 'importar - rr' },
      { id: 'temas-interes', label: 'Temas de interés', route: '/resoluciones/temas-interes', permission: 'acceder a temas - rr' },
      { id: 'reportes-res', label: 'Reportes', route: '/resoluciones/reportes', permission: 'ver reportes - rr' }
    ]
  },
  {
    id: 'resoluciones-rfc-rcc',
    label: 'RESOLUCIONES RFC-RCC',
    permission: 'acceder al sistema - rfc',
    hasSubmenu: false,
    route: '/resoluciones-rfc-rcc'
  },
  {
    id: 'servicios',
    label: 'SERVICIOS',
    permission: 'acceso al sistema - srv',
    hasSubmenu: true,
    submenuItems: [
      { id: 'configurar-tramites', label: 'Configurar trámites', route: '/servicios/configurar-tramites' },
      { id: 'tramites', label: 'Trámites', route: '/servicios/tramites' },
      { id: 'entrega-tramites', label: 'Entrega de trámites', route: '/servicios/entrega', permission: 'listar entregas - srv' },
      { id: 'reportes-servicios', label: 'Reportes', route: '/servicios/reportes' }
    ]
  },
  {
    id: 'apostilla',
    label: 'APOSTILLA',
    permission: 'acceso al sistema - apo',
    hasSubmenu: true,
    submenuItems: [
      { id: 'tramites-apostilla', label: 'Trámites apostilla', route: '/apostilla/tramites' },
      { id: 'configurar-apostilla', label: 'Configurar apostilla', route: '/apostilla/configurar' },
      { id: 'reportes-apostilla', label: 'Reportes', route: '/apostilla/reportes', permission: 'ver reportes - apo' }
    ]
  },
  {
    id: 'no-atentado',
    label: 'NO ATENTADO',
    permission: 'acceder al sistema - noa',
    hasSubmenu: true,
    submenuItems: [
      { id: 'convocatoria', label: 'Convocatoria', route: '/no-atentado/convocatoria' },
      { id: 'lista-sancionados', label: 'Lista de sancionados', route: '/no-atentado/sancionados' },
      { id: 'reportes-atentado', label: 'Reportes', route: '/no-atentado/reportes' }
    ]
  },
  {
    id: 'unidades',
    label: 'UNIDADES',
    permission: 'acceso al sistema - f',
    hasSubmenu: true,
    submenuItems: [
      { id: 'facultad', label: 'Facultad', route: '/unidades/facultad' },
      { id: 'unidad', label: 'Unidad', route: '/unidades/unidad' }
    ]
  },
  {
    id: 'firma',
    label: 'FIRMA',
    permission: 'acceso al sistema - srv',
    hasSubmenu: false,
    route: '/firma'
  },
  {
    id: 'claustros',
    label: 'CLAUSTROS',
    permission: 'acceder al sistema - cla',
    hasSubmenu: true,
    submenuItems: [
      { id: 'consejos', label: 'Consejos', route: '/claustros/consejos' }
    ]
  },
  {
    id: 'funcionarios',
    label: 'FUNCIONARIOS',
    permission: 'acceder al sistema - dya',
    hasSubmenu: true,
    submenuItems: [
      { id: 'docentes', label: 'Docentes', route: '/funcionarios/docentes' },
      { id: 'administrativos', label: 'Administrativos', route: '/funcionarios/administrativos' },
      { id: 'reporte-funcionarios', label: 'Reporte', route: '/funcionarios/Reporte' }
    ]
  }
];

const adminMenuConfig = [
  {
    id: 'usuarios',
    label: 'USUARIOS',
    permission: 'acceso al sistema - adm',
    hasSubmenu: true,
    submenuItems: [
      { id: 'lista-usuarios', label: 'Lista de Usuarios', route: '/administracion/usuarios' },
      { id: 'reportes-usuarios', label: 'Reportes', route: '/administracion/usuarios/reportes' }
    ]
  },
  {
    id: 'corregir-datos',
    label: 'CORREGIR DATOS PERSONALES',
    permission: 'acceso al sistema - adm',
    hasSubmenu: false,
    route: '/administracion/corregir-datos'
  },
  {
    id: 'programacion',
    label: 'PROGRAMACION',
    permission: 'acceso al sistema - adm',
    hasSubmenu: true,
    submenuItems: [
      { id: 'actividades', label: 'Actividades', route: '/administracion/programacion/actividades' },
      { id: 'dependientes', label: 'Dependientes', route: '/administracion/programacion/dependientes' }
    ]
  },
  {
    id: 'reporte',
    label: 'REPORTE',
    permission: 'acceder a reportes - rep',
    hasSubmenu: true,
    submenuItems: [
      { id: 'reporte-tareas', label: 'Reporte de Tareas', route: '/administracion/reporte/tareas' },
      { id: 'registro-periodico', label: 'Registro Periodico', route: '/administracion/reporte/periodico' }
    ]
  }
];

export function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

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

  // Filtrar menús según permisos
  const filterMenuItems = (items) => {
    return items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }
      
      if (item.hasSubmenu && item.submenuItems) {
        item.submenuItems = item.submenuItems.filter(subItem => {
          return !subItem.permission || hasPermission(subItem.permission);
        });
        return item.submenuItems.length > 0;
      }
      
      return true;
    });
  };

  const renderMenuItem = (item) => {
    const isExpanded = expandedMenus.includes(item.id);
    const hasActiveChild = item.submenuItems?.some(sub => location.pathname === sub.route);
    const isActive = location.pathname === item.route || hasActiveChild;
    const IconComponent = iconMap[item.id] || FileText;
    
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
          {isCollapsed ? (
            <div className="flex items-center space-x-3 pl-4">
              <IconComponent className="w-4 h-4" />
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <IconComponent className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </div>
          )}
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

  const visibleMenuItems = filterMenuItems([...menuConfig]);
  const visibleAdminItems = filterMenuItems([...adminMenuConfig]);
  const hasAdminAccess = visibleAdminItems.length > 0;

  return (
    <div className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      <div className="p-2 border-b border-gray-200" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-1">
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
          <button className="p-1 hover:bg-gray-100 rounded">
            {isCollapsed ? null : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          <div className="mb-6">
            {visibleMenuItems.map(renderMenuItem)}
          </div>

          {hasAdminAccess && (
            <>
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
                  {visibleAdminItems.map(renderMenuItem)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}