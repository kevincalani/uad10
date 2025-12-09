// 📁 components/reportes/ModalReporteGeneral.jsx
import React, { useState, useEffect } from "react";
import { useReporteServicios } from "../../../hooks/useReporteServicios";
import ResultadoReporteGeneral from "../../../components/Tramites/reportes/ResultadoReporteGeneral";
import { ChartLine, X } from "lucide-react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function ReporteGeneralModal({ onClose }) {
  const {
    loading,
    tramites,
    obtenerTramites,
    generarReporteGeneral,
    resultado,
  } = useReporteServicios();

  const [formData, setFormData] = useState({
    tramite: "",
    tipo: "",
    fecha_inicial: "",
    fecha_final: "",
  });

  useEffect(() => {
    obtenerTramites("general");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar el otro campo cuando se selecciona uno
    if (name === "tramite" && value) {
      setFormData((prev) => ({ ...prev, tipo: "" }));
    } else if (name === "tipo" && value) {
      setFormData((prev) => ({ ...prev, tramite: "" }));
    }
  };

  const handleSubmit = async () => {
    await generarReporteGeneral(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-semibold flex items-center">
          <ChartLine className="mr-2" />
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
          <h5 className="text-center font-semibold">Reporte general</h5>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1 border border-gray-300 rounded-lg shadow-sm p-4">
            <span className="text-blue-600 font-bold block text-center mb-4">
              * DATOS PARA EL REPORTE
            </span>

            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <th className="text-right italic pr-2 py-2">Por trámite:</th>
                  <td className="border-b border-gray-800">
                    <select
                      name="tramite"
                      value={formData.tramite}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                    >
                      <option value=""></option>
                      {tramites.map((t) => (
                        <option key={t.cod_tre} value={t.cod_tre}>
                          {t.tre_nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2">Por tipo:</th>
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
                <tr>
                  <th className="text-right italic pr-2 py-2">
                    Periodo inicial:
                  </th>
                  <td className="border-b border-gray-800">
                    <input
                      type="date"
                      name="fecha_inicial"
                      value={formData.fecha_inicial}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border-0 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-2">
                    Periodo final:
                  </th>
                  <td className="border-b border-gray-800">
                    <input
                      type="date"
                      name="fecha_final"
                      value={formData.fecha_final}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border-0 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 float-right px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-blue-300 cursor-pointer"
            >
              {loading ? "Generando..." : "Generar"}
            </button>
          </div>

          {/* Panel de resultados*/}
          <div className="lg:col-span-2">
            <div className="border border-gray-300 rounded-lg shadow-sm p-4">
              {loading ? (
                <LoadingSpinner />
              ) : resultado ? (
                <ResultadoReporteGeneral resultado={resultado} />
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  Complete los datos y presione "Generar" para ver los
                  resultados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-400">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
