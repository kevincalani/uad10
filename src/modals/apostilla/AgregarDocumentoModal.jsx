// 📁 components/modals/apostilla/AgregarDocumentoModal.jsx
import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AgregarDocumentoModal({ cod_lis, cod_apos, onClose, onSuccess }) {
  const {
    loading,
    obtenerDatosAgregarDocumento,
    agregarDocumentoTramite
  } = useApostilla();

  const [datos, setDatos] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    gestion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerDatosAgregarDocumento(cod_lis, cod_apos);
    if (data) {
      setDatos(data);
    }
  };

  const handleSubmit = async () => {
    try {
      await agregarDocumentoTramite({
        cl: cod_lis,
        ca: cod_apos,
        ...formData
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error al agregar documento:', error);
    }
  };

  if (loading || !datos) {
    return (
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div className="p-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const { apostilla, tramite_apostilla, persona, apoderado } = datos;

  return (
    <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-green-700 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText size={20} />
          <h2 className="text-lg font-bold">Apostilla</h2>
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
          <h6 className="font-semibold">Formulario para agregar trámite de apostilla</h6>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Datos del trámite */}
          <div className="space-y-4">
            <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
              <span className="text-sm text-blue-600 font-bold">TRÁMITE</span>
              <h1 className="text-4xl font-bold text-red-600 my-2">
                UAD{tramite_apostilla?.apos_numero}
              </h1>
            </div>

            <div className="space-y-2 text-sm">
              <h3 className="text-right text-blue-600 font-semibold">
                * DATOS PERSONALES
              </h3>
              <DataRow label="CI" value={persona?.per_ci} />
              <DataRow label="Pasaporte" value={persona?.per_pasaporte || '-'} />
              <DataRow 
                label="Nombre" 
                value={`${persona?.per_nombre} ${persona?.per_apellido}`} 
              />
              <DataRow label="Teléfono" value={persona?.per_celular} />
              <DataRow 
                label="Fecha ingreso" 
                value={tramite_apostilla?.apos_fecha_ingreso 
                  ? new Date(tramite_apostilla.apos_fecha_ingreso).toLocaleDateString('es-ES')
                  : '-'
                } 
              />

              {apoderado && (
                <>
                  <h3 className="text-right text-blue-600 font-semibold mt-4">
                    * DATOS DEL APODERADO
                  </h3>
                  <DataRow label="CI" value={apoderado.apo_ci} />
                  <DataRow 
                    label="Nombre" 
                    value={`${apoderado.apo_nombre} ${apoderado.apo_apellido}`} 
                  />
                  <DataRow 
                    label="Tipo" 
                    value={tramite_apostilla?.apos_apoderado === 'd' 
                      ? 'Declaración jurada' 
                      : 'Poder notariado'
                    } 
                  />
                </>
              )}
            </div>
          </div>

          {/* Columna 2: Características del trámite */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-red-600 font-bold italic">
              * Características del trámite
            </h3>

            <div className="space-y-3">
              <DataRow label="Nombre del trámite" value={apostilla?.lis_nombre} />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {apostilla?.lis_tipo === 'sid' 
                    ? 'Número del trámite:' 
                    : 'Número del título:'
                  }
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Número"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-600">/</span>
                  <input
                    type="text"
                    placeholder="Gestión"
                    value={formData.gestion}
                    onChange={(e) => setFormData({ ...formData, gestion: e.target.value })}
                    maxLength={4}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
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
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Agregando...' : '+ Agregar'}
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