// 📁 components/reportes/ModalDetalleTramite.jsx
import React, { useState, useEffect } from 'react';
import { useReporteServicios } from '../../../hooks/useReporteServicios';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { ChartLine, X } from 'lucide-react';

export default function DetalleTramiteModal ({ onClose, cod_dtra }){
  const { loading, obtenerDetalleTramite } = useReporteServicios();
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    cargarDetalle();
  }, [cod_dtra]);

  const cargarDetalle = async () => {
    const data = await obtenerDetalleTramite(cod_dtra);
    if (data) {
      // Normalizar bitácora para evitar estructura anidada
      const bitacoraReal = data.bitacora?.original?.data || [];
      setDetalle({
        ...data,
      bitacora:bitacoraReal
      });
    }
  };

  const tipoTramiteNombre = (tipo) => {
    const tipos = {
      'L': 'LEGALIZACIÓN',
      'C': 'CERTIFICACIÓN',
      'F': 'CONFRONTACIÓN',
      'B': 'BÚSQUEDA'
    };
    return tipos[tipo] || tipo;
  };

  const nombreTitulo = (tipo) => {
    const titulos = {
      'D': 'Diploma Académico',
      'T': 'Título en Provisión Nacional',
      'C': 'Certificado',
      'O': 'Otro'
    };
    return titulos[tipo] || tipo;
  };

  const nombreDocumento = (doc) => {
    // Implementar según tus necesidades
    return doc;
  };

  const operacionBitacora = (operacion) => {
    const operaciones = {
      'I': 'INSERCIÓN',
      'U': 'ACTUALIZACIÓN',
      'D': 'ELIMINACIÓN'
    };
    return operaciones[operacion] || operacion;
  };

    const formatearFecha = (fecha) => {
        if (!fecha) return "";

        const [year, month, day] = fecha.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        });
    };


  const formatearFechaHora = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return `${date.toLocaleDateString('es-BO')} ${date.toLocaleTimeString('es-BO')}`;
  };

  if (loading || !detalle) {
    return (
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const { d_tramita, tramite, tramita, persona, titulo, confrontacion, bitacora } = detalle;

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
          className="p-1 rounded-full text-white hover:bg-gray-50/25 text-2xl font-bold transition cursor-pointer"
        >
          <X/>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 text-sm">
        <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-md w-2/3 mx-auto mb-6">
          <h5 className="text-center font-semibold">Detalle del trámite</h5>
        </div>

        {/* Información de la persona */}
        <div className="mb-4">
          <span className="text-blue-600 italic font-bold">Nombre: </span>
          <span className="text-gray-800 italic font-bold">
            {persona.per_nombre} {persona.per_apellido}
          </span>
          {' | '}
          <span className="text-blue-600 italic font-bold">CI: </span>
          <span className="text-gray-800 italic font-bold">{persona.per_ci}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Datos del trámite */}
          <div className="lg:col-span-1">
            <span className="text-blue-600 font-bold italic block mb-3">
              * Datos del trámite
            </span>
            
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <th className="text-right italic pr-2 py-1 align-top">Trámite:</th>
                  <td className="border-b border-gray-600 py-1">{tramite.tre_nombre}</td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-1 align-top">Tipo de trámite:</th>
                  <td className="border-b border-gray-600 py-1">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold italic">
                      {tipoTramiteNombre(tramite.tre_tipo)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-1 align-top">Fecha de solicitud:</th>
                  <td className="border-b border-gray-800 py-1">
                    {formatearFecha(tramita.tra_fecha_solicitud)}
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-1 align-top">Fecha de firma:</th>
                  <td className="border-b border-gray-800 py-1">
                    {formatearFecha(d_tramita.dtra_fecha_firma)}
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-1 align-top">Fecha de entrega:</th>
                  <td className="border-b border-gray-800 py-1">
                    {formatearFechaHora(d_tramita.dtra_fecha_recojo)}
                  </td>
                </tr>
                <tr>
                  <th className="text-right italic pr-2 py-1 align-top">Destino de trámite:</th>
                  <td className="border-b border-gray-800 py-1">
                    {d_tramita.dtra_interno === 't' ? 'Interno' : 'Externo'}
                  </td>
                </tr>

                {/* Datos del título */}
                {titulo && (
                  <>
                    <tr>
                      <td colSpan="2" className="text-blue-600 italic font-bold text-left pt-4">
                        * Datos del título
                      </td>
                    </tr>
                    <tr>
                      <th className="text-right italic pr-2 py-1 align-top">
                        Número de documento:
                      </th>
                      <td className="border-b border-gray-800 py-1">
                        {titulo.tit_nro_titulo}/{titulo.tit_gestion}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-right italic pr-2 py-1 align-top">
                        Tipo de documento:
                      </th>
                      <td className="border-b border-gray-800 py-1">
                        {nombreTitulo(titulo.tit_tipo)}
                      </td>
                    </tr>
                  </>
                )}

                {/* Datos de confrontación */}
                {confrontacion && confrontacion.length > 0 && (
                  <>
                    <tr>
                      <td colSpan="2" className="text-blue-600 italic font-bold text-left pt-4">
                        * Datos de otros documentos
                      </td>
                    </tr>
                    <tr>
                      <th className="text-right italic pr-2 py-1 align-top">Documentos:</th>
                      <td className="border-b border-gray-800 py-1">
                        {confrontacion.map((c, index) => (
                          <div key={index}>
                            {tramita.tra_tipo_tramite === 'F'
                              ? nombreDocumento(c.dcon_doc)
                              : c.dcon_doc}
                          </div>
                        ))}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Bitácora */}
          <div className="lg:col-span-2">
            <span className="text-red-600 italic font-bold block mb-3">* Bitácora</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-gray-600 px-2 py-1">#</th>
                    <th className="border border-gray-600 px-2 py-1">Operación</th>
                    <th className="border border-gray-600 px-2 py-1">Antiguo</th>
                    <th className="border border-gray-600 px-2 py-1 w-2">Nuevo</th>
                    <th className="border border-gray-600 px-2 py-1">Fecha y hora</th>
                    <th className="border border-gray-600 px-2 py-1">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {bitacora && bitacora.length > 0 ? (
                    bitacora.map((b, index) => (
                      <tr key={index} className="hover:bg-gray-200 text-gray-800">
                        <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-1">
                          {operacionBitacora(b.eve_operacion)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">{b.eve_antiguo}</td>
                        <td className="border border-gray-300 px-2 py-1 w-[200px] break-all">
                          {typeof b.eve_nuevo === 'object'
                            ? JSON.stringify(b.eve_nuevo)
                            : b.eve_nuevo}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {formatearFechaHora(b.created_at)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-blue-600">
                          * {b.bit_usuario}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border px-2 py-4 text-center text-gray-500">
                        No hay registros en la bitácora
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
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
        >
          Cerrar
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          onClick={() => {
            // Aquí puedes implementar la generación de PDF si es necesario
            window.open(`/generar-pdf/${cod_dtra}`, '_blank');
          }}
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
};