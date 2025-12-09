// 📁 modals/servicios/entrega/ConfirmarEntregaNoAtentadoModal.jsx
import React, { useState, useEffect } from 'react';
import { X, HandCoins, AlertCircle } from 'lucide-react';
import { useNoAtentado } from '../../../hooks/useNoAtentados';

export default function ConfirmarEntregaNoAtentadoModal({ 
  onClose, 
  cod_dtra, 
  autoSelectFirst = false,
  onSuccess 
}) {
  const {
    loading,
    obtenerConfirmacionEntrega,
    registrarEntrega,
  } = useNoAtentado();

  const [datos, setDatos] = useState(null);
  const [personaSeleccionada, setPersonaSeleccionada] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [cod_dtra]);

  const cargarDatos = async () => {
    const data = await obtenerConfirmacionEntrega(cod_dtra);
    if (data) {
      setDatos(data);
      
      // Auto-seleccionar si solo hay 1 candidato y no hay apoderado
      if (autoSelectFirst && data.noatentado.length === 1 && !data.apoderado) {
        setPersonaSeleccionada(data.noatentado[0].id_per.toString());
      } else if (data.apoderado) {
        // Si hay apoderado, seleccionarlo por defecto
        setPersonaSeleccionada('a');
      }
    }
  };

  const handleRegistrarEntrega = async () => {
    if (!personaSeleccionada) {
      return;
    }

    const payload = {
      cdtra: cod_dtra,
      tipo: personaSeleccionada,
    };

    const result = await registrarEntrega(payload);
    if (result) {
      onSuccess && onSuccess();
      onClose();
    }
  };

  if (!datos) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const { tramite_noatentado, noatentado, apoderado } = datos;

  return (
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-blue-700 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandCoins size={24} />
            <h2 className="text-xl font-bold">Entregas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-800 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Título */}
          <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2 mb-6 shadow">
            <h6 className="text-center font-bold text-gray-800">
              Formulario de entrega de trámites de Noatentado
            </h6>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Información del trámite */}
          <table className="w-full text-sm mb-6">
            <tbody>
              <tr className="border-b border-gray-800">
                <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                  Nro. Trámite:
                </th>
                <td className="text-left pl-4 py-2">
                  {tramite_noatentado.dtra_numero_tramite}
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                  Trámite:
                </th>
                <td className="text-left pl-4 py-2">
                  {tramite_noatentado.tre_nombre}
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <th className="text-right pr-4 py-2 font-medium text-gray-700 italic align-top pt-4">
                  Entregar a:
                </th>
                <td className="text-left pl-4 py-2">
                  <div className="space-y-2 pt-2 pb-2">
                    {noatentado.map((candidato) => (
                      <label key={candidato.id_per} className="flex items-center text-sm">
                        <input
                          type="radio"
                          name="persona"
                          value={candidato.id_per}
                          checked={personaSeleccionada === candidato.id_per.toString()}
                          onChange={(e) => setPersonaSeleccionada(e.target.value)}
                          className="mr-2"
                        />
                        {candidato.per_apellido} {candidato.per_nombre}
                      </label>
                    ))}
                    {apoderado && (
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          name="persona"
                          value="a"
                          checked={personaSeleccionada === 'a'}
                          onChange={(e) => setPersonaSeleccionada(e.target.value)}
                          className="mr-2"
                        />
                        {apoderado.apo_apellido} {apoderado.apo_nombre}
                        <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                          Apo
                        </span>
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Advertencia */}
          <div className="p-3 border border-red-500 rounded bg-red-50 flex items-start gap-2 text-xs">
            <AlertCircle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 italic font-medium">
              <p>* Esta acción se quedará registrada en el sistema</p>
              <p>* Si hace la entrega de este trámite, ya no se podrá modificar su estado</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cerrar
          </button>
          <button
            onClick={handleRegistrarEntrega}
            disabled={loading || !personaSeleccionada}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
  );
}