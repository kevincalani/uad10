// 📁 components/modals/apostilla/TramiteModal.jsx
import { useState, useEffect } from 'react';
import { X, FileText, Download, Eye } from 'lucide-react';
import { useApostilla } from '../../hooks/useApostilla';
import { usePersona } from '../../hooks/usePersona';
import { useModal } from '../../hooks/useModal';
import ObservacionModal from './ObservacionModal';
import DocumentosAgregados from '../../components/apostilla/DocumentosAgregados';
import DocumentosDisponibles from '../../components/apostilla/DocumentosDisponibles';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TramiteModal({ cod_apos = 0, fecha, onClose, onSuccess }) {
  const { openModal } = useModal();
  const {
    loading: loadingApostilla,
    obtenerDatosTramite,
    guardarTramite,
    guardarApoderadoTramite,
    generarPDFTramite
  } = useApostilla();

  const {
    loading: loadingPersona,
    cargarPersona,
    cargarApoderadoPorCi
  } = usePersona();

  // Estados principales
  const [codAposActual, setCodAposActual] = useState(cod_apos);
  const [tramite, setTramite] = useState(null);
  const [documentosAgregados, setDocumentosAgregados] = useState([]);
  const [documentosDisponibles, setDocumentosDisponibles] = useState([]);
  const [mostrarFormularioApoderado, setMostrarFormularioApoderado] = useState(false);

  // Formulario de persona
  const [formPersona, setFormPersona] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    celular: ''
  });

  // Formulario de apoderado
  const [formApoderado, setFormApoderado] = useState({
    ci_apoderado: '',
    nombre_apoderado: '',
    apellido_apoderado: '',
    tipo: 'd'
  });

  // Control de estados
  const [isCreating, setIsCreating] = useState(codAposActual === 0);
  const [tieneApoderado, setTieneApoderado] = useState(false);

  useEffect(() => {
    if (codAposActual !== 0) {
      cargarDatosTramite();
    }
  }, [codAposActual]);

  const cargarDatosTramite = async () => {
    const data = await obtenerDatosTramite(codAposActual);
    if (data) {
      setTramite(data.tramite_apostilla);
      setDocumentosAgregados(data.detalle_apostilla || []);
      setDocumentosDisponibles(data.apostilla || []);
      
      if (data.persona) {
        setFormPersona({
          ci: data.persona.per_ci || '',
          nombre: data.persona.per_nombre || '',
          apellido: data.persona.per_apellido || '',
          celular: data.persona.per_celular || ''
        });
      }

      if (data.apoderado) {
        setFormApoderado({
          ci_apoderado: data.apoderado.apo_ci || '',
          nombre_apoderado: data.apoderado.apo_nombre || '',
          apellido_apoderado: data.apoderado.apo_apellido || '',
          tipo: data.tramite_apostilla.apos_apoderado || 'd'
        });
        setTieneApoderado(true);
        setMostrarFormularioApoderado(false);
      } else {
        setTieneApoderado(false);
        // No mostrar formulario por defecto si no hay apoderado
        setMostrarFormularioApoderado(false);
      }
      
      setIsCreating(false);
    }
  };

  const handleBuscarPersona = async (ci) => {
    if (!ci || ci.length < 3) return;
    const personaData = await cargarPersona(ci);
    if (personaData) {
      setFormPersona(prev => ({
        ...prev,
        nombre: personaData.per_nombre || prev.nombre,
        apellido: personaData.per_apellido || prev.apellido,
        celular: personaData.per_celular || prev.celular
      }));
    }
  };

  const handleBuscarApoderado = async (ci) => {
    if (!ci || ci.length < 3) return;
    const apoderadoData = await cargarApoderadoPorCi(ci);
    if (apoderadoData) {
      setFormApoderado(prev => ({
        ...prev,
        nombre_apoderado: apoderadoData.apo_nombre || prev.nombre_apoderado,
        apellido_apoderado: apoderadoData.apo_apellido || prev.apellido_apoderado
      }));
    }
  };

  const handleGuardarNuevo = async () => {
    try {
      const data = await guardarTramite({ ...formPersona, ...formApoderado });
      if (data && data.tramite_apostilla) {
        // Cambiar al modo edición con el trámite recién creado
        setCodAposActual(data.tramite_apostilla.cod_apos);
        setIsCreating(false);
        onSuccess?.();
        // Recargar datos del trámite recién creado
        await cargarDatosTramite();
      }
    } catch (error) {
      console.error('Error al guardar trámite:', error);
    }
  };

  const handleGuardarApoderado = async () => {
    try {
      const data = await guardarApoderadoTramite({
        ...formApoderado,
        ca: codAposActual
      });
      if (data) {
        await cargarDatosTramite();
        setMostrarFormularioApoderado(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error al guardar apoderado:', error);
    }
  };

  const handleGenerarPDF = async () => {
    await generarPDFTramite(codAposActual);
  };

  const handleMostrarObservacion = () => {
    openModal(ObservacionModal, {
      cod_apos: codAposActual,
      onSuccess: () => cargarDatosTramite()
    });
  };

  const handleMostrarFormApoderado = () => {
    setMostrarFormularioApoderado(true);
  };

  const loading = loadingApostilla || loadingPersona;

  return (
    <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText size={20} />
          <h2 className="text-lg font-bold">Apostilla</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        {loading && !tramite ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="space-y-6">
            {/* Header con título */}
            <div className="bg-blue-600 rounded-lg shadow-sm">
              <div className="py-3 px-4">
                <h6 className="text-center text-white font-semibold">
                  {isCreating 
                    ? 'Formulario para crear trámite de apostilla'
                    : 'Formulario para editar trámite de apostilla'
                  }
                </h6>
              </div>
            </div>

            <hr className="border-gray-300" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna 1: Datos del trámite y formulario */}
              <div className="space-y-4">
                {/* Número de trámite */}
                {tramite && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 text-center">
                    <span className="text-sm text-blue-600 font-bold">TRÁMITE</span>
                    <h1 className="text-4xl font-bold text-red-600 my-2">
                      UAD{tramite.apos_numero}
                    </h1>
                    <span className="text-sm text-gray-600 italic">
                      {tramite.apos_fecha_ingreso 
                        ? new Date(tramite.apos_fecha_ingreso).toLocaleDateString('es-ES')
                        : ''
                      }
                    </span>
                  </div>
                )}

                {/* Formulario de datos personales - SOLO EN CREACIÓN */}
                {isCreating ? (
                  <div className="space-y-3">
                    <h3 className="text-right text-blue-600 font-semibold text-sm">
                      * DATOS PERSONALES
                    </h3>
                    
                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">CI:</label>
                      <input
                        type="text"
                        value={formPersona.ci}
                        onChange={(e) => setFormPersona({ ...formPersona, ci: e.target.value })}
                        onBlur={(e) => handleBuscarPersona(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">Nombres:</label>
                      <input
                        type="text"
                        value={formPersona.nombre}
                        onChange={(e) => setFormPersona({ ...formPersona, nombre: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">Apellidos:</label>
                      <input
                        type="text"
                        value={formPersona.apellido}
                        onChange={(e) => setFormPersona({ ...formPersona, apellido: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">Teléfono:</label>
                      <input
                        type="text"
                        value={formPersona.celular}
                        onChange={(e) => setFormPersona({ ...formPersona, celular: e.target.value })}
                        maxLength={8}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Datos del apoderado en creación */}
                    <h3 className="text-right text-blue-600 font-semibold text-sm mt-6">
                      * DATOS DEL APODERADO
                    </h3>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">CI apoderado:</label>
                      <input
                        type="text"
                        value={formApoderado.ci_apoderado}
                        onChange={(e) => setFormApoderado({ ...formApoderado, ci_apoderado: e.target.value })}
                        onBlur={(e) => handleBuscarApoderado(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">Apellidos:</label>
                      <input
                        type="text"
                        value={formApoderado.apellido_apoderado}
                        onChange={(e) => setFormApoderado({ ...formApoderado, apellido_apoderado: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <label className="text-right text-sm italic text-gray-700">Nombres:</label>
                      <input
                        type="text"
                        value={formApoderado.nombre_apoderado}
                        onChange={(e) => setFormApoderado({ ...formApoderado, nombre_apoderado: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                      <label className="text-right text-sm italic text-gray-700 pt-2">Tipo:</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="d"
                            checked={formApoderado.tipo === 'd'}
                            onChange={(e) => setFormApoderado({ ...formApoderado, tipo: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">Declaración jurada</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="p"
                            checked={formApoderado.tipo === 'p'}
                            onChange={(e) => setFormApoderado({ ...formApoderado, tipo: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">Poder notariado</span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleGuardarNuevo}
                      disabled={loading}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                ) : (
                  // Vista de solo lectura en edición
                  <div className="space-y-2 text-sm">
                    <h3 className="text-right text-blue-600 font-semibold">
                      * DATOS PERSONALES
                    </h3>
                    <DataRow label="CI" value={formPersona.ci} />
                    <DataRow label="Nombre" value={`${formPersona.nombre} ${formPersona.apellido}`} />
                    <DataRow label="Teléfono" value={formPersona.celular} />
                    <DataRow 
                      label="Fecha ingreso" 
                      value={tramite?.apos_fecha_ingreso 
                        ? new Date(tramite.apos_fecha_ingreso).toLocaleDateString('es-ES')
                        : '-'
                      } 
                    />

                    <h3 className="text-right text-blue-600 font-semibold mt-4">
                      * DATOS DEL APODERADO
                    </h3>

                    {tieneApoderado ? (
                      // Mostrar apoderado existente (solo lectura)
                      <>
                        <DataRow label="CI" value={formApoderado.ci_apoderado} />
                        <DataRow 
                          label="Nombre" 
                          value={`${formApoderado.nombre_apoderado} ${formApoderado.apellido_apoderado}`} 
                        />
                        <DataRow 
                          label="Tipo" 
                          value={formApoderado.tipo === 'd' ? 'Declaración jurada' : 'Poder notariado'} 
                        />
                      </>
                    ) : mostrarFormularioApoderado ? (
                      // Formulario para agregar apoderado
                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                          <label className="text-right text-sm italic text-gray-700">CI apoderado:</label>
                          <input
                            type="text"
                            value={formApoderado.ci_apoderado}
                            onChange={(e) => setFormApoderado({ ...formApoderado, ci_apoderado: e.target.value })}
                            onBlur={(e) => handleBuscarApoderado(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                          <label className="text-right text-sm italic text-gray-700">Apellidos:</label>
                          <input
                            type="text"
                            value={formApoderado.apellido_apoderado}
                            onChange={(e) => setFormApoderado({ ...formApoderado, apellido_apoderado: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                          <label className="text-right text-sm italic text-gray-700">Nombres:</label>
                          <input
                            type="text"
                            value={formApoderado.nombre_apoderado}
                            onChange={(e) => setFormApoderado({ ...formApoderado, nombre_apoderado: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                          <label className="text-right text-sm italic text-gray-700 pt-2">Tipo:</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="d"
                                checked={formApoderado.tipo === 'd'}
                                onChange={(e) => setFormApoderado({ ...formApoderado, tipo: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm">Declaración jurada</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value="p"
                                checked={formApoderado.tipo === 'p'}
                                onChange={(e) => setFormApoderado({ ...formApoderado, tipo: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm">Poder notariado</span>
                            </label>
                          </div>
                        </div>

                        <button
                          onClick={handleGuardarApoderado}
                          disabled={loading}
                          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? 'Guardando...' : 'Guardar Apoderado'}
                        </button>
                      </div>
                    ) : (
                      // Botón para mostrar formulario de apoderado
                      <div className="mt-2">
                        <button
                          onClick={handleMostrarFormApoderado}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          + Agregar Apoderado
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Columna 2: Documentos agregados */}
              {tramite && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <h3 className="text-red-600 font-bold italic text-sm">
                    * Trámites seleccionados
                  </h3>
                  
                  <DocumentosAgregados
                    documentos={documentosAgregados}
                    tramite={tramite}
                    onRefresh={cargarDatosTramite}
                  />

                  <div className="space-y-2">
                    <h3 className="text-red-600 font-bold italic text-xs">
                      * Observaciones
                    </h3>
                    <div className="border border-gray-300 rounded p-2 h-20 overflow-auto bg-gray-50 text-sm">
                      {tramite.apos_obs || 'Sin observaciones'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleMostrarObservacion}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      Observar
                    </button>
                    <button
                      onClick={handleGenerarPDF}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Columna 3: Lista de documentos disponibles */}
              {tramite && tramite.apos_estado < 2 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <DocumentosDisponibles
                    documentos={documentosDisponibles}
                    cod_apos={codAposActual}
                    tramite={tramite}
                    onRefresh={cargarDatosTramite}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
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

// Componente auxiliar para mostrar datos en formato tabla
function DataRow({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_1fr] border-b border-gray-300 py-1">
      <span className="text-right italic text-xs text-gray-700">{label}:</span>
      <span className="pl-2 text-sm">{value}</span>
    </div>
  );
}