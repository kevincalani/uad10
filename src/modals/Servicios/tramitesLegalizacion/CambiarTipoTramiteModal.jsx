import React, { useState, useEffect } from 'react';
import { X, AlertCircle, RefreshCw, CircleQuestionMark, BadgeQuestionMark } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { useTramitesLegalizacion } from '../../../hooks/useTramitesLegalizacion';

export default function CambiarTipoTramiteModal({ cod_tra, onClose, onSuccess }) {
    const { cargarFormularioCambioTramite, cambiarTipoTramite } = useTramitesLegalizacion();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);

    // Formulario
    const [tipoTramite, setTipoTramite] = useState('');
    const [borrarDatos, setBorrarDatos] = useState(false);

    // Opciones de tipos de trámite
    const tiposTramite = [
        { value: 'L', label: 'LEGALIZACIÓN' },
        { value: 'C', label: 'CERTIFICACIÓN' },
        { value: 'B', label: 'BÚSQUEDA' },
        { value: 'F', label: 'CONFRONTACIÓN' },
    ];

    // Obtener nombre del tipo de trámite
    const getTipoTramiteNombre = (tipo) => {
        const tipos = {
            'L': 'Legalización',
            'C': 'Certificación',
            'F': 'Confrontación',
            'B': 'Búsqueda'
        };
        return tipos[tipo] || tipo;
    };

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await cargarFormularioCambioTramite(cod_tra);
                setData(result);
                setTipoTramite(result.tramita.tra_tipo_tramite);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar los datos del trámite');
            } finally {
                setLoading(false);
            }
        };

        if (cod_tra) {
            fetchData();
        }
    }, [cod_tra]);

    // Manejar cambio de tipo de trámite
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data) return;

        try {
            setProcesando(true);

            const formData = {
                ctra: cod_tra,
                tramite: tipoTramite,
                borrar_datos: borrarDatos
            };

            const result = await cambiarTipoTramite(formData);

            if (result.success) {
                toast.success(result.message || 'Tipo de trámite modificado correctamente');

                // Ejecutar callback de éxito
                if (onSuccess) {
                    onSuccess(result.data);
                }

                // Cerrar modal
                onClose();
            }
        } catch (error) {
            console.error('Error al cambiar tipo:', error);
            
            // Si tiene documentos asociados
            if (error.response?.data?.has_documents) {
                toast.error('No se puede modificar el tipo de trámite debido a que tiene documentos asociados');
            } else {
                toast.error('Error al modificar el tipo de trámite');
            }
        } finally {
            setProcesando(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl p-6">
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
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl p-6">
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

    const { tramita, docleg, persona } = data;
    const tieneDocumentos = !!docleg;

    return (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col">
            {/* Header - bg-danger */}
            <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CircleQuestionMark className="w-6 h-6" />
                    Cambiar tipo de trámite
                </h2>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    {/* Texto de confirmación */}
                    <p className="italic text-gray-700 mb-4">
                        Esta seguro de modificar el tipo de trámite de{' '}
                        <span className="font-bold text-gray-900">
                            {getTipoTramiteNombre(tramita.tra_tipo_tramite)}
                        </span>{' '}
                        a otro{' '}
                        <CircleQuestionMark className="inline w-4 h-4 text-red-600" />
                    </p>

                    {/* Si tiene documentos asociados - NO se puede modificar */}
                    {tieneDocumentos ? (
                        <div className="bg-red-100  rounded-lg shadow p-6 text-center">
                            <CircleQuestionMark className="w-16 h-16 text-red-600 mx-auto mb-3" />
                            <p className="font-bold text-red-800">
                                No puede modificar este trámite debido a que tiene documentos asociados
                            </p>
                        </div>
                    ) : (
                        // Formulario de cambio
                        <div className="grid grid-cols-2 gap-6">
                            {/* Columna izquierda - Datos del trámite */}
                            <div>
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th colSpan="2" className="text-right pb-4">
                                                <span className="text-blue-600 font-bold italic">
                                                    Datos del trámite :
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-800">
                                            <th className="text-right pr-4 py-2 text-gray-800 italic">
                                                Tipo de trámite:
                                            </th>
                                            <td className="py-2">
                                                <span className="inline-block bg-red-600 text-white font-bold italic px-3 py-1 rounded">
                                                    {getTipoTramiteNombre(tramita.tra_tipo_tramite)}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-800">
                                            <th className="text-right pr-4 py-2 text-gray-800 italic">
                                                Número de trámite:
                                            </th>
                                            <td className="py-2 text-gray-900">
                                                {tramita.tra_numero}
                                            </td>
                                        </tr>
                                        {persona && (
                                            <tr className="border-b border-gray-800">
                                                <th className="text-right pr-4 py-2 text-gray-800 italic">
                                                    Pertenece a:
                                                </th>
                                                <td className="py-2 text-gray-900">
                                                    {persona.per_apellido} {persona.per_nombre}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Advertencia */}
                                <div className="mt-4 border border-red-500 rounded-lg p-3 text-red-600 font-bold italic text-xs">
                                    * Esta acción se quedará registrado en el sistema
                                </div>
                            </div>

                            {/* Columna derecha - Formulario */}
                            <div className="border shadow-sm rounded-lg pl-6 pr-12 py-6 border-gray-200">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th colSpan="2" className="text-right pb-4">
                                                <span className="text-blue-600 font-bold italic">
                                                    Formulario para el cambio de trámite :
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className="text-right pr-4 py-3 text-gray-800 font-bold italic align-top">
                                                Tipo de trámite:
                                            </th>
                                            <td className="py-2">
                                                <select
                                                    value={tipoTramite}
                                                    onChange={(e) => setTipoTramite(e.target.value)}
                                                    className="w-full border-2 border-blue-400 rounded px-3 py-2 focus:outline-none focus:border-blue-600 text-sm"
                                                    required
                                                >
                                                    <option value={tramita.tra_tipo_tramite}>
                                                        {getTipoTramiteNombre(tramita.tra_tipo_tramite).toUpperCase()}
                                                    </option>
                                                    {tiposTramite
                                                        .filter(t => t.value !== tramita.tra_tipo_tramite)
                                                        .map(tipo => (
                                                            <option key={tipo.value} value={tipo.value}>
                                                                {tipo.label}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-right pr-4 text-gray-800 italic">
                                                Borrar datos personales:
                                            </th>
                                            <td className="py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={borrarDatos}
                                                    onChange={(e) => setBorrarDatos(e.target.checked)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        disabled={procesando}
                    >
                        Cancelar
                    </button>
                    {!tieneDocumentos && (
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={procesando}
                        >
                            {procesando ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Cambiar
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}