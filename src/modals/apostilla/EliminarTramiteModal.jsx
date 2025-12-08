// 📁 components/modals/apostilla/EliminarTramiteModal.jsx
import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EliminarTramiteModal({ cod_apos, onClose, onSuccess }) {
  const {
    loading,
    verificarEliminarTramite,
    eliminarTramite
  } = useApostilla();

  const [datos, setDatos] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await verificarEliminarTramite(cod_apos);
    if (data) {
      setDatos(data);
    }
  };

  const handleEliminar = async () => {
    const result = await eliminarTramite(cod_apos);
    if (result) {
      onSuccess?.();
      onClose();
    }
  };

  if (loading || !datos) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="p-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const { tramite_apostilla, persona, eliminar } = datos;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-red-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} />
          <h2 className="text-lg font-bold">Eliminar trámite de apostilla</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-red-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        {eliminar ? (
          <>
            <p className="italic mb-6 text-gray-700">
              ¿Está seguro de eliminar el trámite?
            </p>

            <div className="flex gap-4 items-center">
              <div className="flex-1 bg-red-50 border-2 border-red-500 rounded-lg shadow-lg p-4 space-y-2 text-sm">
                <DataRow 
                  label="Nombre" 
                  value={`${persona?.per_apellido} ${persona?.per_nombre}`}
                  isDanger 
                />
                <DataRow 
                  label="Nº Trámite" 
                  value={`UAD${tramite_apostilla?.apos_numero}`}
                  isDanger 
                />
                <DataRow 
                  label="Fecha ingreso" 
                  value={tramite_apostilla?.apos_fecha_ingreso 
                    ? new Date(tramite_apostilla.apos_fecha_ingreso).toLocaleDateString('es-ES')
                    : '-'
                  }
                  isDanger 
                />
              </div>

              <div className="text-red-600">
                <AlertTriangle size={48} />
              </div>
            </div>

            <div className="mt-6 p-3 border-2 border-red-500 rounded-lg text-red-600 text-xs font-bold italic">
              * Esta acción se quedará registrada en el sistema
            </div>
          </>
        ) : (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <p className="text-center font-bold text-red-600">
              No se puede eliminar el trámite, debido a que tiene documentos 
              seleccionados para apostilla
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        {eliminar && (
          <button 
            onClick={handleEliminar}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Eliminando...' : 'Aceptar'}
          </button>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar
function DataRow({ label, value, isDanger = false }) {
  return (
    <div className={`grid grid-cols-[140px_1fr] ${isDanger ? 'border-b-2 border-red-500' : 'border-b border-gray-300'} py-2`}>
      <span className="text-right font-medium text-gray-700">{label}:</span>
      <span className={`pl-3 ${isDanger ? 'font-bold text-gray-900' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}