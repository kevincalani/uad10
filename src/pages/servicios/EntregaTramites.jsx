// 📁 pages/EntregasPage.jsx
import React, { useState, useEffect } from 'react';
import { useEntregas } from '../../hooks/useEntregas';
import { useTramitesLegalizacion } from '../../hooks/useTramitesLegalizacion';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from '../../utils/toast';
import EntregasLegalizacionTable from '../../components/Tramites/entregas/EntregasLegalizacionTable';
import EntregasNoAtentadoTable from '../../components/Tramites/entregas/EntregasNoAtentadoTable';
import { BookText, Search } from 'lucide-react';
import { useNoAtentado } from '../../hooks/useNoAtentados';

export default function EntregasTramites () {
  const { loading, entregas, noAtentado, obtenerListaEntregas } = useEntregas();
  const { limpiarCache } = useNoAtentado()  
  const { buscarPorNumero } = useTramitesLegalizacion();
  const [tabActiva, setTabActiva] = useState('legalizaciones');
  const [numeroBusqueda, setNumeroBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
      // Limpiar cache al desmontar
    return () => {
      limpiarCache();
      };
  }, []);

  const cargarDatos = async () => {
    await obtenerListaEntregas();
  };

  const handleBuscar = async () => {
    if (!numeroBusqueda.trim()) {
      toast.warning('Ingrese un número de trámite');
      return;
    }

    const resultado = await buscarPorNumero(numeroBusqueda);
    
    if (resultado.ok) {
      if (resultado.tramites.length > 0) {
        // Redirigir o mostrar resultados
        window.location.href = `/buscar-tramite-legalizacion/${numeroBusqueda}`;
      } else {
        toast.info('No se encontraron resultados');
      }
    } else {
      toast.error(resultado.error);
    }
  };

  return (
    <div className="p-6 bg-gray-200">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg mb-6">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h5 className="text-xl font-semibold flex items-center">
            <BookText className='mr-2'/>
            TRÁMITES
          </h5>
        </div>

        <div className="p-6">
          {/* Buscador */}
          <div className="mb-4">
            <div className="flex items-center gap-2 w-fit">
              <button
                onClick={handleBuscar}
                className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 cursor-pointer transition"
              >
                <Search/>
              </button>
              <input
                type="text"
                value={numeroBusqueda}
                onChange={(e) => setNumeroBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 123-2022"
              />
              <span className="text-red-600 font-bold text-xs">
                Ejm: 123-2022
              </span>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Card de entregas */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-300">
            <div className="p-6">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md w-fit mb-4">
                <h5 className="text-lg font-semibold">Lista de Entrega de trámites</h5>
              </div>

              <div className="text-sm mb-4">
                <span className="font-bold italic text-blue-600">Fecha: </span>
                <span className="italic text-gray-800">
                  {new Date().toLocaleDateString('es-BO')}
                </span>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setTabActiva('legalizaciones')}
                    className={`py-2 px-4 font-medium text-sm transition ${
                      tabActiva === 'legalizaciones'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Legalizaciones
                  </button>
                  <button
                    onClick={() => setTabActiva('noatentado')}
                    className={`py-2 px-4 font-medium text-sm transition ${
                      tabActiva === 'noatentado'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    No-atentado
                  </button>
                </nav>
              </div>

              {/* Contenido de tabs */}
              <div className="mt-6">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {tabActiva === 'legalizaciones' && (
                      <EntregasLegalizacionTable entregas={entregas} />
                    )}
                    {tabActiva === 'noatentado' && (
                      <EntregasNoAtentadoTable noAtentado={noAtentado} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
