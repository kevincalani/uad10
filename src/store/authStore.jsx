import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../api/axios'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  // 🔹 Verifica si hay una sesión activa al montar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getCsrfCookie(); // Necesario para peticiones POST y GET con Sanctum
        const response = await api.get('/api/user');
        
        if (response.data) {
          // Tu backend devuelve: { user: {...}, permissions: [...] }
          setUser(response.data.user || response.data);
          setPermissions(response.data.permissions || []);
          
          console.log("✅ Sesión verificada. Usuario:", response.data.user?.name || response.data.name);
          console.log("🔑 Permisos cargados:", (response.data.permissions || []));
        }
      } catch (error) {
        // La petición a /api/user fallará (401) si no hay sesión. Es el comportamiento esperado.
        console.warn("⚠️ No hay sesión activa o token inválido:", error.response?.status);
        setUser(null);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // 🔹 LOGIN
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      console.log("🔑 Iniciando proceso de login...");
      await getCsrfCookie(); // Asegura el token CSRF para el POST
      const response = await api.post('/api/api-login', {
        email: username,
        password: password,
      });
      
      // Tu backend devuelve: { user: {...}, permissions: [...] }
      const loggedInUser = response.data.user;
      const userPermissions = response.data.permissions || [];
      
      setUser(loggedInUser);
      setPermissions(userPermissions);
      
      console.log("✅ Login exitoso:", response.data);
      console.log("🔑 Permisos del usuario:", userPermissions.length);
      
      // Redirigir al inicio después de iniciar sesión
      navigate('/inicio');
      return loggedInUser;
    } catch (error) {
      console.error("❌ Error en login:", error.response?.data || error);
      // Extracción de mensajes de error de Laravel (401, 429, 422)
      const errorMessage = 
        error.response?.data?.message || // Mensaje estándar (401, 429)
        (error.response?.data?.errors && Object.values(error.response.data.errors).flat().join(', ')) || // Errores de validación (422)
        'Error desconocido al iniciar sesión';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    setIsLoading(true);
    try {
      // Usa el endpoint /api/logout, que debe estar definido para usar ApiLoginController.php::logout
      await api.post('/api/api-logout'); 
      console.log("👋 Sesión cerrada correctamente.");
    } catch (error) {
      console.error("⚠️ Error durante logout, cerrando sesión local de todas formas:", error);
    } finally {
      setUser(null);
      setPermissions([]);
      setIsLoading(false);
      navigate('/'); // Redirigir al login
    }
  };

  // 🔹 FUNCIONES DE PERMISOS
  const hasPermission = (permission) => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionArray) => {
    if (!permissions || permissions.length === 0) return false;
    return permissionArray.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionArray) => {
    if (!permissions || permissions.length === 0) return false;
    return permissionArray.every(permission => permissions.includes(permission));
  };

  const value = {
    user,
    permissions,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 🔸 Mostrar children solo cuando se termine de verificar la sesión */}
      {!isLoading ? children : (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <p className="text-gray-600">Cargando autenticación...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
}