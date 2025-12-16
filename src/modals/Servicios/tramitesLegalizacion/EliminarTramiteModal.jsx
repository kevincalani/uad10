import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Trash2, CircleQuestionMark, CircleQuestionMarkIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { TIPO_TRAMITE, TRAMITE_COLORS } from '../../../Constants/tramiteDatos';
import { useTramitesLegalizacion } from '../../../hooks/useTramitesLegalizacion';

export default function EliminarTramiteModal({ cod_tra, onClose, onSuccess }) {
    const { cargarFormularioEliminarTramite, eliminarTramite } = useTramitesLegalizacion();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await cargarFormularioEliminarTramite(cod_tra);
                console.log(result.data)
                if (result.ok) {
                    setData(result.data);
                } else {
                    toast.error(result.error);
                    onClose();
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar los datos del trámite');
                onClose();
            } finally {
                setLoading(false);
            }
        };

        if (cod_tra) {
            fetchData();
        }
    }, [cod_tra]);

    // Manejar eliminación del trámite
    const handleEliminar = async () => {
        if (!data) return;

        try {
            setProcesando(true);

            const result = await eliminarTramite(cod_tra);

            if (result.ok) {
                toast.success(result.message || 'Trámite eliminado correctamente');

                // Ejecutar callback de éxito
                if (onSuccess) {
                    onSuccess(result.fecha);
                }

                // Cerrar modal
                onClose();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error al eliminar trámite:', error);
            toast.error('Error al eliminar el trámite');
        } finally {
            setProcesando(false);
        }
    };

    // Formatear fecha (replica el formato PHP: d/m/Y)
    const formatearFecha = (fecha) => {
        if (!fecha || fecha === '') return '-';
        
        try {
            const partes = fecha.split(/[-T\s]/)[0].split('-');
            
            if (partes.length === 3) {
                const [anio, mes, dia] = partes;
                return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${anio}`;
            }
            
            return '-';
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return '-';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        <p className="text-gray-600 font-medium">Cargando datos...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (!data) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6">
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-center text-red-600 font-medium">
                        Error al cargar los datos del trámite
                    </p>
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

    const { tramita, tiene_documentos } = data;
    const tipoTramite = TIPO_TRAMITE[tramita.tra_tipo_tramite];

    return (
        <div className="bg-white rounded-lg shadow-2xl w-3xl overflow-hidden flex flex-col">
            {/* Header - bg-danger */}
            <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <X size={32} className='p-1 rounded-full shadow-sm'/>
                    Eliminar trámite
                </h2>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition"
                >
                    <X size={32} className="rounded-full shadow-sm p-1 hover:bg-white/20 cursor-pointer" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Texto de confirmación */}
                <p className="italic text-gray-700 mb-4">
                    Esta seguro de eliminar el trámite de legalización:
                </p>

                {/* Contenedor principal con ícono */}
                <div className="flex items-start gap-4">
                    {/* Información del trámite - alert-danger */}
                    <div className="flex-1 bg-red-100 border border-red-300 rounded-lg shadow p-4">
                        {tiene_documentos ? (
                            // Si tiene documentos asociados - NO se puede eliminar
                            <div className="text-center py-6">
                                <CircleQuestionMark className="w-16 h-16 text-red-600 mx-auto mb-3" />
                                <p className="font-bold text-gray-800">
                                    No puede eliminar este trámite debido a que tiene documentos asociados
                                </p>
                            </div>
                        ) : (
                            // Mostrar datos del trámite
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Nro Trámite:
                                        </th>
                                        <td className="text-left py-2 border-b border-gray-800 text-gray-900">
                                            {tramita.tra_numero}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Fecha de solicitud:
                                        </th>
                                        <td className="text-left py-2 border-b border-gray-800 text-gray-900">
                                            {formatearFecha(tramita.tra_fecha_solicitud)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Titular:
                                        </th>
                                        <td className="text-left py-2 border-b border-gray-800 text-gray-900">
                                            {tramita.per_apellido} {tramita.per_nombre}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="text-right pr-4 py-2 text-gray-800 font-semibold italic">
                                            Tipo de trámite:
                                        </th>
                                        <td className="text-left py-2 border-b border-gray-800">
                                            <span
                                                className={`inline-block px-3 py-1 rounded text-white text-xs font-bold uppercase ${
                                                    TRAMITE_COLORS[tipoTramite]?.base || 'bg-gray-500'
                                                }`}
                                            >
                                                {tipoTramite}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Ícono de pregunta */}
                    <div className="text-red-600">
                        <CircleQuestionMark className="w-16 h-16" strokeWidth={2} />
                    </div>
                </div>

                {/* Advertencia */}
                <div className="mt-4 border border-red-500 rounded-lg p-3 text-red-600 font-bold italic text-xs max-w-2xl">
                    * Esta acción se quedará registrado en el sistema
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    disabled={procesando}
                >
                    Cerrar
                </button>
                {!tiene_documentos && (
                    <button
                        onClick={handleEliminar}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={procesando}
                    >
                        {procesando ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Aceptar
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}