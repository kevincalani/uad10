// 📁 components/reportes/ModalReporteEntregas.jsx
import React, { useState, useEffect } from 'react';
import { useReporteServicios } from '../../../hooks/useReporteServicios';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { toast } from '../../../utils/toast';
import { ChartLineIcon, X } from 'lucide-react';

export default function ReporteEntregasPDFModal ({ onClose }) {
  const { loading, tramites, obtenerTramites, descargarPDFEntregas } = useReporteServicios();
  
  const [formData, setFormData] = useState({
    tramite: '',
    tipo_tramite: '',
    inicial: new Date().toISOString().split('T')[0],
    final: ''
  });

  useEffect(() => {
    obtenerTramites('entregas');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.inicial) {
      toast.error('La fecha inicial es requerida');
      return;
    }

    await descargarPDFEntregas(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-semibold flex items-center">
          <ChartLineIcon className='mr-2'/>
          Reporte general
        </h5>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-white hover:bg-gray-50/25 text-2xl font-bold transition cursor-pointer"
        >
          <X/>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-2/3 mx-auto mb-6">
          <h5 className="text-center font-semibold">Reportes de entregas en PDF</h5>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1 border border-gray-300 rounded-lg shadow-sm p-4">
            <span className="text-blue-600 font-bold block text-center mb-4">
              * DATOS PARA EL REPORTE
            </span>
            
            <form onSubmit={handleSubmit}>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-800">
                    <th className="text-right italic pr-2 py-2">Por trámite:</th>
                    <td className="border-b border-gray-800">
                      <select
                        name="tramite"
                        value={formData.tramite}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border-0 text-blue-600 focus:outline-none"
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
                    <th className="text-right italic pr-2 py-2 border-b border-gray-800">
                      Tipo de trámite:
                    </th>
                    <td className="border-b border-gray-800 text-blue-600">
                      <div className="flex items-center gap-3 py-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="tipo_tramite"
                            value="E"
                            checked={formData.tipo_tramite === 'E'}
                            onChange={handleInputChange}
                          />
                          EXTERNO
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="tipo_tramite"
                            value="I"
                            checked={formData.tipo_tramite === 'I'}
                            onChange={handleInputChange}
                          />
                          INTERNO
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <th className="text-right italic pr-2 py-2">Fecha:</th>
                    <td className="border-b border-gray-800">
                      <input
                        type="date"
                        name="inicial"
                        value={formData.inicial}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1 border-0 text-blue-600 focus:outline-none"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <th className="text-right italic pr-2 py-2">Fecha final:</th>
                    <td className="border-b border-gray-800">
                      <input
                        type="date"
                        name="final"
                        value={formData.final}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border-0 text-blue-600 focus:outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-blue-300 cursor-pointer"
                >
                  {loading ? 'Generando...' : 'Generar'}
                </button>
              </div>
            </form>
          </div>

          {/* Panel de información */}
          <div className="lg:col-span-2">
            <div className="h-[350px] border border-gray-300 rounded-lg shadow-sm p-4 flex items-center justify-center">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="text-center text-gray-500">
                  <i className="fas fa-file-pdf text-6xl mb-4"></i>
                  <p className="text-lg">
                    Complete los datos y presione "Generar" para descargar el PDF
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-300">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};