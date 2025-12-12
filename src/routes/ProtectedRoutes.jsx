import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { AlertCircle } from 'lucide-react';

/**
 * ProtectedRoutes - Verifica autenticación
 * Solo verifica si el usuario está logueado
 */
export default function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-gray-600 text-lg">
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

/**
 * RequirePermission - Verifica permisos específicos
 * Usa esto cuando necesites proteger una ruta con permisos
 */
export function RequirePermission({ 
  permission, 
  permissions = [], 
  requireAll = false,
  children,
  fallback = null 
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-gray-600">Verificando permisos...</p>
      </div>
    );
  }

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return children || <Outlet />;
}