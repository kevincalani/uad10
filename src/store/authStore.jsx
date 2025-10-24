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
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  // 🔹 Verifica si hay una sesión activa al montar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getCsrfCookie(); // Necesario para peticiones POST
        const response = await api.get('/api/user');
        if (response.data) {
          setUser(response.data);
          console.log("✅ Sesión verificada. Usuario:", response.data.name);
        }
      } catch (error) {
        console.warn("⚠️ No hay sesión activa o token inválido:", error.response?.status);
        setUser(null);
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
      await getCsrfCookie(); // Asegura el token CSRF

      const response = await api.post('/api/login', {
        email: username,
        password: password,
      });

      const loggedInUser = response.data.user;
      setUser(loggedInUser);

      console.log("✅ Login exitoso:", loggedInUser);

      // Redirigir al inicio después de iniciar sesión
      navigate('/inicio');

      return loggedInUser;
    } catch (error) {
      console.error("❌ Error en login:", error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/logout');
      console.log("👋 Sesión cerrada correctamente.");
    } catch (error) {
      console.error("⚠️ Error durante logout, cerrando sesión local de todas formas:", error);
    } finally {
      setUser(null);
      setIsLoading(false);
      navigate('/'); // Redirigir al login
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 🔸 Mostrar children solo cuando se termine de verificar la sesión */}
      {!isLoading ? children : <div>Cargando autenticación...</div>}
    </AuthContext.Provider>
  );
}
