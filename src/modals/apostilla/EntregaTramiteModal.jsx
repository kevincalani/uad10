
// 📁 components/modals/apostilla/EntregaTramiteModal.jsx
import { useState, useEffect } from 'react';
import { X, HandCoins } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';


export default function EntregaTramiteModal({ cod_apos, onClose, onSuccess }) {
  const {
    loading,
    obtenerDatosEntrega,
    registrarEntrega
  } = useApostilla();

  const [datos, setDatos] = useState(null);
  const [entregaA, setEntregaA] = useState('T');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerDatosEntrega(cod_apos);
    if (data) {
      setDatos(data);
      // Si tiene apoderado, por defecto entregar a apoderado
      if (data.apoderado) {
        setEntregaA('A');
      }
    }
  };

  const handleEntregar = async () => {
    const result = await registrarEntrega({
      ca: cod_apos,
      apo: entregaA
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

  const { tramite_apostilla, persona, apoderado } = datos;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <HandCoins size={20} />
          <h2 className="text-lg font-bold">Entrega de trámites</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="bg-blue-600 text-white text-center py-2 rounded-lg mb-6">
          <h6 className="font-semibold">Formulario de entrega de trámite de apostilla</h6>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="space-y-4">
          <DataRow 
            label="Nro. Trámite" 
            value={`UAD${tramite_apostilla?.apos_numero}`} 
          />

          <div className="grid grid-cols-[140px_1fr] gap-2 items-start border-b border-gray-300 pb-4">
            <label className="text-right font-medium text-gray-700 pt-2">Entregar a:</label>
            <div className="space-y-3">
              {apoderado && (
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="A"
                    checked={entregaA === 'A'}
                    onChange={(e) => setEntregaA(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{apoderado.apo_apellido} {apoderado.apo_nombre}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Apo
                    </span>
                  </div>
                </label>
              )}
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  value="T"
                  checked={entregaA === 'T'}
                  onChange={(e) => setEntregaA(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{persona?.per_apellido} {persona?.per_nombre}</span>
              </label>
            </div>
          </div>

          <div className="p-3 border-2 border-red-500 rounded-lg text-red-600 text-xs font-bold italic space-y-1">
            <p>* Esta acción se quedará registrada en el sistema</p>
            <p>* Si hace la entrega de este trámite, ya no se podrá modificar su estado</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cerrar
        </button>
        <button 
          onClick={handleEntregar}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Entregando...' : 'Entregar'}
        </button>
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