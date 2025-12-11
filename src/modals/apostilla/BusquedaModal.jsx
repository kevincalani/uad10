// 📁 components/modals/apostilla/BusquedaModal.jsx
import { useState } from 'react';
import { X, Search, Eye, CircleArrowRight } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import { useModal } from '../../hooks/useModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import VerDatosTramiteModal from './VerDatosTramiteModal';

export default function BusquedaModal({ onClose }) {
  const { openModal } = useModal();
  const { loading, buscarTramites } = useApostilla();

  const [filtros, setFiltros] = useState({
    numero: '',
    gestion: '',
    ci: '',
    nombre: '',
    apellido: ''
  });

  const [resultado, setResultado] = useState([]);
  const [buscado, setBuscado] = useState(false);

      // Formatear fecha 
   const formatearFecha = (fecha) => {
        if (!fecha) return "";

        const [year, month, day] = fecha.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        });
    };
  const handleBuscar = async () => {
    setBuscado(true);
    const resultados = await buscarTramites(filtros);
    setResultado(resultados || []);
  };

  const handleVerTramite = (cod_apos) => {
    openModal(VerDatosTramiteModal, { cod_apos });
  };

  // Generar años desde 2018 hasta el año actual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2017 }, (_, i) => 2018 + i);

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Search size={20} />
          <h2 className="text-lg font-bold">Apostilla - Búsqueda</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-blue-600 text-white text-center py-2 rounded-lg mb-6 w-full">
          <h6 className="font-semibold">Formulario de búsqueda de apostilla</h6>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna de búsqueda */}
          <div className="space-y-4">
            <h3 className="text-right text-blue-600 font-semibold text-sm mb-4">
              * DATOS DE BÚSQUEDA
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold whitespace-nowrap">UAD</span>
                <input
                  type="text"
                  placeholder="Número"
                  value={filtros.numero}
                  onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span>/</span>
                <select
                  value={filtros.gestion}
                  onChange={(e) => setFiltros({ ...filtros, gestion: e.target.value })}
                  className="w-24 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Año</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                <label className="text-right italic text-sm text-gray-700">CI:</label>
                <input
                  type="text"
                  value={filtros.ci}
                  onChange={(e) => setFiltros({ ...filtros, ci: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                <label className="text-right italic text-sm text-gray-700">Nombres:</label>
                <input
                  type="text"
                  value={filtros.nombre}
                  onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                <label className="text-right italic text-sm text-gray-700">Apellidos:</label>
                <input
                  type="text"
                  value={filtros.apellido}
                  onChange={(e) => setFiltros({ ...filtros, apellido: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleBuscar}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Columna de resultados */}
          <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4">
            <h3 className="text-blue-600 font-bold mb-3">* Resultado de la búsqueda</h3>

            {loading ? (
              <LoadingSpinner size="md" />
            ) : buscado ? (
              resultado.length === 0 ? (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
                  <p className="font-bold text-red-600">No hay datos para mostrar</p>
                </div>
              ) : (
                <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="p-3 text-left font-semibold">N°</th>
                        <th className="p-3 text-left font-semibold">Nombre</th>
                        <th className="p-3 text-left font-semibold">CI</th>
                        <th className="p-3 text-left font-semibold">N° Trámite</th>
                        <th className="p-3 text-left font-semibold">Fecha ingreso</th>
                        <th className="p-3 text-center font-semibold">Opciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.map((tramite, index) => (
                        <tr key={tramite.cod_apos} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">
                            {tramite.per_nombre} {tramite.per_apellido}
                          </td>
                          <td className="p-3">{tramite.per_ci}</td>
                          <td className="p-3">
                            {tramite.apos_numero}/{tramite.apos_gestion}
                          </td>
                          <td className="p-3">
                            {tramite.apos_fecha_ingreso 
                              ? formatearFecha(tramite.apos_fecha_ingreso)
                              : '-'
                            }
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleVerTramite(tramite.cod_apos)}
                              className="p-1.5 hover:bg-gray-300 rounded-full shadow-sm transition-colors text-green-600 cursor-pointer"
                              title="Ver trámite"
                            >
                              <CircleArrowRight size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Realice una búsqueda para ver los resultados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// Componente auxiliar
function DataRow({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 py-1">
      <span className="text-right italic text-xs text-gray-700">{label}:</span>
      <span className="pl-3 text-sm">{value}</span>
    </div>
  );
}