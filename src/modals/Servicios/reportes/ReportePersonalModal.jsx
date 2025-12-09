// 📁 components/reportes/ModalReportePersonal.jsx
import React, { useState} from 'react';
import { useReporteServicios } from '../../../hooks/useReporteServicios';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ResultadoReportePersonal from '../../../components/Tramites/reportes/ResultadoReportePersonal';
import { ChartLine } from 'lucide-react';

export default function ReportePersonalModal ({ onClose }) {
  const { loading, generarReportePersonal, cargarDatosPersona, resultado } = useReporteServicios();
  
  const [formData, setFormData] = useState({
    ci: '',
    apellido: '',
    nombre: '',
    fecha_inicial: '',
    fecha_final: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cargar datos de persona cuando se ingresa CI
  const handleCIChange = async (ci) => {
    setFormData(prev => ({ ...prev, ci }));
    
    if (ci.trim()) {
      const persona = await cargarDatosPersona(ci);
      if (persona) {
        setFormData(prev => ({
          ...prev,
          apellido: persona.per_apellido || '',
          nombre: persona.per_nombre || ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          apellido: '',
          nombre: ''
        }));
      }
    }
  };

  const handleSubmit = async () => {
    await generarReportePersonal(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-semibold flex items-center">
          <ChartLine className='mr-2'/>
          Reporte
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
          <h5 className="text-center font-semibold">Reporte mediante datos personales</h5>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <th className="text-right italic pr-2 py-2">CI:</th>
                  <td className="border-b border-gray-800">
                    <input
                      type="text"
                      name="ci"
                      value={formData.ci}
                      onChange={(e) => handleCIChange(e.target.value)}
                      className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                      placeholder="Ingrese CI"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2">Apellidos:</th>
                  <td className="border-b border-gray-800">
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                      placeholder="Apellidos"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2">Nombres:</th>
                  <td className="border-b border-gray-800">
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                      placeholder="Nombres"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2">Periodo inicial:</th>
                  <td className="border-b border-gray-800">
                    <input
                      type="date"
                      name="fecha_inicial"
                      value={formData.fecha_inicial}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2">Periodo final:</th>
                  <td className="border-b border-gray-800">
                    <input
                      type="date"
                      name="fecha_final"
                      value={formData.fecha_final}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Panel de resultados */}
          <div className="lg:col-span-2">
            <div className="h-[500px] overflow-y-auto border border-gray-200 rounded p-4">
              {loading ? (
                <LoadingSpinner/>
              ) : resultado ? (
                <ResultadoReportePersonal 
                  resultado={resultado} 
                  formData={formData}
                  onRegenerar={generarReportePersonal}
                />
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
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-blue-300"
        >
          {loading ? 'Generando...' : 'Generar'}
        </button>
      </div>
    </div>
  );
};
