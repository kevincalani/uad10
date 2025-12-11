import React from 'react';
import { Construction, HardHat, Wrench, AlertTriangle, Hammer, Settings, Clock } from 'lucide-react';

// Componente Principal - Versión Moderna
export default function EnConstruction({ pageName = "Esta página" }) {
  
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Iconos animados */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="relative flex justify-center gap-4">
            <Construction 
              size={64} 
              className="text-blue-600 animate-bounce" 
              style={{ animationDelay: '0s' }}
            />
            <HardHat 
              size={64} 
              className="text-yellow-500 animate-bounce" 
              style={{ animationDelay: '0.2s' }}
            />
            <Wrench 
              size={64} 
              className="text-gray-600 animate-bounce" 
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          ¡Estamos trabajando en esto!
        </h1>
        
        {/* Mensaje personalizado */}
        <p className="text-2xl text-blue-600 font-semibold mb-6">
          Pagina {pageName}
        </p>

        <p className="text-lg text-gray-600 mb-8">
          Nuestro equipo está construyendo algo increíble. 
          Esta sección estará disponible pronto.
        </p>

        {/* Barra de progreso animada */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full animate-pulse" 
                 style={{ width: '25%' }}>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">En progreso...</p>
        </div>

        {/* Badges informativos */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            🚀 Próximamente
          </span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            ⚡ En desarrollo
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            💡 Mejorando
          </span>
        </div>
      </div>
    </div>
  );

}
