import React from 'react'
import { useAuth } from '../store/authStore';
import { FileText, Users, BarChart3 } from 'lucide-react';

export default function Inicio() {

  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">¡Bienvenidos a SID!</h1>
          <p className="text-blue-600">
            Estimado {user?.name}, bienvenido al Sistema de Información Digital
          </p>
          <div className="mt-4 text-sm text-blue-700">
            <p>Sistema de información digital</p>
            <p className="font-medium">ARCHIVOS - UMSS</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 mx-auto">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Documentos Recientes
            </h3>
            <p className="text-gray-600 text-center text-sm">
              Accede a los documentos y archivos más recientes del sistema.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 mx-auto">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Estadísticas
            </h3>
            <p className="text-gray-600 text-center text-sm">
              Consulta reportes y estadísticas del sistema universitario.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Usuarios Activos
            </h3>
            <p className="text-gray-600 text-center text-sm">
              Gestiona usuarios y permisos del sistema.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Accesos Rápidos</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800">Diplomas y Títulos</h4>
              <p className="text-sm text-gray-600">Gestión de títulos académicos</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800">Resoluciones</h4>
              <p className="text-sm text-gray-600">Administrar resoluciones</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-800">Servicios</h4>
              <p className="text-sm text-gray-600">Configurar servicios</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
