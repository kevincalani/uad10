import React, { useState } from 'react';
import { useAuth } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

        const HeaderLogo = () => (
  <div className="flex items-center p-6 ml-10">
    {/* Placeholder for SID logo if not loaded, styling to match image */}
    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
        SID
    </div>
    <div>
      <h1 className="text-white text-xl font-light italic tracking-wider">SISTEMA DE INFORMACIÓN DIGITAL</h1>
      <p className="text-white text-sm opacity-80 mt-[-5px]">ARCHIVOS - UMSS</p>
    </div>
  </div>
);
  return (
    // Main container takes up the full viewport height
    <div className="min-h-screen bg-white flex flex-col relative">

      {/* Blue Header Section (Top 50% of the screen) */}
      <header className="w-full h-1/2 bg-[#1D4ED8] flex flex-col justify-end items-center pb-24 shadow-lg">
        
        {/* ARCHIVOS - UMSS Centered at the top of the header area */}
        <div className="absolute top-0 w-full text-center pt-2 text-white text-sm opacity-60">
            ARCHIVOS - UMSS
        </div>

        {/* Logo and Title Block (Aligned closer to the center) */}
        <div className="flex flex-auto items-center">
          {/* SID Logo Placeholder */}
          <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
              SID
          </div>
          {/* Title Text */}
          <h1 className="text-white text-2xl font-light italic tracking-wide">SISTEMA DE INFORMACIÓN DIGITAL</h1>
        </div>
      </header>

      {/* Main Content Area (Bottom 50% of the screen) */}
      {/* This area only serves to push the content down and provide the white background */}
      <main className="flex-grow w-full"></main>
      
      {/* Login Card (ABSOLUTELY POSITIONED over the 50/50 division line) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white p-12 rounded-lg shadow-2xl w-full max-w-sm">
        
        {/* Card Title */}
        <h2 className="text-lg font-light text-[#22C55E] mb-8 text-center">
          Bienvenidos al S.I.D.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Usuario Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="usuario" className="text-gray-700 text-sm w-24">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow border border-gray-300 rounded-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Contraseña Field */}
          <div className="flex items-center space-x-4">
            <label htmlFor="contrasena" className="text-gray-700 text-sm w-24">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-grow border border-gray-300 rounded-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="bg-[#34D399] hover:bg-[#10B981] text-white font-normal py-2 px-6 rounded-md shadow-md transition duration-200"
            >
              INGRESAR
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}