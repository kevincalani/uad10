// 📁 components/reportes/ModalReporteEstadistico.jsx
import React, { useState, useEffect } from 'react';
import { useReporteServicios } from '../../../hooks/useReporteServicios';
import ResultadoReporteEstadistico from '../../../components/Tramites/reportes/ResultadoReporteEstadistico';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function ReporteEstadisticoModal ({ onClose }){
  const { loading, tramites, obtenerTramites, generarReporteEstadistico, resultado } = useReporteServicios();
  
  const [formData, setFormData] = useState({
    tramite: '',
    tipo: '',
    gestion_inicial: '',
    gestion_final: ''
  });

  // Generar array de años desde 2020 hasta el año actual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);

  useEffect(() => {
    obtenerTramites('estadistico');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el otro campo cuando se selecciona uno
    if (name === 'tramite' && value) {
      setFormData(prev => ({ ...prev, tipo: '' }));
    } else if (name === 'tipo' && value) {
      setFormData(prev => ({ ...prev, tramite: '' }));
    }
  };

  const handleSubmit = async () => {
    await generarReporteEstadistico(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-semibold flex items-center">
          <i className="fas fa-chart-line mr-2"></i>
          Reporte general
        </h5>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-2xl font-bold transition"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-2/3 mx-auto mb-6">
          <h5 className="text-center font-semibold">Reporte estadístico</h5>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1 border border-gray-300 rounded shadow-lg p-4">
            <span className="text-blue-600 font-bold block text-center mb-4">
              * DATOS PARA EL REPORTE
            </span>
            
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-800">
                  <th className="text-right italic pr-2 py-2">Por trámite:</th>
                  <td className="border-b border-gray-800">
                    <select
                      name="tramite"
                      value={formData.tramite}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                    >
                      <option value=""></option>
                      {tramites.map(t => (
                        <option key={t.cod_tre} value={t.cod_tre}>
                          {t.tre_nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2 border-b border-gray-800">Por tipo:</th>
                  <td className="border-b border-gray-800">
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                    >
                      <option value=""></option>
                      <option value="L">Legalización</option>
                      <option value="C">Certificación</option>
                      <option value="F">Confrontación</option>
                      <option value="B">Búsqueda</option>
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <th className="text-right italic pr-2 py-2">Gestión inicial:</th>
                  <td className="border-b border-gray-800">
                    <select
                      name="gestion_inicial"
                      value={formData.gestion_inicial}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                    >
                      <option value=""></option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <th className="text-right italic pr-2 py-2">Gestión final:</th>
                  <td className="border-b border-gray-800">
                    <select
                      name="gestion_final"
                      value={formData.gestion_final}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                    >
                      <option value=""></option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 float-right px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-blue-300"
            >
              {loading ? 'Generando...' : 'Generar'}
            </button>
          </div>

          {/* Panel de resultados */}
          <div className="lg:col-span-3">
            <div className="h-[600px] border border-gray-200 rounded p-4 overflow-auto">
              {loading ? (
                <LoadingSpinner />
              ) : resultado ? (
                <ResultadoReporteEstadistico resultado={resultado} />
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  Complete los datos y presione "Generar" para ver los resultados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};