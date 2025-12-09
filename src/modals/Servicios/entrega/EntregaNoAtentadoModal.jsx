import React, { useState, useEffect } from 'react';
import { X, FileText, Edit2 } from 'lucide-react';
import { useNoAtentado } from '../../../hooks//useNoAtentados';
import { useModal } from '../../../hooks/useModal';
import ConfirmarEntregaNoAtentadoModal from './ConfirmarEntregaNoAtentadoModal';


export default function EntregaNoAtentadoModal({ onClose, cod_dtra, onSuccess }) {
  const {
    loading,
    obtenerDatosEntrega,
    guardarApoderado,
  } = useNoAtentado();

  const { openModal } = useModal();

  const [datos, setDatos] = useState(null);
  const [mostrarEditarApoderado, setMostrarEditarApoderado] = useState(false);
  
  const [formApoderado, setFormApoderado] = useState({
    ci: '',
    apellido: '',
    nombre: '',
    tipo: 'd',
  });

  useEffect(() => {
    cargarDatos();
  }, [cod_dtra]);

  const cargarDatos = async () => {
    const data = await obtenerDatosEntrega(cod_dtra);
    if (data) {
      setDatos(data);
      
      // Si hay apoderado, cargar sus datos
      if (data.apoderado) {
        setFormApoderado({
          ci: data.apoderado.apo_ci || '',
          apellido: data.apoderado.apo_apellido || '',
          nombre: data.apoderado.apo_nombre || '',
          tipo: data.tramite_noatentado.dtra_tipo_apoderado || 'd',
        });
      }
    }
  };

  const handleChangeApoderado = (e) => {
    const { name, value } = e.target;
    setFormApoderado(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarApoderado = async () => {
    if (!formApoderado.ci || !formApoderado.apellido || !formApoderado.nombre) {
      return;
    }

    const payload = {
      cdtra: cod_dtra,
      ci: formApoderado.ci,
      apellido: formApoderado.apellido,
      nombre: formApoderado.nombre,
      tipo: formApoderado.tipo,
    };

    const result = await guardarApoderado(payload);
    if (result) {
      await cargarDatos();
      setMostrarEditarApoderado(false);
    }
  };

  const handleAbrirEntrega = () => {
    openModal(ConfirmarEntregaNoAtentadoModal, {
      cod_dtra,
      onSuccess: () => {
        onSuccess && onSuccess();
      }
    });
  };

  const handleEntregaRapida = () => {
    // Si solo hay 1 candidato y no hay apoderado, hacer entrega directa
    openModal(ConfirmarEntregaNoAtentadoModal, {
      cod_dtra,
      autoSelectFirst: true,
      onSuccess: () => {
        onSuccess && onSuccess();
        onClose();
      }
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (!datos) {
    return (
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600">Cargando datos...</p>
        </div>
    );
  }

  const { tramite_noatentado, convocatoria, noatentados, apoderado } = datos;
  const yaEntregado = tramite_noatentado.dtra_entregado === 't' || tramite_noatentado.dtra_entregado === 'a';
  const tieneMultiplesOpciones = noatentados.length > 1 || tramite_noatentado.cod_apo !== '';

  return (
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <FileText size={24} />
            <h2 className="text-xl font-bold">TRAMITE CONVOCATORIA</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Título */}
          <div className="text-center mb-6">
            <h4 className="text-blue-600 font-bold text-xl">Convocatoria</h4>
          </div>

          <hr className="border-gray-300 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Columna izquierda - 5/12 */}
            <div className="lg:col-span-5 space-y-6">
              {/* Número de trámite */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 float-right w-fit">
                <h1 className="text-4xl font-bold text-red-600 text-center pr-3">
                  {tramite_noatentado.dtra_numero_tramite}
                </h1>
                <span className="text-sm text-gray-700 italic text-center block">
                  {formatearFecha(tramite_noatentado.dtra_fecha_registro)}
                </span>
              </div>

              <div className="clear-both"></div>

              {/* Datos de convocatoria */}
              <div>
                <p className="text-blue-600 font-bold italic mb-3 text-sm">
                  * Datos de la convocatoria
                </p>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                        Convocatoria:
                      </th>
                      <td className="text-left pl-4 py-2 text-gray-600 italic font-semibold">
                        {convocatoria?.con_nombre}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                        Trámite:
                      </th>
                      <td className="text-left pl-4 py-2 font-semibold">
                        {tramite_noatentado.tre_nombre}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                        Tipo de trámite:
                      </th>
                      <td className="text-left pl-4 py-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={tramite_noatentado.dtra_interno === 't'}
                            readOnly
                            className="mr-2"
                          />
                          {tramite_noatentado.dtra_interno === 't' ? 'INTERNO' : 'EXTERNO'}
                        </label>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <th className="text-right pr-4 py-2 font-medium text-blue-600 italic">
                        Nro. Control:
                      </th>
                      <td className="text-left pl-4 py-2">
                        <div>
                          {tramite_noatentado.dtra_control}
                          {tramite_noatentado.dtra_valorado_reintegro && (
                            <span className="ml-4">
                              <span className="text-blue-600 font-semibold italic">
                                Nro. Control Reintegro:
                              </span>{' '}
                              {tramite_noatentado.dtra_valorado_reintegro}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Datos del apoderado */}
              <div>
                {!mostrarEditarApoderado ? (
                  <div>
                    <p className="text-blue-600 font-bold italic mb-3 text-sm">
                      * Datos del apoderado
                    </p>
                    {apoderado ? (
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                              CI:
                            </th>
                            <td className="text-left pl-4 py-2">{apoderado.apo_ci}</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                              Nombre apoderado:
                            </th>
                            <td className="text-left pl-4 py-2">
                              {apoderado.apo_apellido} {apoderado.apo_nombre}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800">
                            <th className="text-right pr-4 py-2 font-medium text-gray-700 italic">
                              Tipo de apoderado:
                            </th>
                            <td className="text-left pl-4 py-2 text-blue-600 font-semibold">
                              {tramite_noatentado.dtra_tipo_apoderado === 'd' && 'Declaración jurada'}
                              {tramite_noatentado.dtra_tipo_apoderado === 'p' && 'Poder notariado'}
                              {tramite_noatentado.dtra_tipo_apoderado === 'c' && 'Carta de representación'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500 italic text-sm py-8">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </p>
                    )}
                    <button
                      onClick={() => setMostrarEditarApoderado(true)}
                      className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition float-right"
                    >
                      Editar datos del Apoderado
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded shadow p-3">
                    <button
                      onClick={() => setMostrarEditarApoderado(false)}
                      className="float-right text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                    <p className="text-blue-600 font-bold italic mb-4 text-sm">
                      * Editar datos del apoderado
                    </p>
                    
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-800">
                          <th className="text-right pr-4 py-2 font-medium text-gray-700 italic text-sm">
                            CI:
                          </th>
                          <td className="pl-4 py-2">
                            <input
                              type="text"
                              name="ci"
                              value={formApoderado.ci}
                              onChange={handleChangeApoderado}
                              className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <th className="text-right pr-4 py-2 font-medium text-gray-700 italic text-sm">
                            Apellidos:
                          </th>
                          <td className="pl-4 py-2">
                            <input
                              type="text"
                              name="apellido"
                              value={formApoderado.apellido}
                              onChange={handleChangeApoderado}
                              className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <th className="text-right pr-4 py-2 font-medium text-gray-700 italic text-sm">
                            Nombres:
                          </th>
                          <td className="pl-4 py-2">
                            <input
                              type="text"
                              name="nombre"
                              value={formApoderado.nombre}
                              onChange={handleChangeApoderado}
                              className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-800">
                          <th className="text-right pr-4 py-2 font-medium text-gray-700 italic text-sm align-top">
                            Tipo de apoderado:
                          </th>
                          <td className="pl-4 py-2">
                            <div className="space-y-1 text-sm">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="tipo"
                                  value="d"
                                  checked={formApoderado.tipo === 'd'}
                                  onChange={handleChangeApoderado}
                                  className="mr-2"
                                />
                                Declaración jurada
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="tipo"
                                  value="p"
                                  checked={formApoderado.tipo === 'p'}
                                  onChange={handleChangeApoderado}
                                  className="mr-2"
                                />
                                Poder notariado
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="tipo"
                                  value="c"
                                  checked={formApoderado.tipo === 'c'}
                                  onChange={handleChangeApoderado}
                                  className="mr-2"
                                />
                                Carta de representación
                              </label>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <button
                      onClick={handleGuardarApoderado}
                      disabled={loading}
                      className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition float-right disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - 7/12 */}
            <div className="lg:col-span-7 border border-gray-300 rounded shadow p-4 space-y-6">
              {/* Lista de candidatos */}
              <div>
                <p className="font-bold text-blue-600 italic mb-3 text-sm mt-8">
                  * Lista de candidatos
                </p>
                <div className="overflow-auto max-h-52 border rounded">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="border px-2 py-1">N°</th>
                        <th className="border px-2 py-1">Nombre</th>
                        <th className="border px-2 py-1">CI</th>
                        <th className="border px-2 py-1">COD SIS</th>
                        <th className="border px-2 py-1">Cargo</th>
                        <th className="border px-2 py-1">Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noatentados.map((n, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border px-2 py-1">{idx + 1}</td>
                          <td className="border px-2 py-1">
                            {n.per_nombre} {n.per_apellido}
                          </td>
                          <td className="border px-2 py-1">{n.per_ci}</td>
                          <td className="border px-2 py-1">{n.per_cod_sis}</td>
                          <td className="border px-2 py-1">{n.carg_nombre}</td>
                          <td className="border px-2 py-1">{n.noa_unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <hr className="border-gray-300" />

              {/* Datos del trámite */}
              <div>
                <p className="text-blue-600 italic font-bold mb-3 text-sm">
                  * Datos del trámite
                </p>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-500 text-white">
                    <tr>
                      <th className="px-3 py-2">Nº</th>
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2">Entregar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50">
                    <tr className="text-xs">
                      <td className="px-3 py-3 border-b">1</td>
                      <td className="px-3 py-3 border-b text-left">
                        <div>
                          <p>{tramite_noatentado.tre_nombre}</p>
                          <div className="text-xs text-gray-600 mt-1">
                            {tramite_noatentado.dtra_interno === 't' && (
                              <span className="font-semibold italic">
                                Trámite: <span className="text-red-600 font-bold">Interno</span> |{' '}
                              </span>
                            )}
                            <span className="font-semibold italic">
                              Valorado: <span className="font-normal">{tramite_noatentado.dtra_control}</span> |{' '}
                            </span>
                            {yaEntregado && (
                              <span className="font-semibold italic">
                                Fecha entrega:{' '}
                                <span className="text-blue-600 font-bold">
                                  {new Date(tramite_noatentado.dtra_fecha_recojo).toLocaleString('es-BO')}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right border-b">
                        {!yaEntregado ? (
                          tieneMultiplesOpciones ? (
                            <button
                              onClick={handleAbrirEntrega}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                            >
                              → Entregar
                            </button>
                          ) : (
                            <button
                              onClick={handleEntregaRapida}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                            >
                              → Entregar
                            </button>
                          )
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-green-600 text-xl">✓</span>
                            {tramite_noatentado.dtra_entregado === 'a' && (
                              <span className="text-xs font-bold text-green-600 italic">
                                Apoderado
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end border-t sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
  );
}