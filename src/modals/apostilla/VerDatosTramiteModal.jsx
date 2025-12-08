
// 📁 components/modals/apostilla/VerDatosTramiteModal.jsx
import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import LoadingSpinner from '../../components/common/LoadingSpinner';
LoadingSpinner

export default function VerDatosTramiteModal({ cod_apos, onClose }) {
  const { loading, verDatosTramite } = useApostilla();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await verDatosTramite(cod_apos);
    if (data) {
      setDatos(data);
    }
  };

  if (loading || !datos) {
    return (
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl">
        <div className="p-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const { apostilla, persona, apoderado, detalle_apostilla } = datos;

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-green-700 text-white">
        <div className="flex items-center gap-2">
          <FileText size={20} />
          <h2 className="text-lg font-bold">Apostilla - Detalle del trámite</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-green-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-green-700 text-white text-center py-2 rounded-lg mb-6">
          <h6 className="font-semibold">Detalle de la búsqueda</h6>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna 1: Datos personales y del trámite */}
          <div className="space-y-3 text-sm">
            <h3 className="text-right text-blue-600 font-semibold">
              * DATOS PERSONALES
            </h3>
            
            <DataRow label="CI" value={persona?.per_ci} />
            <DataRow 
              label="Nombre" 
              value={`${persona?.per_nombre} ${persona?.per_apellido}`} 
            />
            <DataRow label="Teléfono" value={persona?.per_celular || '-'} />

            <h3 className="text-right text-blue-600 font-semibold mt-4">
              * DATOS DEL TRÁMITE
            </h3>

            <DataRow 
              label="N° Trámite" 
              value={`${apostilla?.apos_numero}/${apostilla?.apos_gestion}`} 
            />
            <DataRow 
              label="Fecha ingreso" 
              value={apostilla?.apos_fecha_ingreso 
                ? new Date(apostilla.apos_fecha_ingreso).toLocaleDateString('es-ES')
                : '-'
              } 
            />
            <DataRow 
              label="Fecha firma" 
              value={apostilla?.apos_fecha_firma 
                ? new Date(apostilla.apos_fecha_firma).toLocaleDateString('es-ES')
                : '-'
              } 
            />
            <DataRow 
              label="Fecha recojo" 
              value={apostilla?.apos_fecha_recojo 
                ? new Date(apostilla.apos_fecha_recojo).toLocaleDateString('es-ES')
                : '-'
              } 
            />

            <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 py-2">
              <span className="text-right font-medium text-red-600 text-xs">Entregado a:</span>
              <div className="pl-3">
                {apostilla?.apos_entregado === 'T' && (
                  <span className="font-bold text-sm">
                    {persona?.per_nombre} {persona?.per_apellido}
                  </span>
                )}
                {apostilla?.apos_entregado === 'A' && apoderado && (
                  <div className="space-y-1">
                    <span className="font-bold text-sm">
                      {apoderado.apo_nombre} {apoderado.apo_apellido}
                    </span>
                    <div>
                      {apostilla.apos_apoderado === 'd' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Declaración Jurada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Poder notariado
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {!apostilla?.apos_entregado && <span>-</span>}
              </div>
            </div>

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
                
                <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 py-2">
                  <span className="text-right font-medium text-xs">Tipo:</span>
                  <div className="pl-3 flex gap-3 text-xs">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={apostilla?.apos_apoderado === 'd'}
                        readOnly
                        className="w-3 h-3"
                      />
                      <span>Declaración jurada</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={apostilla?.apos_apoderado === 'p'}
                        readOnly
                        className="w-3 h-3"
                      />
                      <span>Poder notariado</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Columna 2-3: Lista de documentos */}
          <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4">
            <h3 className="text-red-600 font-bold italic mb-3 text-sm">
              * Documentos agregados al trámite
            </h3>
            
            <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gradient-to-r from-red-500 to-red-600 text-white sticky top-0">
                  <tr>
                    <th className="p-2 text-left font-semibold">Nº</th>
                    <th className="p-2 text-left font-semibold">Sitra</th>
                    <th className="p-2 text-left font-semibold">Nombre</th>
                    <th className="p-2 text-left font-semibold">N° trámite</th>
                    <th className="p-2 text-left font-semibold">N° Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle_apostilla && detalle_apostilla.length > 0 ? (
                    detalle_apostilla.map((doc, index) => (
                      <tr key={doc.cod_dapo} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">-</td>
                        <td className="p-2 font-bold italic">{doc.lis_nombre}</td>
                        <td className="p-2">{doc.dapo_numero}</td>
                        <td className="p-2">
                          {doc.dapo_numero_documento}/{doc.dapo_gestion_documento}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No hay documentos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// Componente auxiliar
function DataRow({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 py-1">
      <span className="text-right italic text-xs text-gray-700">{label}:</span>
      <span className="pl-3 text-sm">{value}</span>
    </div>
  );
}