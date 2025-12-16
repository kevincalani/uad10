// 📁 components/apostilla/ModalEliminarDocumento.jsx
import React, { useState, useEffect } from 'react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AlertTriangle, Info } from 'lucide-react';

export default function EliminarApostillaModal ({ onClose, cod_lis, onSuccess }) {
  const { loading, verificarEliminarDocumento, eliminarDocumento } = useApostilla();
  const [datos, setDatos] = useState(null);
  const [puedeEliminar, setPuedeEliminar] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [cod_lis]);

  const cargarDatos = async () => {
    const data = await verificarEliminarDocumento(cod_lis);
    if (data) {
      setDatos(data.apostilla);
      setPuedeEliminar(data.eliminar);
    }
  };

  const handleEliminar = async () => {
    const success = await eliminarDocumento(cod_lis);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  if (loading || !datos) {
    return (
      <div className="bg-white rounded-lg shadow-2xl w-3xl p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-b-4 border-red-600">
      {/* Header */}
      <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
        <h5 className="text-white text-xl font-bold flex items-center">
          <AlertTriangle className='mr-2'/>
          Eliminar trámite de apostilla
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
        {puedeEliminar ? (
          <>
            <p className="text-gray-700 italic mb-6">
              ¿Está seguro de eliminar el trámite?
            </p>

            <div className="flex items-center gap-4">
              {/* Card con datos del trámite */}
              <div className="flex-1 bg-red-50 border-2 border-red-600 rounded-lg shadow-lg p-4">
                <table className="w-full text-sm text-gray-800">
                  <tbody>
                    <tr>
                      <th className="text-right pr-4 py-2 font-semibold align-top">
                        Nombre:
                      </th>
                      <td className="text-left border-b border-red-400 py-2 pl-3">
                        {datos.lis_nombre}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-right pr-4 py-2 font-semibold align-top">
                        Cuenta:
                      </th>
                      <td className="text-left border-b border-red-400 py-2 pl-3">
                        {datos.lis_cuenta}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-right pr-4 py-2 font-semibold align-top">
                        Descripción:
                      </th>
                      <td className="text-left border-b border-red-400 py-2 pl-3">
                        {datos.lis_desc || 'Sin descripción'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Icono de pregunta */}
              <div className="text-red-600">
                <Info className='mr-2' size={32}/>
              </div>
            </div>

            {/* Advertencia */}
            <div className="mt-6 p-3 border border-red-600 rounded bg-red-50 text-red-700 text-xs italic font-semibold">
              * Esta acción quedará registrada en el sistema
            </div>
          </>
        ) : (
          <div className="bg-red-50 border-2 border-red-600 rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3 text-red-700">
              <i className="fas fa-exclamation-triangle text-4xl"></i>
              <div>
                <p className="font-bold text-lg">
                  No se puede eliminar el trámite
                </p>
                <p className="text-sm mt-2">
                  El mismo tiene dependencias asociadas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-300">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
        {puedeEliminar && (
          <button
            onClick={handleEliminar}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-red-300"
          >
            {loading ? 'Eliminando...' : 'Aceptar'}
          </button>
        )}
      </div>
    </div>
  );
};