// 📁 components/modals/apostilla/ObservacionModal.jsx
import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ObservacionModal({ cod_apos, onClose, onSuccess }) {
  const {
    loading,
    obtenerObservacion,
    guardarObservacion
  } = useApostilla();

  const [datos, setDatos] = useState(null);
  const [observacion, setObservacion] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerObservacion(cod_apos);
    if (data) {
      setDatos(data);
      setObservacion(data.tramite_apostilla?.apos_obs || '');
    }
  };

  const handleGuardar = async () => {
    const result = await guardarObservacion({
      ca: cod_apos,
      observacion
    });
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

  const { tramite_apostilla, persona } = datos;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-green-700 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText size={20} />
          <h2 className="text-lg font-bold">Observar trámite de apostilla</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-green-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="bg-green-700 text-white text-center py-2 rounded-lg mb-6">
          <h6 className="font-semibold">Formulario para observar trámite de apostilla</h6>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3 text-sm">
          <DataRow 
            label="Nombre" 
            value={`${persona?.per_apellido} ${persona?.per_nombre}`} 
          />
          <DataRow 
            label="Nº Trámite" 
            value={`UAD${tramite_apostilla?.apos_numero}`} 
          />
          <DataRow 
            label="Fecha ingreso" 
            value={tramite_apostilla?.apos_fecha_ingreso 
              ? new Date(tramite_apostilla.apos_fecha_ingreso).toLocaleDateString('es-ES')
              : '-'
            } 
          />
          
          <div className="pt-2">
            <label className="font-medium block mb-2 text-gray-700">Observación:</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={4}
              placeholder="Escriba la observación..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleGuardar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}

// Componente auxiliar reutilizable
function DataRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] border-b border-gray-300 py-2">
      <span className="text-right font-medium text-gray-700">{label}:</span>
      <span className="pl-3 text-gray-900">{value}</span>
    </div>
  );
}