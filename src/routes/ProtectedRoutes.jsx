import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/authStore';

/**
 * ProtectedRoutes se encarga de:
 * - Mostrar un loader mientras se verifica la sesión.
 * - Permitir acceso solo si el usuario está autenticado.
 * - Redirigir al login si NO hay sesión activa.
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

  // 🔐 Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si está autenticado, renderiza las rutas hijas
  return <Outlet />;
}
