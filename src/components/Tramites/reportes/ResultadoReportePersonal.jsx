// 📁 components/reportes/ResultadoReportePersonal.jsx
import React from 'react';
import { useModal } from '../../../hooks/useModal';
import DetalleTramiteModal from '../../../modals/servicios/reportes/DetalleTramiteModal';
import { CircleArrowRight, Eye, FileText } from 'lucide-react';
import ObservarTramiteModal from '../../../modals/servicios/ObservarTramiteModal';

export default function ResultadoReportePersonal({ resultado, formData, onRegenerar }) {
  const { openModal } = useModal();
  console.log(resultado)
  const tipoTramiteNombre = (tipo) => {
    const tipos = {
      'L': 'Legalización',
      'C': 'Certificación',
      'F': 'Confrontación',
      'B': 'Búsqueda'
    };
    return tipos[tipo] || tipo;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO');
  };

  // Si es lista de personas (tipo_resultado === 'lista')
  if (resultado.tipo_resultado === 'lista') {
    return (
      <div>
        <span className="text-red-600 italic font-bold block mb-4">
          * Coincidencias encontradas, seleccione una persona
        </span>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Nombre</th>
              <th className="px-2 py-2">CI</th>
              <th className="px-2 py-2">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {resultado.resultado.map((persona, index) => (
              <tr key={persona.id_per} className="border-b hover:bg-gray-50">
                <td className="px-2 py-2">{index + 1}</td>
                <td className="px-2 py-2">{`${persona.per_nombre} ${persona.per_apellido}`}</td>
                <td className="px-2 py-2">{persona.per_ci}</td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => onRegenerar({ ...formData, ci: persona.per_ci, ip: persona.id_per })}
                    className="p-1 rounded-full text-blue-600 hover:text-blue-800 hover:bg-gray-200"
                    title="Ver trámites"
                  >
                    <CircleArrowRight/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Si es detalle de trámites (tipo_resultado === 'detalle')
  if (resultado.tipo_resultado === 'detalle') {
    if (resultado.resultado.length === 0) {
      return (
        <span className="text-red-600 font-bold italic">
          * No se encontraron resultados
        </span>
      );
    }

    return (
      <div>
        <h4 className="text-center text-blue-600 font-semibold mb-4">
          Resultado de la consulta
        </h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Trámite</th>
              <th className="px-2 py-2">#Trámite</th>
              <th className="px-2 py-2">Tipo</th>
              <th className="px-2 py-2">Fecha de ingreso</th>
              <th className="px-2 py-2">Fecha recojo</th>
              <th className="px-2 py-2">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {resultado.resultado.map((tramite, index) => (
              <tr key={tramite.cod_dtra} className="border-b hover:bg-gray-50">
                <td className="px-2 py-2">{index + 1}</td>
                <td className="px-2 py-2">{tramite.tre_nombre}</td>
                <td className="px-2 py-2">
                  {`${tramite.dtra_numero_tramite}/${tramite.dtra_gestion_tramite}`}
                </td>
                <td className="px-2 py-2">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold italic">
                    {tipoTramiteNombre(tramite.dtra_tipo)}
                  </span>
                </td>
                <td className="px-2 py-2">{formatearFecha(tramite.tra_fecha_solicitud)}</td>
                <td className="px-2 py-2">{formatearFecha(tramite.dtra_fecha_recojo)}</td>
                <td className="px-2 py-2">
                  {tramite.dtra_entregado ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(DetalleTramiteModal, { cod_dtra: tramite.cod_dtra })}
                        className="text-blue-600 hover:text-blue-800"
                        title="Mostrar Tramite"
                      >
                        <CircleArrowRight/>
                      </button>
                    </div>
                  ) : tramite.dtra_falso === 't' ? (
                    
                    <div className="flex flex-wrap items-center">
                        <span className="text-red-600">Observado</span>
                            <button
                            onClick={() => openModal(ObservarTramiteModal, { cod_dtra: tramite.cod_dtra })}
                            className="p-1 rounded-full shadow-sm text-red-600 hover:bg-gray-300"
                            title="Observado"
                        >
                        <Eye />
                        </button>
                    </div>
                  ) : tramite.dtra_generado === 't' ? (
                    <div className="flex flex-wrap items-center">
                      <span className="text-green-600">Por entregar</span>
                      <div>
                      <button
                        onClick={() => openModal(DetalleTramiteModal, { cod_dtra: tramite.cod_dtra })}
                        className="p-1 rounded-full shadow-sm text-blue-600 hover:bg-gray-300"
                        title="Mostrar Tramite"
                      >
                        <CircleArrowRight/>
                      </button>
                      <button
                        onClick={() => openModal(DetalleTramiteModal, { cod_dtra: tramite.cod_dtra })}
                        className="p-1 rounded-full shadow-sm text-gray-600 hover:bg-gray-300"
                        title="Ver PDF"
                      >
                        <FileText />
                      </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-blue-600">En proceso...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};